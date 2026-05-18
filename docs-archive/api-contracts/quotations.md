# API Contract — Quotations

> **[RECOMMENDED]** — see `future-architecture/quotations.md`, `workflows/quotation-workflow.md`.

---

## `Quotation` shape
```json
{
  "id":"uuid",
  "quotationNumber":"BG-2026-003",
  "customerId":"uuid",
  "customer": { "name":"...", "phone":"...", "address":"...", "taxCode":null },
  "issueDate":"2026-05-18",
  "validUntil":"2026-06-17",
  "status":"draft|sent|accepted|rejected|expired",
  "items":[ { "productId":"uuid", "productName":"...", "quantity":"...", "unitPrice":"...", "discount":"...", "lineTotal":"..." } ],
  "subtotal":"...",     // recommended addition (RULE-011)
  "discount":"...",
  "tax":"...",
  "shipping":"...",
  "total":"...",
  "notes":"...",
  "convertedInvoiceId": "uuid|null",
  "createdByUserId":"uuid",
  "createdAt":"...",
  "updatedAt":"..."
}
```

---

## GET `/quotations`
- **Permission:** `Quotation:list`.
- **Query:** `?search=&status=&customerId=&from=&to=&page=&size=`.
- **Response 200:** `{ data: Quotation[], page: {...} }`.

## POST `/quotations`
- **Permission:** `Quotation:create`.

### Request
```json
{ "customerId":"uuid", "issueDate":"2026-05-18", "validUntil":"2026-06-17", "items":[...], "discount":"0", "tax":"0", "shipping":"0", "notes":"..." }
```

### Validation
| Field | Rule | Error |
|---|---|---|
| customerId | exists | `V-Q-01` |
| validUntil | ≥ issueDate | `V-Q-02` |
| items.length | ≥ 1 | `V-Q-03` |
| item.* | as invoice | `V-Q-04` |

### Response 201: `Quotation` (status='draft').
### Audit: `quotation.create`.

---

## PATCH `/quotations/:id`
- **Permission:** `Quotation:create`.
- **Domain rule:** only when `status='draft'` (422 otherwise — `DOMAIN-QUOTE-LOCKED`).
- **Header:** `If-Match`.

## POST `/quotations/:id/send`
- **Permission:** `Quotation:send`.
- **Request:** `{ emailTo?: string, message?: string }`.
- **Side-effects:** sets status `sent`; optionally enqueues email with PDF attachment; generates a signed public-link token for customer self-acceptance.
- **Audit:** `quotation.send`.

## POST `/quotations/:id/accept`
- **Permission:** `Quotation:accept`.
- **Domain:** status MUST be `sent`. Past-due `sent` → first auto-expires, then 422 `DOMAIN-QUOTE-LOCKED`.
- **Audit:** `quotation.accept`.

## POST `/quotations/:id/reject`
- **Permission:** `Quotation:reject`.
- **Request:** `{ reason?: string }`.
- **Audit:** `quotation.reject`.

## POST `/quotations/:id/convert`
- **Permission:** `Quotation:convert`.
- **Idempotency:** `Idempotency-Key` REQUIRED.
- **Domain:** status MUST be `accepted` AND `convertedInvoiceId IS NULL`.
- **Behavior:** TX = INSERT invoice (status='unpaid') + INSERT invoice_items (snapshot from quotation_items) + UPDATE quotation SET converted_invoice_id.
- **Response 201:** `{ invoice: Invoice }`.
- **Audit:** `quotation.convert` + `invoice.create` with `cause_json={type:'quotation.convert', quotation_id}`.

## POST `/quotations/:id/clone`
- **Permission:** `Quotation:create`.
- **Behavior:** creates a new `draft` with the same items + customer.
- **Audit:** `quotation.clone`.

---

## Public link (optional)

### GET `/public/quotations/:token`
- **Auth:** none (token is signed HMAC bound to `(quotation_id, expiry, action_set)`).
- **Response 200:** read-only quotation view + actions (Accept / Reject) if token grants them.

### POST `/public/quotations/:token/accept`
### POST `/public/quotations/:token/reject`
Token-gated; calls equivalent server-side state transitions.

---

## Auto-expiry

A nightly worker runs at 00:05 Asia/Ho_Chi_Minh:

```sql
UPDATE quotations
SET status='expired'
WHERE status='sent' AND valid_until < CURRENT_DATE AND deleted_at IS NULL;
```

`GET /quotations` and `GET /quotations/:id` opportunistically perform the same update for instant correctness.

---

## Audit events
`quotation.create`, `quotation.update`, `quotation.send`, `quotation.accept`, `quotation.reject`, `quotation.expire` (system), `quotation.convert`, `quotation.clone`.

---

## Related
- `modules/quotations.md`, `workflows/quotation-workflow.md`
- `future-architecture/quotations.md`
