# Missing Persistence Layer — Invoice Pro

> Persistence (a real DB) does not exist (**[VERIFIED]**). This document is the **[RECOMMENDED]** target persistence design.

---

## 1. Current state (verified)

- **[VERIFIED]** Data lives in `src/app/data/store.ts` as four private arrays initialised from `mockData.ts` via JSON deep clone.
- **[VERIFIED]** No `localStorage`, `sessionStorage`, `IndexedDB`, Service Worker, or any external persistence mechanism is used.
- **[VERIFIED]** Browser refresh resets all state to seed.

Consequences:
- A user cannot save work between sessions.
- Two browser tabs hold two independent datasets.
- No concept of history, rollback, audit, or backup.

---

## 2. Recommended persistence stack

**[RECOMMENDED]**:

| Layer | Choice | Rationale |
|---|---|---|
| Transactional DB | PostgreSQL 14+ | Strong relational fit for invoices (FKs, sum invariants, partial uniqueness). |
| Cache / queue | Redis 7+ | Sessions, rate limit, idempotency, BullMQ queues. |
| Object storage | S3 (or MinIO on-prem) | PDFs, attachments, exports. |
| Audit storage | Same Postgres DB, append-only table with revoked UPDATE/DELETE privileges | Single backup; transactional consistency with the writes that produced it. |
| Search index (optional) | Postgres full-text OR Meilisearch | Cross-entity search. |

> If the team mandates MongoDB instead of Postgres, see §9 for collection sketches. The trade-off: stronger schema-less flexibility but you must enforce uniqueness, sum invariants, and referential integrity in application code (no SQL CHECK, no DB-level FK).

---

## 3. Schema (Postgres)

The authoritative schema is in `database/database-dictionary.md`. Highlights:

- 11 core tables: `tenants`, `users`, `customers`, `products`, `invoices`, `invoice_items`, `payments`, `quotations`, `quotation_items`, `templates`, `tenant_settings`, `user_notification_prefs`, `audit_logs`.
- All business tables include `tenant_id UUID NOT NULL`.
- All business tables include `created_at`, `updated_at`, `deleted_at` (soft delete) — except `payments` and `audit_logs` (append-only).
- Composite uniqueness scoped by tenant: `UNIQUE(tenant_id, invoice_number)`, `UNIQUE(tenant_id, quotation_number)`, etc.
- Partial unique index on `templates` enforces "one default per tenant".
- Row-Level Security (RLS) policies enforce tenant isolation as defence-in-depth.

### Recommended database views

| View | Purpose |
|---|---|
| `v_open_invoices` | Non-draft invoices with `remaining_balance > 0`. |
| `v_customer_debt` | Per-customer rollup with the unified 4-bucket aging (RULE-001 fix). |
| `v_monthly_revenue` | Σ paid by month (cash basis) and Σ invoiced by month (accrual basis) — answers RULE-003. |

### Recommended functions

| Function | Purpose |
|---|---|
| `fn_recompute_overdue()` | Mirror of the client's `updateOverdueStatuses` — flip `unpaid|partial` → `overdue` based on `due_date < CURRENT_DATE`. Called nightly + on demand. |
| `fn_expire_quotations()` | Flip `sent` → `expired` based on `valid_until < CURRENT_DATE`. Nightly. |
| `fn_allocate_invoice_number(tenant uuid)` | Atomic `UPDATE tenant_settings SET next_invoice_number = next_invoice_number + 1 RETURNING invoice_prefix || to_char(now(),'YYYY') || '-' || lpad(...)`. |

---

## 4. Constraints & invariants enforced at the DB

| Constraint | DDL example |
|---|---|
| `paid_amount ≤ total` | `CHECK (paid_amount BETWEEN 0 AND total)` |
| `remaining_balance = total − paid_amount` | `CHECK (remaining_balance = total - paid_amount)` |
| `line_total = quantity × unit_price − discount` | `CHECK (line_total = quantity * unit_price - discount)` |
| `quantity > 0`, `unit_price ≥ 0`, `discount ≥ 0` | `CHECK` |
| `payment.amount > 0` | `CHECK` |
| One default template per tenant | `CREATE UNIQUE INDEX … ON templates(tenant_id) WHERE is_default` |
| Quotation `valid_until ≥ issue_date` | `CHECK (valid_until >= issue_date)` |

> **[RECOMMENDED]** treat these constraints as required (not optional) so the DB rejects any application bug that violates an invariant.

---

## 5. Indexing strategy

| Table | Recommended indexes |
|---|---|
| `invoices` | `(tenant_id, status)`, `(tenant_id, customer_id)`, `(tenant_id, due_date)` (for overdue scan), `(tenant_id, issue_date DESC)` (for dashboard recent invoices), full-text on `invoice_number || customer_name` for search |
| `invoice_items` | `(invoice_id, position)` |
| `payments` | `(tenant_id, invoice_id)`, `(tenant_id, payment_date)` |
| `quotations` | `(tenant_id, status)`, `(tenant_id, customer_id)` |
| `customers` | `(tenant_id, lower(name))`, `(tenant_id, phone)` |
| `products` | `(tenant_id, category)`, full-text on `name || description` |
| `audit_logs` | `(tenant_id, resource_type, resource_id, occurred_at DESC)` |

---

## 6. Transaction boundaries (target)

| Operation | Transaction |
|---|---|
| Create invoice | One TX: allocate number (UPDATE tenant_settings) + INSERT invoices + INSERT N invoice_items + INSERT audit_log + emit notification job. |
| Add payment | One TX: INSERT payments + UPDATE invoices (paid_amount, remaining_balance, status) + INSERT audit_log + emit notification job. |
| Void invoice (ADMIN) | One TX: UPDATE invoices SET status='void' + INSERT reverse payment entries + INSERT audit_log. |
| Convert quotation | One TX: INSERT invoice + INSERT invoice_items + UPDATE quotations SET converted_invoice_id + INSERT audit_log. |

> Long-running operations (PDF render, email send) must NOT participate in the request transaction — enqueue them after commit.

---

## 7. Backup, DR, retention

**[RECOMMENDED]**:

- **PITR** (Point-in-Time Recovery) configured on Postgres (WAL archiving to S3) with 7-day window.
- Nightly logical dumps (`pg_dump`) shipped to S3 with 30-day retention.
- Quarterly restore drill.
- **Invoice retention: 10 years** (Vietnam tax record requirement) — never hard-delete invoice or payment rows; only soft-delete invoices.
- Personal data deletion requests honoured only outside the retention window OR via PII anonymisation (replace `customer_name/phone/email/address` with hashed placeholders while preserving the financial record).

---

## 8. Migration strategy from prototype to backend

1. **Stage 0 — Today.** Prototype with in-memory `DataStore`. Mock data only.
2. **Stage 1 — Define schema.** Write migrations matching `database/database-dictionary.md`. Spin up Postgres locally. Seed with the same data as `mockData.ts`.
3. **Stage 2 — Build CRUD endpoints** per module. Validate against `qa/validation-rules.md` and the per-module SRS files.
4. **Stage 3 — Front-end adapter swap.** Replace the `inMemoryAdapter` (wrapping `store.ts`) with `httpAdapter`. Pages do not change.
5. **Stage 4 — Wire async workers.** Overdue scan, quotation expiry, PDF render, email send.
6. **Stage 5 — Cutover.** Disable in-memory store; ship.

---

## 9. MongoDB alternative (sketch)

If the team chooses MongoDB despite the relational fit, the rough collection layout would be:

| Collection | Document shape |
|---|---|
| `tenants` | `{ _id, name, createdAt, updatedAt }` |
| `users` | `{ _id, tenantId, email, passwordHash, fullName, role, status, … }` — unique index `{ tenantId: 1, email: 1 }` |
| `customers` | `{ _id, tenantId, code, name, phone, email, address, taxCode?, status, … }` |
| `products` | `{ _id, tenantId, code, name, category, unit, price, stock, description?, … }` |
| `invoices` | `{ _id, tenantId, invoiceNumber, customerId, customerSnapshot{}, issueDate, dueDate, status, items[{productId, productSnapshot, qty, unitPrice, discount, lineTotal}], totals{subtotal, discount, tax, shipping, total, paidAmount, remainingBalance}, payments[]{amount, paymentDate, method, reference?, note?, createdBy, createdAt}, salespersonUserId?, templateId?, createdBy, createdAt, updatedAt, deletedAt? }` |
| `quotations` | `{ _id, tenantId, quotationNumber, customerId, customerSnapshot, issueDate, validUntil, status, items[], total, convertedInvoiceId?, … }` |
| `templates` | `{ _id, tenantId, name, paperSize, orientation, margins, primaryColor, blocks[], customHTML?, isCustomHTML, isDefault, isActive, … }` |
| `tenantSettings` | `{ _id: tenantId, company{}, invoice{prefix, nextNumber, defaultDueDays, defaultTaxRate, autoTax, autoEmail, paymentReminder}, updatedAt }` |
| `auditLogs` | `{ _id, tenantId, actorUserId, actorRole, action, resourceType, resourceId, before?, after?, ip, userAgent, occurredAt }` |

Trade-offs vs. Postgres:
- **Pros:** payments can be embedded inside invoice (matches the current TS shape), no JOIN to render invoice detail.
- **Cons:** must enforce invariants (sum of payments = paidAmount; partial-unique default template; FK integrity) in application code. Reporting aggregates require pipelines, not SQL. Multi-collection transactions (4.0+) needed for the Create invoice and Add payment flows.

> The strong recommendation remains **PostgreSQL**.

---

## 10. Related documents

- `database/database-dictionary.md` — full table specs.
- `database/entity-relationships.md` — ER + cardinalities.
- `architecture/missing-backend-components.md` — what runs above the DB.
- `architecture/missing-audit-system.md` — audit log specifics.
- `architecture/state-management-strategy.md` — how the frontend talks to the persistence tier.
