# API Contracts — MVP v1

REST API thuần. Base URL `/api`. Mọi response JSON.

## Conventions

| Item | Value |
|---|---|
| Auth | Session cookie HttpOnly (Set-Cookie từ login) + `X-CSRF-Token` header trên mọi mutation |
| Content-Type | `application/json; charset=utf-8` |
| Locale | `vi-VN` |
| Date format | ISO `YYYY-MM-DD` cho business date; ISO 8601 cho timestamp |
| Money | number nguyên VND |
| ID | string (Mongo ObjectId hex 24 chars) |

## Status codes

| Code | Meaning |
|---|---|
| 200 | OK với body |
| 201 | Created với body |
| 204 | No Content |
| 400 | Validation error (DTO fail) |
| 401 | Chưa đăng nhập (session expired/missing) |
| 403 | Đã đăng nhập nhưng thiếu quyền (CSRF cũng trả 403) |
| 404 | Không tìm thấy resource |
| 422 | Business rule violation (vd: thêm payment cho draft) |
| 500 | Lỗi server |

## Error envelope

```json
{
  "statusCode": 422,
  "message": "Không thể thanh toán hoá đơn nháp",
  "code": "DOMAIN-DRAFT-PAYMENT",
  "timestamp": "2026-05-18T10:00:00.000Z"
}
```

FE dùng `code` để hiển thị message Vietnamese phù hợp, fallback `message` nếu chưa map.

## Files

| File | Module |
|---|---|
| [auth.md](./auth.md) | Authentication |
| [users.md](./users.md) | Users (ADMIN only) |
| [customers.md](./customers.md) | Customers |
| [products.md](./products.md) | Products |
| [invoices.md](./invoices.md) | Invoices (+ payments subresource) |
| [quotations.md](./quotations.md) | Quotations |
| [settings.md](./settings.md) | Settings |
| [dashboard.md](./dashboard.md) | Dashboard helper |
| [common-errors.md](./common-errors.md) | Error code catalog |

## Listing convention

Mọi `GET /api/<resource>` list endpoint hỗ trợ:

- `?search=` substring text search
- `?status=active,inactive` comma-separated filter
- `?page=1&size=20&sort=field:desc`

Response shape:

```json
{
  "data": [...],
  "page": { "page": 1, "size": 20, "total": 137 }
}
```

Không có pagination cho `settings`, `dashboard`, `counters`.

## Idempotency

Không có Idempotency-Key trong MVP. FE disable nút sau click đầu để giảm double-submit.
