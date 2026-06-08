# API — Authentication

## GET `/api/auth/csrf`

- **Auth:** none
- **Mục đích:** FE lấy CSRF token ở app mount.

### Response 200
```json
{ "csrfToken": "abc123..." }
```

### Notes
- FE lưu token trong memory (không localStorage).
- Token gắn vào header `X-CSRF-Token` cho mọi mutation request.
- Token expire khi session expire.

---

## POST `/api/auth/login`

- **Auth:** none
- **CSRF:** skip (chưa có session)

### Request
```json
{ "email": "admin@vlxdabc.vn", "password": "..." }
```

### Validation
| Field | Rule |
|---|---|
| email | RFC-5322, ≤ 100 chars, lowercase |
| password | min 1 char (verify bcrypt sẽ check sau) |

### Response 200
```json
{
  "user": {
    "id": "ObjectId",
    "email": "admin@vlxdabc.vn",
    "fullName": "Quản trị viên",
    "role": "ADMIN"
  }
}
```
Set-Cookie: `connect.sid=...; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`

### Errors
- 401 `AUTH-INVALID` — sai email hoặc password (same message)
- 403 `AUTH-INACTIVE` — account đã deactivate

---

## POST `/api/auth/logout`

- **Auth:** session (optional)
- **CSRF:** required

### Response 204
Clear cookie. Destroy session.

---

## GET `/api/auth/me`

- **Auth:** session
- **CSRF:** không cần (GET)

### Response 200
```json
{
  "user": {
    "id": "ObjectId",
    "email": "admin@vlxdabc.vn",
    "fullName": "Quản trị viên",
    "role": "ADMIN"
  }
}
```

### Errors
- 401 `AUTH-NEEDED` — chưa login

---

## POST `/api/auth/change-password`

- **Auth:** session (self)
- **CSRF:** required

### Request
```json
{ "currentPassword": "...", "newPassword": "..." }
```

### Validation
| Field | Rule | Error |
|---|---|---|
| currentPassword | match bcrypt | `AUTH-WRONG-PASSWORD` |
| newPassword | ≥ 8 chars, ≥ 1 letter + 1 digit | `V-USR-05` |

### Response 204

---

## Notes

- Không có refresh token (session cookie tự renew).
- Không có forgot password flow tự động — ADMIN reset thủ công qua `/api/users/:id/reset-password`.
- Không có MFA, OIDC.
- Không có lockout — single-tenant nội bộ.
