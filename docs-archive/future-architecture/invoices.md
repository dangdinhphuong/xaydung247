# Future Architecture — Invoices (Hóa đơn)

> Markers: **[VERIFIED]** current behavior; **[RECOMMENDED]** target.

---

## 1. Current Frontend Implementation [VERIFIED]

- Routes: `/invoices` (list), `/invoices/create` (form), `/invoices/:id` (detail).
- List supports text search + status filter; row Edit / Quick-Pay / Export buttons render but **have no handlers**.
- Create form supports header, repeatable line items (auto-fills product price), invoice-level discount/tax/shipping, two submit paths: "Lưu nháp" → `status='draft'`, "Tạo hóa đơn" → `status='unpaid'`.
- Detail page renders header / items / totals / payment summary / payment history. "In" and "Tải PDF" buttons have **no handlers**.
- Payment modal validates V-PAY-01/02; conditional `reference` for bank_transfer.
- All reads / writes go through `src/app/data/store.ts`.
- Invoice numbering bug: hard-coded `'INV'` prefix produces `INV20260001` on every create (ISSUE-001).
- Payment id collision risk: `'PAY' + Date.now()` (ISSUE-006).

## 2. Missing Backend Requirements [RECOMMENDED]

- Persistent storage with the schema in `database/database-dictionary.md`.
- Atomic invoice-number allocation honouring `tenant_settings.invoice_prefix / next_invoice_number`.
- Status recompute on read AND nightly cron (overdue scan).
- Append-only payments with idempotency-key.
- PDF rendering pipeline + email/print handlers.
- Excel export endpoint.
- Edit, void, delete endpoints (with line-item lock once `status ≠ 'draft'`).

## 3. Recommended API Design [RECOMMENDED]

| Verb | Path | Body | Permission |
|---|---|---|---|
| GET    | `/api/invoices?search=&status=&customerId=&from=&to=&page=&size=` | — | `Invoice:list` |
| POST   | `/api/invoices` | `{customerId, issueDate, dueDate, items[], discount, tax, shipping, notes, status: 'draft'|'unpaid'}` | `Invoice:create:draft|final` |
| GET    | `/api/invoices/:id` | — | `Invoice:read` |
| PATCH  | `/api/invoices/:id` | partial; items only when `status='draft'` | `Invoice:update:*` |
| POST   | `/api/invoices/:id/finalize` | — (draft → unpaid) | `Invoice:create:final` |
| POST   | `/api/invoices/:id/void` | `{reason}` | `Invoice:void` |
| DELETE | `/api/invoices/:id` | — (soft) | `Invoice:delete` |
| POST   | `/api/invoices/:id/payments` | `{amount, paymentDate, method, reference?, note?}` + `Idempotency-Key` | `Payment:create` |
| GET    | `/api/invoices/:id/payments` | — | `Payment:read` |
| POST   | `/api/invoices/:id/pdf` | — (returns `{signedUrl, expiresAt}`) | `Invoice:print` |
| POST   | `/api/invoices/export` | `{format, filters}` → `{jobId}` | `Invoice:export` |

Error envelope: RFC 7807 (Problem Details) with `code = V-CI-xx` / `V-PAY-xx`.

## 4. Recommended Database Tables [RECOMMENDED]

- `invoices` (snapshot of customer fields, totals invariants enforced).
- `invoice_items` (CHECK `line_total = quantity × unit_price − discount`).
- `payments` (append-only, audit-enforced).
- Indexes: `(tenant_id, status)`, `(tenant_id, customer_id)`, `(tenant_id, due_date)`, `(tenant_id, issue_date DESC)`.
- Allocation: atomic `UPDATE tenant_settings SET next_invoice_number = next_invoice_number + 1 RETURNING …` inside the create-invoice transaction (resolve ISSUE-001).

## 5. Recommended Auth Flow [RECOMMENDED]

- `JwtAuthGuard` + `RolesGuard` with `@RequirePermission('Invoice:…')`.
- Ownership predicate for SALES: invoice's `created_by_user_id = currentUser.id` (or `salesperson_user_id`).
- Tenant isolation enforced at repository AND Postgres RLS.

## 6. Recommended Validation Strategy [RECOMMENDED]

- Zod / class-validator DTOs:
  - `customerId` exists in tenant (V-CI-01, V-CI-04).
  - `items.length >= 1` (V-CI-02).
  - per-item: `productId` exists, `quantity > 0`, `unitPrice >= 0`, `discount >= 0`, `discount <= quantity*unitPrice` (V-CI-03, V-CI-08).
  - `dueDate >= issueDate` (V-CI-05).
  - `discount >= 0`, `tax >= 0`, `shipping >= 0`, `discount <= subtotal` (V-CI-06, V-CI-07).
  - `notes.length <= 1000` (V-CI-09).
- Server CHECK constraints enforce numerics independent of app.
- Idempotency-key on POST payments (V-PAY-08).

## 7. Recommended Audit Logging [RECOMMENDED]

Events:
- `invoice.create` (status), `invoice.update`, `invoice.finalize`, `invoice.void`, `invoice.delete`.
- `invoice.status_change` — only when auto-recompute flips status.
- `payment.create`.
- `invoice.print`, `invoice.pdf_generated`, `invoice.export`.

Snapshots: `before_json` / `after_json` for updates; `cause_json` linking status changes to triggering payment.

## 8. Recommended State Persistence [RECOMMENDED]

- FE: TanStack Query keys `['invoices', filters]`, `['invoice', id]`.
- Mutations invalidate `['invoices']`, `['invoice', id]`, `['dashboard']`, `['debts']`, `['reports','top-customers']`.
- Idempotency key generated client-side per mutation (`crypto.randomUUID()`).
- Optimistic update for status flips on payment (rollback on 4xx).
- Cross-tab sync via `BroadcastChannel` integration of QueryClient.
