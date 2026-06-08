# API — Settings

Single document. Không pagination, không list.

## Settings shape

```json
{
  "id": "ObjectId",
  "companyName": "...",
  "companyTaxCode": "...",
  "companyAddress": "...",
  "companyPhone": "...",
  "companyEmail": "...",
  "invoicePrefix": "HD-",
  "quotationPrefix": "BG-",
  "defaultDueDays": 30,
  "defaultTaxRate": 10,
  "autoTax": true,
  "invoiceTemplateHtml": "<!DOCTYPE html>...",
  "updatedAt": "..."
}
```

---

## GET `/api/settings`

- **Roles:** ADMIN, ACCOUNTANT (cần đọc để biết prefix, due-days, tax-rate cho FE preview)

### Response 200
Settings object.

### Errors
- 500 nếu chưa seed (admin chạy `pnpm seed`).

---

## PATCH `/api/settings`

- **Roles:** ADMIN
- **CSRF:** required

### Request (partial)
```json
{
  "companyName": "...",
  "companyTaxCode": "...",
  "companyAddress": "...",
  "companyPhone": "...",
  "companyEmail": "...",
  "invoicePrefix": "HD-",
  "quotationPrefix": "BG-",
  "defaultDueDays": 30,
  "defaultTaxRate": 10,
  "autoTax": true,
  "invoiceTemplateHtml": "..."
}
```

### Validation
| Field | Rule | Error |
|---|---|---|
| companyName | non-empty | `V-SET-01` |
| companyEmail | RFC-5322 | `V-SET-02` |
| invoicePrefix | regex `^[A-Z0-9-]+$` | `V-SET-06` |
| defaultDueDays | int 0..365 | `V-SET-04` |
| defaultTaxRate | number 0..100 | `V-SET-05` |
| autoTax | boolean | — |
| invoiceTemplateHtml | string, ≤ 50000 chars | — |

### Domain rules
- Đổi `invoicePrefix` không renumber hoá đơn cũ (CR-NUM-07).

### Response 200
Settings object.
