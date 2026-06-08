# API — Users

ADMIN only.

## GET `/api/users`

- **Auth:** session
- **Roles:** ADMIN

### Query
`?search=&role=&status=&page=1&size=20`

### Response 200
```json
{
  "data": [
    {
      "id": "ObjectId",
      "email": "...",
      "fullName": "...",
      "phone": "...",
      "role": "ADMIN | ACCOUNTANT | SALES | VIEWER",
      "status": "active | inactive",
      "lastLoginAt": "2026-05-18T10:00:00.000Z",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "page": { "page": 1, "size": 20, "total": 4 }
}
```

---

## POST `/api/users`

- **Auth:** session
- **Roles:** ADMIN
- **CSRF:** required

### Request
```json
{
  "email": "kt@vlxdabc.vn",
  "password": "Pass1234",
  "fullName": "Nguyễn Văn A",
  "phone": "0901234567",
  "role": "ACCOUNTANT"
}
```

### Validation
| Field | Rule | Error |
|---|---|---|
| email | RFC-5322, unique | `V-USR-01` if dup |
| password | ≥ 8, ≥ 1 letter + 1 digit | `V-USR-05` |
| fullName | 2–120 | — |
| phone | optional, VN format `^0\d{9,10}$` | `V-USR-02` |
| role | enum | — |

### Response 201
User object (xem GET).

---

## GET `/api/users/:id`

- **Roles:** ADMIN

### Response 200
User object.

### Errors
- 404 `NOT_FOUND`

---

## PATCH `/api/users/:id`

- **Roles:** ADMIN
- **CSRF:** required

### Request (partial)
```json
{ "fullName": "...", "phone": "...", "role": "ACCOUNTANT", "status": "inactive" }
```

### Domain rules
- Last admin protection (`DOMAIN-LAST-ADMIN` 422) — không thể demote/deactivate ADMIN cuối cùng còn active.
- Không có endpoint update email — phải tạo user mới.

### Response 200
User object.

---

## POST `/api/users/:id/reset-password`

- **Roles:** ADMIN
- **CSRF:** required

### Request
```json
{ "newPassword": "..." }
```

### Validation
- newPassword: ≥ 8, letter + digit.

### Response 204

ADMIN có thể đặt password cho bất kỳ user nào (kể cả chính mình — nhưng nên dùng `/auth/change-password` để cần current password).

---

## DELETE `/api/users/:id`

Không có. Dùng PATCH với `status: 'inactive'`.

---

## Permissions summary

| Action | ADMIN | Others |
|---|---|---|
| List users | ✓ | — (404) |
| Create / Update / Reset password | ✓ | — |
| Deactivate (status=inactive) | ✓ | — |
| Last admin demote/deactivate | DOMAIN-LAST-ADMIN | — |

Users khác chỉ truy cập được `/api/profile` (self):

---

## GET `/api/profile`

- **Auth:** session (any role)

### Response 200
Same as `/auth/me`.

## PATCH `/api/profile`

- **Auth:** session (any role)
- **CSRF:** required

### Request (partial)
```json
{ "fullName": "...", "phone": "..." }
```

Không cho self update role hoặc email.

### Response 200
User object.
