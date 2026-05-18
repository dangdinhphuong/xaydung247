# API Contract — Authentication

> **[RECOMMENDED]** — No auth currently exists (`architecture/missing-authentication.md`).

All paths relative to `/api/v1`. Base conventions in `api-contracts/README.md`.

---

## POST `/auth/login`

- **Auth:** none.
- **Permission:** none.
- **Rate limit:** 10/min per IP; 5/15min per email.
- **Idempotency:** no.

### Request
```json
{ "email": "user@example.com", "password": "string", "rememberMe": false }
```

### Validation
| Field | Rule | Error |
|---|---|---|
| email | RFC-5322, ≤100 chars | `V-AUTH-02` |
| password | non-empty | `V-AUTH-01` |
| rememberMe | optional boolean | — |

### Response 200
```json
{
  "user": { "id": "uuid", "email": "...", "fullName": "...", "role": "ADMIN", "tenantId": "uuid", "avatarUrl": null }
}
```
+ `Set-Cookie: session=<opaque>; HttpOnly; Secure; SameSite=Lax; Path=/`.

### Errors
- 401 `AUTH-01` — wrong credentials (5 failures → 423 `AUTH-02`).
- 403 `AUTH-03` — inactive account.

---

## POST `/auth/logout`

- **Auth:** session (optional — always 204).
- **Permission:** none.

### Response 204
+ `Set-Cookie: session=; Max-Age=0`.

---

## POST `/auth/refresh`

- **Auth:** cookie OR refresh token in body.
- **Used by:** JWT mode only.

### Response 200
```json
{ "accessToken": "...", "expiresIn": 900 }
```

---

## POST `/auth/forgot-password`

- **Auth:** none.
- **Rate limit:** 5/min per IP; 3/hr per email.
- **Behavior:** always 204 (no enumeration).

### Request
```json
{ "email": "user@example.com" }
```

### Response 204
(Server emails reset link if email exists, valid 30 min.)

---

## POST `/auth/reset-password`

- **Auth:** none.
- **Rate limit:** 10/min per IP.

### Request
```json
{ "token": "single-use-token", "password": "newPassword123" }
```

### Validation
| Field | Rule | Error |
|---|---|---|
| token | exists, single-use, ≤30 min old | `AUTH-04` |
| password | ≥8 chars, ≥1 letter, ≥1 digit, not in HIBP top breaches | `V-USR-05` |

### Response 204

---

## POST `/auth/change-password`

- **Auth:** session.
- **Permission:** self.

### Request
```json
{ "currentPassword": "...", "newPassword": "..." }
```

### Validation
| Field | Rule | Error |
|---|---|---|
| currentPassword | matches stored bcrypt | `V-USR-04` |
| newPassword | same policy as reset-password | `V-USR-05` |

### Response 204

---

## GET `/auth/me`

- **Auth:** session.
- **Permission:** self.

### Response 200
```json
{ "user": { "id":"uuid", "email":"...", "fullName":"...", "role":"ADMIN", "tenantId":"uuid", "permissions":["Invoice:create:final", "..."], "tenant": { "id":"...", "name":"...", "logoUrl": null } } }
```

### Errors
- 401 `AUTH-06`.

---

## Audit events emitted

`auth.login.success`, `auth.login.failure`, `auth.lockout`, `auth.logout`, `auth.password_change`, `auth.password_reset.requested`, `auth.password_reset.completed`.

---

## Related

- `architecture/missing-authentication.md`
- `roles/roles-and-permissions.md`
- `gap-analysis/security-risks.md` SECR-001, SECR-006, SECR-007, SECR-013
