# API — Products

## Product shape

```json
{
  "id": "ObjectId",
  "code": "PROD001",
  "name": "Xi măng PCB40 Hoàng Thạch",
  "category": "Xi măng",
  "unit": "bao",
  "price": 95000,
  "stock": 500,
  "description": "...",
  "status": "active | inactive",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## GET `/api/products`

- **Roles:** ADMIN, ACCOUNTANT, SALES, VIEWER

### Query
- `?search=` substring trên name/category
- `?category=Xi măng`
- `?status=active`
- `?page=1&size=20&sort=name:asc`

### Response 200
```json
{ "data": [Product, ...], "page": {...} }
```

---

## GET `/api/products/categories`

Helper: distinct categories cho dropdown filter.

### Response 200
```json
{ "data": ["Xi măng", "Cát", "Đá", "Gạch", "Sắt thép", "Sơn"] }
```

---

## POST `/api/products`

- **Roles:** ADMIN
- **CSRF:** required

### Request
```json
{
  "name": "...",
  "category": "...",
  "unit": "bao",
  "price": 95000,
  "stock": 500,
  "description": "..."
}
```

### Validation
| Field | Rule | Error |
|---|---|---|
| name | 2–200 | `V-PROD-01` |
| category | non-empty | `V-PROD-04` |
| unit | non-empty | `V-PROD-05` |
| price | ≥ 0 integer | `V-PROD-02` |
| stock | ≥ 0 number | `V-PROD-03` |

### Server-side
- Sinh `code = 'PROD' + str(count+1).padStart(5, '0')`.
- Default `status = 'active'`.

### Response 201
Product object.

---

## GET `/api/products/:id`
### Response 200
Product object.

---

## PATCH `/api/products/:id`

- **Roles:** ADMIN
- **CSRF:** required

### Response 200
Product object.

---

## DELETE `/api/products/:id`

- **Roles:** ADMIN
- **CSRF:** required

Soft delete.

### Domain rules
- Nếu có invoice line tham chiếu `productId` → 422 `DOMAIN-PRODUCT-IN-USE` (admin nên dùng `status='inactive'` thay vì delete).

### Response 204
