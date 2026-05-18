# Future Architecture — Customers (Khách hàng)

---

## 1. Current Frontend Implementation [VERIFIED]

- Route `/customers` → `pages/CustomerManagement.tsx`.
- List + search (name / phone / email).
- Status badge (active / inactive).
- `currentDebt` derived in browser from `store.getInvoices()`.
- Reads `customers` directly from `mockData.ts` (bypasses store) — TD-011.
- "Thêm khách hàng" / View / Edit buttons have **no handlers**.
- Mobile layout NOT implemented (desktop-only).

## 2. Missing Backend Requirements [RECOMMENDED]

- Full CRUD endpoints.
- Real-time `currentDebt` from `v_customer_debt`.
- Bulk import / export.
- Soft-delete only (preserve invoice references).

## 3. Recommended API Design [RECOMMENDED]

| Verb | Path | Body | Permission |
|---|---|---|---|
| GET    | `/api/customers?search=&status=&page=&size=` | — | `Customer:list` |
| POST   | `/api/customers` | `{name, phone, email, address, taxCode?, status}` | `Customer:create` |
| GET    | `/api/customers/:id` | — (returns customer + summary of invoices) | `Customer:list` |
| PATCH  | `/api/customers/:id` | partial | `Customer:update` |
| DELETE | `/api/customers/:id` | — (soft) | `Customer:delete` (409 if has invoices) |
| POST   | `/api/customers/bulk-import` | XLSX (column-mapped) | `Customer:create` |
| GET    | `/api/customers/export` | — XLSX | `Customer:list` |

## 4. Recommended Database Tables [RECOMMENDED]

- `customers` (see `database/database-dictionary.md`).
- UNIQUE(tenant_id, code).
- Index `(tenant_id, lower(name))`, `(tenant_id, phone)`.
- **Remove** `total_debt` column from the type / fixture (RULE-008, ISSUE-027) — always derive.

## 5. Recommended Auth Flow [RECOMMENDED]

- `JwtAuthGuard` + `@RequirePermission('Customer:…')`.
- SALES sees `(own)` — `created_by_user_id = currentUser.id`.

## 6. Recommended Validation Strategy [RECOMMENDED]

- V-CUST-01..06 (see `qa/validation-rules.md` §3).
- VN phone regex `^0\d{9,10}$`.
- Email RFC-5322.
- Tax code: 10 digits, optional `-NNN` branch suffix.

## 7. Recommended Audit Logging [RECOMMENDED]

- `customer.create / .update / .deactivate / .reactivate`.

## 8. Recommended State Persistence [RECOMMENDED]

- FE: `useQuery(['customers', filters])`, `useQuery(['customer', id])`.
- Mutations invalidate `['customers']`.
- `currentDebt` recomputed server-side on each read; no client cache.
