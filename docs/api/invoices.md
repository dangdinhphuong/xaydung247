# API — Invoices & Payments

## Invoice shape (response)

```json
{
  "id": "ObjectId",
  "invoiceNumber": "HD-2026-001",
  "customerId": "ObjectId",
  "customerSnapshot": {
    "name": "...", "phone": "...", "address": "...", "taxCode": "..."
  },
  "issueDate": "2026-05-18",
  "dueDate": "2026-06-17",
  "status": "draft | unpaid | partial | paid | void",
  "isOverdue": true,                       // derived, attached by service
  "items": [
    {
      "id": "ObjectId",
      "productId": "ObjectId",
      "productName": "Xi măng PCB40",
      "unit": "bao",
      "quantity": 200,
      "unitPrice": 95000,
      "discount": 0,
      "lineTotal": 19000000
    }
  ],
  "subtotal": 19000000,
  "discount": 0,
  "tax": 1900000,
  "shipping": 0,
  "total": 20900000,
  "paidAmount": 0,
  "remainingBalance": 20900000,
  "notes": "...",
  "voidReason": null,
  "createdBy": "ObjectId",
  "createdAt": "...",
  "updatedAt": "..."
}
```

`isOverdue` = derived (F-8). KHÔNG lưu trong DB.

---

## GET `/api/invoices`

- **Roles:** ADMIN, ACCOUNTANT, SALES

### Query
- `?search=` substring trên invoiceNumber/customerSnapshot.name
- `?status=draft,unpaid,partial,paid,void` comma-separated
- `?customerId=ObjectId`
- `?from=YYYY-MM-DD&to=YYYY-MM-DD` filter theo issueDate
- `?isOverdue=true|false`
- `?page=1&size=20&sort=createdAt:desc`

### Response 200
```json
{ "data": [Invoice, ...], "page": {...} }
```

SALES chỉ thấy invoices `createdBy = currentUser.id`.

---

## POST `/api/invoices`

- **Roles:** ADMIN, ACCOUNTANT, SALES (chỉ tạo draft)
- **CSRF:** required

### Request
```json
{
  "customerId": "ObjectId",
  "issueDate": "2026-05-18",
  "dueDate": "2026-06-17",
  "items": [
    { "productId": "ObjectId", "quantity": 200, "unitPrice": 95000, "discount": 0 }
  ],
  "discount": 0,
  "tax": null,                  // null = auto-compute từ settings
  "shipping": 0,
  "notes": "...",
  "status": "draft | unpaid"
}
```

### Validation
| Field | Rule | Error |
|---|---|---|
| customerId | exists, status=active | `V-CI-01` / `V-CI-04` |
| dueDate | ≥ issueDate | `V-CI-05` |
| items | length ≥ 1 | `V-CI-02` |
| item.productId | exists | `V-CI-03` |
| item.quantity | > 0 | `V-CI-03` |
| item.unitPrice | ≥ 0 | `V-CI-03` |
| item.discount | ≥ 0 AND ≤ quantity × unitPrice | `V-CI-08` |
| discount | ≥ 0 AND ≤ subtotal | `V-CI-06` |
| tax / shipping | ≥ 0 | `V-CI-07` |
| notes | ≤ 1000 | `V-CI-09` |
| status | enum | — |

SALES chỉ được `status='draft'`. Nếu gửi `status='unpaid'` → 403.

### Server-side
1. Validate.
2. Snapshot customer.
3. Snapshot product (name, unit) cho mỗi item.
4. Compute `lineTotal` cho mỗi item.
5. Compute `subtotal = Σ lineTotal`.
6. Compute `tax`: nếu `request.tax === null && settings.autoTax` → `round((subtotal - discount) × settings.defaultTaxRate / 100)`. Else dùng giá trị request.
7. Compute `total = subtotal - discount + tax + shipping`.
8. Set `paidAmount = 0`, `remainingBalance = total`.
9. Nếu `status='unpaid'` → allocate `invoiceNumber` (F-12). Draft → null.
10. Insert vào collection.

### Response 201
Invoice object.

---

## GET `/api/invoices/:id`

- **Roles:** ADMIN, ACCOUNTANT, SALES (own)

### Response 200
Invoice object + embedded `payments[]`:

```json
{
  ...Invoice,
  "payments": [Payment, ...]
}
```

### Errors
- 404 nếu không tồn tại, đã soft-delete, hoặc thuộc user khác (SALES).

---

## PATCH `/api/invoices/:id`

- **Roles:** ADMIN, ACCOUNTANT (any); SALES (own draft only)
- **CSRF:** required

### Request (partial)
```json
{
  "issueDate": "...",
  "dueDate": "...",
  "items": [...],
  "discount": ...,
  "tax": ...,
  "shipping": ...,
  "notes": "..."
}
```

### Domain rules
- Update `items / discount / tax / shipping` chỉ khi `status='draft'`. Else 422 `DOMAIN-LINES-LOCKED`.
- Update `notes / issueDate / dueDate` cho phép ở `unpaid` và `partial` (ACCOUNTANT/ADMIN).

### Server-side
- Recompute `subtotal`, `total`, `remainingBalance` nếu items/discount/tax/shipping đổi.

### Response 200
Invoice object.

---

## POST `/api/invoices/:id/finalize`

- **Roles:** ADMIN, ACCOUNTANT
- **CSRF:** required

Chuyển `draft → unpaid`, allocate `invoiceNumber`.

### Response 200
Invoice object with `invoiceNumber` populated.

### Errors
- 422 `DOMAIN-INVALID-STATE` nếu không phải draft.

---

## POST `/api/invoices/:id/void`

- **Roles:** ADMIN
- **CSRF:** required

### Request
```json
{ "voidReason": "Huỷ theo yêu cầu khách hàng" }
```

### Server-side
- Set `status='void'`, `remainingBalance=0`, `voidReason`.
- KHÔNG xoá payments cũ.
- Số hoá đơn giữ nguyên.

### Domain rules
- 422 `DOMAIN-INVALID-STATE` nếu đã `paid` (paid là terminal).

### Response 200
Invoice object.

---

## DELETE `/api/invoices/:id`

- **Roles:** ADMIN
- **CSRF:** required

Soft delete. Chỉ cho `status='draft'` hoặc `status='void'`. Else 422.

### Response 204

---

## Payments subresource

### POST `/api/invoices/:invoiceId/payments`

- **Roles:** ADMIN, ACCOUNTANT
- **CSRF:** required

### Request
```json
{
  "amount": 10000000,
  "paymentDate": "2026-05-18",
  "method": "cash | bank_transfer | check | other",
  "reference": "TF20260518001",
  "note": "Thanh toán đợt 1"
}
```

### Validation
| Field | Rule | Error |
|---|---|---|
| amount | > 0 AND ≤ invoice.remainingBalance | `V-PAY-01` / `V-PAY-02` |
| paymentDate | ≤ today + 1 day | `V-PAY-03` |
| method | enum | — |
| reference | required nếu method ∈ {bank_transfer, check} | `V-PAY-06` |
| invoice.status | NOT in {draft, void, paid} | `DOMAIN-DRAFT-PAYMENT` / `DOMAIN-VOID-PAYMENT` / `DOMAIN-PAID-PAYMENT` |

### Server-side
1. Validate.
2. Insert payment vào collection `payments`.
3. Query all payments của invoice → tính `paidAmount`.
4. Update invoice: `paidAmount`, `remainingBalance = total - paidAmount`, `status = calculateStatus(...)`.

### Response 201
```json
{ "payment": Payment, "invoice": Invoice }
```

### GET `/api/invoices/:invoiceId/payments`

- **Roles:** ADMIN, ACCOUNTANT, SALES (own invoice)

### Response 200
```json
{ "data": [Payment, ...] }
```

### Payment shape
```json
{
  "id": "ObjectId",
  "invoiceId": "ObjectId",
  "amount": 10000000,
  "paymentDate": "2026-05-18",
  "method": "cash",
  "reference": "...",
  "note": "...",
  "createdBy": "ObjectId",
  "createdAt": "..."
}
```

Không có PATCH/DELETE payment (append-only). Sửa sai → ADMIN void invoice + tạo lại.
