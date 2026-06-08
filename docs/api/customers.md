# API — Customers

## Customer shape

```json
{
  "id": "ObjectId",
  "code": "CUST001",
  "name": "...",
  "phone": "...",
  "email": "...",
  "address": "...",
  "taxCode": "...",
  "status": "active | inactive",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## GET `/api/customers`

- **Roles:** ADMIN, ACCOUNTANT, SALES, VIEWER

### Query
- `?search=` substring trên name/phone/email
- `?status=active|inactive` (default `active` — exclude soft-deleted)
- `?page=1&size=20&sort=name:asc`

### Response 200
```json
{
  "data": [Customer, ...],
  "page": { "page": 1, "size": 20, "total": 5 }
}
```

---

## POST `/api/customers`

- **Roles:** ADMIN, ACCOUNTANT, SALES
- **CSRF:** required

### Request
```json
{
  "name": "Công ty TNHH ABC",
  "phone": "0912345678",
  "email": "abc@example.com",
  "address": "123 ...",
  "taxCode": "0123456789",
  "status": "active"
}
```

### Validation
| Field | Rule | Error |
|---|---|---|
| name | 2–200 | `V-CUST-01` |
| phone | `^0\d{9,10}$` | `V-CUST-02` |
| email | RFC-5322 | `V-CUST-03` |
| address | ≤ 300 | `V-CUST-06` |
| taxCode | optional, ≤ 20 | `V-CUST-04` |
| status | enum, default 'active' | — |

### Server-side
- Sinh `code = 'CUST' + str(count+1).padStart(5, '0')` (đơn giản, không atomic — race hiếm trong MVP).

### Response 201
Customer object.

---

## GET `/api/customers/:id`

### Response 200
Customer object + summary:
```json
{
  ...Customer,
  "summary": {
    "totalInvoices": 12,
    "openInvoicesCount": 3,
    "currentDebt": 30100000
  }
}
```

Summary tính trong service từ invoices collection.

### Errors
- 404 nếu không tồn tại hoặc đã soft-delete.

---

## PATCH `/api/customers/:id`

- **Roles:** ADMIN, ACCOUNTANT; SALES chỉ update customer mình tạo (filter `createdBy`)
- **CSRF:** required

### Request (partial)
Cùng field như POST.

### Response 200
Customer object.

---

## DELETE `/api/customers/:id`

- **Roles:** ADMIN
- **CSRF:** required

Soft delete (set `deletedAt`).

### Domain rules
- Nếu customer có invoice non-deleted → 422 `DOMAIN-CUSTOMER-IN-USE`.

### Response 204

---

## GET `/api/customers/:id/aging`

Helper: trả về aging buckets cho 1 customer.

### Response 200
```json
{
  "customerId": "...",
  "totalDebt": 50000000,
  "openInvoicesCount": 3,
  "overdueInvoicesCount": 1,
  "aging": {
    "0-30": 10000000,
    "31-60": 0,
    "61-90": 15000000,
    "90+": 25000000
  }
}
```

Service tính bằng cách query open invoices của customer rồi loop tính bucket (F-7).
