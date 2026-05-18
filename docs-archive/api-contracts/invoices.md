# API Contract — Invoices & Payments

> **[RECOMMENDED]** — see `future-architecture/invoices.md`, `modules/orders.md`, `workflows/order-workflow.md`.

---

## `Invoice` shape (response)
```json
{
  "id": "uuid",
  "invoiceNumber": "HD-2026-009",
  "customerId": "uuid",
  "customer": {
    "name": "...",           // snapshot at issue
    "phone": "...",
    "address": "...",
    "taxCode": null
  },
  "issueDate": "2026-05-18",
  "dueDate":   "2026-06-17",
  "status":    "draft|unpaid|partial|paid|overdue|void",
  "items": [
    { "id":"uuid", "productId":"uuid", "productName":"...", "quantity":"200", "unitPrice":"95000", "discount":"0", "lineTotal":"19000000" }
  ],
  "subtotal":         "19000000",
  "discount":         "0",
  "tax":              "1900000",
  "shipping":         "0",
  "total":            "20900000",
  "paidAmount":       "0",
  "remainingBalance": "20900000",
  "notes":            "...",
  "salespersonUserId": null,
  "templateId":       "uuid|null",
  "createdByUserId":  "uuid",
  "createdAt":        "...",
  "updatedAt":        "..."
}
```

Money fields = decimal strings. Status enum closed.

---

## GET `/invoices`
- **Permission:** `Invoice:list`. SALES sees own only.
- **Query:** `?search=&status=&customerId=&from=&to=&page=&size=&sort=issueDate:desc`.
- **Response 200:** `{ data: Invoice[], page: {...} }`.
- **Notes:** `updateOverdueStatuses` runs opportunistically before responding.

## POST `/invoices`
- **Permission:** `Invoice:create:draft` for `status='draft'`; `Invoice:create:final` for `status='unpaid'`.
- **Idempotency:** `Idempotency-Key` required.

### Request
```json
{
  "customerId": "uuid",
  "issueDate":  "2026-05-18",
  "dueDate":    "2026-06-17",
  "status":     "draft|unpaid",
  "items": [
    { "productId":"uuid", "productName":"...", "quantity":"200", "unitPrice":"95000", "discount":"0" }
  ],
  "discount": "0",
  "tax":      "1900000",
  "shipping": "0",
  "notes":    "..."
}
```

### Validation
| Field | Rule | Error |
|---|---|---|
| customerId | exists, status=active | `V-CI-01`, `V-CI-04` |
| items.length | ≥ 1 | `V-CI-02` |
| item.productId | exists | `V-CI-03` |
| item.quantity | > 0 | `V-CI-03` |
| item.unitPrice | ≥ 0 | `V-CI-03` |
| item.discount | ≥ 0 AND ≤ quantity × unitPrice | `V-CI-08` |
| dueDate | ≥ issueDate | `V-CI-05` |
| discount | ≥ 0 AND ≤ subtotal | `V-CI-06`, `V-CI-07` |
| tax, shipping | ≥ 0 | `V-CI-07` |
| notes | ≤ 1000 | `V-CI-09` |

### Server-side computations
- `subtotal = Σ items.lineTotal` (re-derive, do NOT trust client).
- `total = subtotal − discount + tax + shipping`.
- `paidAmount = 0`, `remainingBalance = total`.
- `invoiceNumber` allocated via `fn_allocate_invoice_number(tenant)` — atomic.

### Response 201: `Invoice`.

### Audit
`invoice.create` with after-snapshot.

---

## GET `/invoices/:id`
- **Permission:** `Invoice:read`.
- **Response 200:** `Invoice & { payments: Payment[], audit: AuditEntry[5 latest] }`.

## PATCH `/invoices/:id`
- **Permission:** `Invoice:update:header` (any status) or `Invoice:update:items` (draft only).
- **Header:** `If-Match`.
- **Domain:** items mutation rejected with 422 if `status ≠ 'draft'`.

## POST `/invoices/:id/finalize`
- **Permission:** `Invoice:create:final`.
- **Behavior:** `draft → unpaid`. Allocates invoice number if not yet allocated.
- **Audit:** `invoice.finalize`.

## POST `/invoices/:id/void`
- **Permission:** `Invoice:void` (ADMIN).
- **Request:** `{ reason }`.
- **Behavior:** status → `void`; reverse payment entries inserted (preserving payment history but zeroing receivable).
- **Audit:** `invoice.void`.

## DELETE `/invoices/:id`
- **Permission:** `Invoice:delete` (ADMIN).
- **Behavior:** soft delete only on `draft` or `void` invoices (422 otherwise).
- **Audit:** `invoice.delete`.

---

## POST `/invoices/:id/payments`
- **Permission:** `Payment:create`.
- **Idempotency:** `Idempotency-Key` REQUIRED.

### Request
```json
{ "amount": "10000000", "paymentDate": "2026-05-18", "method": "cash|bank_transfer|check|other", "reference": "...", "note": "..." }
```

### Validation
| Field | Rule | Error |
|---|---|---|
| amount | > 0; ≤ remainingBalance; ≤ 10^12 | `V-PAY-01`, `V-PAY-02`, `V-PAY-07` |
| paymentDate | ≤ today + 1 | `V-PAY-03` |
| method | enum | — |
| reference | required if method='bank_transfer' (recommended) | `V-PAY-06` |
| invoice.status | ≠ 'draft' AND remainingBalance > 0 | `V-PAY-04`, `V-PAY-05` |
| Idempotency-Key replay | first response returned | `V-PAY-08` |

### Server-side computations
- `payment.id` = server UUID (resolves ISSUE-006 `Date.now()` collision).
- `invoice.paidAmount += amount`.
- `invoice.remainingBalance = invoice.total − invoice.paidAmount`.
- `invoice.status = calculateStatus(total, paidAmount, dueDate)`.

### Response 201
```json
{ "payment": Payment, "invoice": Invoice }
```

### Audit
`payment.create` + `invoice.status_change` (if status changed) with `cause_json` linking to payment.

---

## GET `/invoices/:id/payments`
- **Permission:** `Payment:read`.
- **Response 200:** `{ data: Payment[] }`.

---

## POST `/invoices/:id/pdf`
- **Permission:** `Invoice:print`.
- **Behavior:** enqueues a PDF render via the active template.
- **Response 200:** `{ signedUrl, expiresAt }` (signed S3 URL, 15 min).
- **Audit:** `invoice.pdf_generated`.

## POST `/invoices/export`
- **Permission:** `Invoice:export`.
- **Request:** `{ format: "xlsx"|"pdf", filters: {...} }`.
- **Response 202:** `{ jobId }`.
- **Audit:** `invoice.export`.

---

## Audit events
`invoice.create`, `invoice.update`, `invoice.finalize`, `invoice.void`, `invoice.delete`, `invoice.status_change`, `invoice.print`, `invoice.pdf_generated`, `invoice.export`, `payment.create`.

---

## Cache invalidation hints (frontend)
On any of the above mutations, the FE should `queryClient.invalidateQueries([...])` for: `['invoices']`, `['invoice', id]`, `['dashboard']`, `['debts']`, `['reports', 'top-customers']`, `['reports', 'revenue']`.

---

## Related
- `modules/orders.md`, `workflows/order-workflow.md`
- `future-architecture/invoices.md`
- `database/database-dictionary.md` → `invoices`, `invoice_items`, `payments`
