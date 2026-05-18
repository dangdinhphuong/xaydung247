# API Contract — Customers

> **[RECOMMENDED]** — see `future-architecture/customers.md`.

---

## `Customer` shape
```json
{
  "id": "uuid",
  "code": "CUST001",
  "name": "Công ty TNHH Xây Dựng Hoàng Long",
  "phone": "0912345678",
  "email": "...",
  "address": "...",
  "taxCode": "0123456789",
  "status": "active|inactive",
  "currentDebt": "30100000",   // derived; decimal string
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## GET `/customers`
- **Permission:** `Customer:list`.
- **Query:** `?search=&status=&page=&size=&sort=name:asc`.
- **Response 200:** `{ data: Customer[], page: {...} }`.
- **Notes:** SALES sees only `created_by_user_id = currentUser.id` rows.

---

## POST `/customers`
- **Permission:** `Customer:create`.
- **Idempotency:** recommended.

### Request
```json
{ "name": "...", "phone": "...", "email": "...", "address": "...", "taxCode": null, "status": "active" }
```

### Validation
| Field | Rule | Error |
|---|---|---|
| name | 2–200 | `V-CUST-01` |
| phone | `^0\d{9,10}$` | `V-CUST-02` |
| email | RFC-5322 | `V-CUST-03` |
| address | ≤300 | `V-CUST-06` |
| taxCode | optional; VN MST | `V-CUST-04` |
| (name+phone) uniqueness | within tenant | `V-CUST-05` |

### Response 201: `Customer`.

### Audit
`customer.create`.

---

## GET `/customers/:id`
- **Permission:** `Customer:list`.
- **Response 200:** `Customer & { invoicesSummary: { totalCount, openCount, totalDebt } }`.

---

## PATCH `/customers/:id`
- **Permission:** `Customer:update`.
- **Header:** `If-Match`.
- **Request:** partial.
- **Validation:** as POST.
- **Response 200:** `Customer`.
- **Audit:** `customer.update`.

---

## POST `/customers/:id/deactivate`
- **Permission:** `Customer:update`.
- **Response 200:** `Customer` (status='inactive').
- **Side-effect:** customer disappears from the pickers on `/invoices/create` and `/quotations/new`.
- **Audit:** `customer.deactivate`.

---

## DELETE `/customers/:id`
- **Permission:** `Customer:delete` (ADMIN only).
- **Behavior:** soft delete (`deleted_at = now()`); rejected with 409 `CONFLICT-DELETE` if the customer has any non-soft-deleted invoices.
- **Audit:** `customer.delete`.

---

## POST `/customers/bulk-import`
- **Permission:** `Customer:create`.
- **Content-Type:** `multipart/form-data` with field `file` (XLSX).
- **Response 202:** `{ jobId }` (async); poll `GET /jobs/:jobId`.

---

## GET `/customers/export`
- **Permission:** `Customer:list`.
- **Response 202:** `{ jobId }`.

---

## Permission notes

| Role | List | Create | Update | Delete |
|---|---|---|---|---|
| ADMIN | ✓ all | ✓ | ✓ | ✓ |
| ACCOUNTANT | ✓ all | ✓ | ✓ | — |
| SALES | ✓ own | ✓ | ✓ own | — |
| VIEWER | ✓ all | — | — | — |

---

## Related
- `modules/customers.md`
- `future-architecture/customers.md`
- `database/database-dictionary.md` → `customers`
