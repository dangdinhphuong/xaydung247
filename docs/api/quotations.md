# API — Quotations

## Quotation shape (response)

```json
{
  "id": "ObjectId",
  "quotationNumber": "BG-2026-001",      // null cho draft
  "customerId": "ObjectId",
  "customerSnapshot": { ... },
  "issueDate": "2026-05-18",
  "validUntil": "2026-06-17",
  "status": "draft | sent | accepted | rejected",
  "isExpired": false,                    // derived
  "items": [InvoiceItem-like],
  "subtotal": ...,
  "discount": ...,
  "tax": ...,
  "shipping": ...,
  "total": ...,
  "notes": "...",
  "convertedInvoiceId": null,
  "rejectReason": null,
  "createdBy": "ObjectId",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## GET `/api/quotations`

- **Roles:** ADMIN, ACCOUNTANT, SALES, VIEWER

### Query
- `?search=` substring quotationNumber/customerName
- `?status=draft,sent,accepted,rejected`
- `?customerId=`
- `?isExpired=true|false`
- `?page=&size=&sort=createdAt:desc`

### Response 200
`{ data: [Quotation, ...], page: {...} }`

---

## POST `/api/quotations`

- **Roles:** ADMIN, ACCOUNTANT, SALES
- **CSRF:** required

### Request
Same shape as create invoice (xem `invoices.md`) nhưng:
- `dueDate` → `validUntil`
- `status` không trong request (default `draft`)

### Validation
- Same as invoice + `validUntil ≥ issueDate` (`V-Q-02`).

### Server-side
- Create với `status='draft'`, `quotationNumber=null`.
- Snapshot customer + product.
- Compute totals tương tự invoice.

### Response 201
Quotation object.

---

## GET `/api/quotations/:id`
### Response 200
Quotation object.

---

## PATCH `/api/quotations/:id`

- **Roles:** ADMIN, ACCOUNTANT, SALES (own)
- **CSRF:** required

### Domain rules
- Chỉ cho phép khi `status='draft'`. Else 422 `DOMAIN-QUOTE-LOCKED`.

### Response 200
Quotation object.

---

## POST `/api/quotations/:id/send`

Allocate quotationNumber, chuyển `draft → sent`.

- **Roles:** ADMIN, ACCOUNTANT, SALES
- **CSRF:** required

### Domain rules
- 422 nếu không phải `draft`.

### Response 200
Quotation object with `quotationNumber` populated.

---

## POST `/api/quotations/:id/accept`

`sent → accepted`.

- **Roles:** ADMIN, ACCOUNTANT, SALES
- **CSRF:** required

### Domain rules
- 422 `DOMAIN-INVALID-STATE` nếu không phải `sent`.
- 422 `DOMAIN-QUOTE-EXPIRED` nếu `isExpired = true`.

### Response 200
Quotation object.

---

## POST `/api/quotations/:id/reject`

- **Roles:** ADMIN, ACCOUNTANT, SALES
- **CSRF:** required

### Request
```json
{ "rejectReason": "Khách chọn nhà cung cấp khác" }
```

### Domain rules
- 422 nếu không phải `sent`.

### Response 200

---

## POST `/api/quotations/:id/clone`

Tạo quotation mới từ quotation hiện tại, `status='draft'`.

- **Roles:** ADMIN, ACCOUNTANT, SALES
- **CSRF:** required

### Server-side
- Copy `customerId`, `items`, `discount`, `tax`, `shipping`, `notes`.
- Snapshot customer mới (từ customer hiện tại, không từ snapshot cũ).
- `issueDate = today`, `validUntil = today + 30 days`.
- `quotationNumber = null`.

### Response 201
New quotation object.

---

## POST `/api/quotations/:id/convert`

Chuyển báo giá đã accepted thành hoá đơn.

- **Roles:** ADMIN, ACCOUNTANT
- **CSRF:** required

### Domain rules
- 422 `DOMAIN-INVALID-STATE` nếu `status !== 'accepted'`.
- 422 `DOMAIN-ALREADY-CONVERTED` nếu `convertedInvoiceId !== null`.

### Server-side (KHÔNG transaction)
1. Đọc quotation.
2. Resolve current customer (re-fetch, không dùng snapshot cũ).
3. Allocate `invoiceNumber` (F-12).
4. Compute totals lại (copy từ quotation).
5. Insert invoice mới với `status='unpaid'`, `issueDate=today`, `dueDate=today + settings.defaultDueDays`, `notes = "Từ báo giá " + quotationNumber + "\n" + quotation.notes`.
6. Update quotation: `convertedInvoiceId = invoice._id`. Status vẫn `accepted`.

Nếu (6) fail (Mongo write error) → invoice mới mồ côi. Rare. ADMIN có thể manual cleanup. MVP chấp nhận risk.

### Response 201
```json
{ "invoice": Invoice }
```

---

## DELETE `/api/quotations/:id`

Soft delete. Chỉ cho `status='draft'`.

- **Roles:** ADMIN
- **CSRF:** required

### Response 204
