# Future Architecture — Quotations (Báo giá)

---

## 1. Current Frontend Implementation [VERIFIED]

- Route `/quotations` → list with search.
- Status badge map (draft/sent/accepted/rejected/expired) hard-coded in `pages/QuotationManagement.tsx`.
- Reads `quotations` from `mockData.ts` directly — **bypasses store**.
- Create / Edit / Send / Convert flows **NOT implemented** (buttons render but have no handlers).
- Quotation model has only a `total` field — no subtotal/tax/shipping breakdown (RULE-011).

## 2. Missing Backend Requirements [RECOMMENDED]

- Full CRUD persistence.
- Lifecycle endpoints: send, accept, reject, expire-cron, convert.
- Auto-expire job at `valid_until < CURRENT_DATE`.
- Subtotal / discount / tax / shipping breakdown for parity with invoices.
- Public signed-link for customer to view & accept/reject without login (optional but valuable).

## 3. Recommended API Design [RECOMMENDED]

| Verb | Path | Body | Permission |
|---|---|---|---|
| GET    | `/api/quotations?search=&status=&customerId=` | — | `Quotation:list` |
| POST   | `/api/quotations` | `{customerId, issueDate, validUntil, items[], discount, tax, shipping, notes}` | `Quotation:create` |
| GET    | `/api/quotations/:id` | — | `Quotation:list` |
| PATCH  | `/api/quotations/:id` | partial (only when `status='draft'`) | `Quotation:create` |
| POST   | `/api/quotations/:id/send` | `{emailTo?, message?}` | `Quotation:send` |
| POST   | `/api/quotations/:id/accept` | — | `Quotation:accept` |
| POST   | `/api/quotations/:id/reject` | `{reason?}` | `Quotation:reject` |
| POST   | `/api/quotations/:id/convert` | — (returns `{invoiceId}`, idempotent) | `Quotation:convert` |
| POST   | `/api/quotations/:id/clone` | — | `Quotation:create` |
| GET    | `/api/public/quotations/:token` | — (signed link) | (no auth, signed token) |

## 4. Recommended Database Tables [RECOMMENDED]

- `quotations` + `quotation_items` (see `database/database-dictionary.md`).
- `quotations.converted_invoice_id` references the invoice produced by conversion (UNIQUE — at most one).
- Indexes: `(tenant_id, status)`, `(tenant_id, customer_id)`, `(tenant_id, valid_until)`.

## 5. Recommended Auth Flow [RECOMMENDED]

- `JwtAuthGuard` + `@RequirePermission('Quotation:…')`.
- Public link endpoint uses a signed HMAC token bound to `(quotation_id, expiry, action)`.

## 6. Recommended Validation Strategy [RECOMMENDED]

- `customerId` exists.
- `items.length >= 1`.
- `validUntil >= issueDate` (V-Q-02).
- Status-transition validation (V-Q-05/06).
- Idempotent conversion via `Idempotency-Key` and FK-uniqueness on `converted_invoice_id`.

## 7. Recommended Audit Logging [RECOMMENDED]

- `quotation.create / .update / .send / .accept / .reject / .expire / .convert / .clone`.
- Capture `before/after` JSON on update.

## 8. Recommended State Persistence [RECOMMENDED]

- FE: `useQuery(['quotations', filters])`, `useQuery(['quotation', id])`.
- Mutations invalidate `['quotations']`; on `convert` also invalidate `['invoices']`, `['dashboard']`.
- Cron worker auto-expires nightly + on-read evaluation.
