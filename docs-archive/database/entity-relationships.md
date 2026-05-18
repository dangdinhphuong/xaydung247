# Entity-Relationship Model — Invoice Pro

> Visual model of the target schema described in `database-dictionary.md`. ASCII because no Mermaid renderer is guaranteed.

---

## 1. ER diagram (textual)

```
                            ┌──────────────────┐
                            │     tenants      │
                            │ id (PK)          │
                            └────────┬─────────┘
                                     │ 1
            ┌────────────┬───────────┼───────────┬────────────┬────────────┐
            │            │           │           │            │            │
            ▼ N          ▼ N         ▼ N         ▼ N          ▼ N          ▼ 1
     ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐
     │   users    │ │customers │ │ products │ │templates │ │ audit_   │ │ tenant_settings  │
     │ id (PK)    │ │ id (PK)  │ │ id (PK)  │ │ id (PK)  │ │ logs     │ │ tenant_id (PK)   │
     │ tenant_id  │ │ tenant_id│ │ tenant_id│ │ tenant_id│ │          │ └──────────────────┘
     │ role       │ └────┬─────┘ └────┬─────┘ │is_default│ └──────────┘
     └────┬───────┘      │ 1          │ 1     └──────────┘
          │ 1            │            │ 0..1
          ▼ N            ▼ N          ▼ N
     ┌────────────┐ ┌──────────────┐ ┌─────────────────┐
     │ user_      │ │ invoices     │ │ invoice_items   │
     │ notification│ │ id (PK)      │◀┤ invoice_id (FK) │
     │ _prefs     │ │ tenant_id    │ │ product_id (FK) │
     │ user_id    │ │ customer_id  │ │ position        │
     └────────────┘ │ template_id  │ └─────────────────┘
                    │ status       │
                    │ created_by   │ 1
                    └──────┬───────┘
                           │ 1
                           ▼ N
                    ┌──────────────┐
                    │  payments    │
                    │ id (PK)      │
                    │ invoice_id   │
                    │ method       │
                    │ created_by   │
                    └──────────────┘

     customers ──1─┐
                   │ N
                   ▼
             ┌──────────────┐         ┌─────────────────────┐
             │ quotations   │◀──── 1──┤ quotation_items     │
             │ id (PK)      │      N  │ quotation_id (FK)   │
             │ tenant_id    │         │ product_id (FK)     │
             │ customer_id  │         └─────────────────────┘
             │ status       │
             │ converted_   │ 0..1
             │  invoice_id  │──────────────────────────────▶ invoices
             │ created_by   │
             └──────────────┘
```

---

## 2. Cardinalities

| Relationship | Cardinality | Notes |
|---|---|---|
| tenants → users | 1 : N | A user belongs to exactly 1 tenant. |
| tenants → customers | 1 : N | — |
| tenants → products | 1 : N | — |
| tenants → invoices | 1 : N | — |
| tenants → quotations | 1 : N | — |
| tenants → templates | 1 : N | At most 1 with `is_default=true`. |
| customers → invoices | 1 : N | A customer has many invoices; invoice belongs to exactly 1 customer (FK NOT NULL). |
| customers → quotations | 1 : N | — |
| invoices → invoice_items | 1 : N | Cascade delete. |
| invoices → payments | 1 : N | Append-only; no cascade delete (payments outlive invoice soft-delete). |
| products → invoice_items | 1 : N (nullable) | Allows free-form items. |
| products → quotation_items | 1 : N (nullable) | — |
| users → invoices (created_by) | 1 : N | — |
| users → invoices (salesperson) | 0..1 : N | Optional. |
| users → payments (created_by) | 1 : N | — |
| users → quotations (created_by) | 1 : N | — |
| templates → invoices | 1 : N | Invoice locks the template used at issue. |
| quotations → invoices | 0..1 : 1 | A quotation may convert to one invoice; one invoice may originate from at most one quotation. |
| users → user_notification_prefs | 1 : 1 | — |
| tenants → tenant_settings | 1 : 1 | — |

---

## 3. Referential integrity policy

| Parent → Child | On parent delete | Rationale |
|---|---|---|
| invoices → invoice_items | CASCADE | Items meaningless without invoice. |
| invoices → payments | RESTRICT | Payments are financial; prevent loss. Use soft-delete on invoice instead. |
| customers → invoices | RESTRICT | Cannot hard-delete a customer with invoices; only soft-deactivate. |
| customers → quotations | RESTRICT | Same. |
| products → invoice_items | SET NULL | Keep historical line item; lose link to (renamed) product. |
| products → quotation_items | SET NULL | Same. |
| users → invoices.created_by | RESTRICT | Cannot delete a user who has acted; deactivate instead. |
| tenants → * | RESTRICT (or full-tenant export+purge job) | Multi-tenant safety. |

---

## 4. Computed columns / views

### 4.1 View: `v_open_invoices`
```sql
CREATE VIEW v_open_invoices AS
SELECT i.*
FROM invoices i
WHERE i.deleted_at IS NULL
  AND i.status != 'draft'
  AND i.remaining_balance > 0;
```

### 4.2 View: `v_customer_debt`
```sql
CREATE VIEW v_customer_debt AS
SELECT
  c.tenant_id,
  c.id            AS customer_id,
  c.name          AS customer_name,
  COALESCE(SUM(i.remaining_balance), 0) AS total_debt,
  COUNT(i.id)                            AS unpaid_invoices_count,
  COUNT(*) FILTER (WHERE i.status = 'overdue') AS overdue_invoices_count,
  COALESCE(SUM(i.remaining_balance) FILTER (WHERE (CURRENT_DATE - i.due_date) <= 30), 0) AS aging_current,
  COALESCE(SUM(i.remaining_balance) FILTER (WHERE (CURRENT_DATE - i.due_date) BETWEEN 31 AND 60), 0) AS aging_31_60,
  COALESCE(SUM(i.remaining_balance) FILTER (WHERE (CURRENT_DATE - i.due_date) > 60), 0) AS aging_61_plus
FROM customers c
LEFT JOIN v_open_invoices i ON i.customer_id = c.id
GROUP BY c.tenant_id, c.id, c.name;
```

### 4.3 Function `fn_recompute_overdue()` — nightly cron
```sql
UPDATE invoices
SET status = 'overdue'
WHERE deleted_at IS NULL
  AND status IN ('unpaid', 'partial')
  AND remaining_balance > 0
  AND due_date < CURRENT_DATE;
```

Mirrors `store.updateOverdueStatuses()`. Should also run on-demand inside `GET /api/invoices` for live correctness.

---

## 5. Tenant-isolation rule

Every query MUST include `WHERE tenant_id = :session_tenant_id`. Recommended Postgres pattern:
```sql
SET app.current_tenant = '…uuid…';
-- Row-Level Security policy:
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY invoices_tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```
