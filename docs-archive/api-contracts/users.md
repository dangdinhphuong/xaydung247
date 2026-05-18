# API Contract — Users & Profile

> **[RECOMMENDED]** — No backend exists. See `future-architecture/users.md` and `architecture/missing-authorization.md`.

---

## Common

- **Base:** `/api/v1`.
- **Auth:** session required.
- **Tenant:** derived from session.

---

## GET `/users`
- **Permission:** `User:list` (ADMIN only).
- **Query:** `?search=&role=&status=&page=1&size=20&sort=fullName:asc`.
- **Response 200:** `{ data: User[], page: {...} }`.

`User` shape:
```json
{
  "id": "uuid",
  "email": "...",
  "fullName": "...",
  "phone": "0901234567",
  "role": "ADMIN|ACCOUNTANT|SALES|VIEWER",
  "status": "active|inactive",
  "avatarUrl": null,
  "lastLoginAt": "2026-05-18T10:00:00Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## POST `/users`
- **Permission:** `User:create`.
- **Idempotency:** `Idempotency-Key` recommended.

### Request
```json
{ "fullName": "Nguyễn Văn A", "email": "a@example.com", "phone": "0901234567", "role": "ACCOUNTANT" }
```

### Validation
| Field | Rule | Error |
|---|---|---|
| fullName | 2–120 chars | — |
| email | RFC-5322; unique per tenant | `V-USR-01` |
| phone | optional; `^0\d{9,10}$` if present | `V-USR-02` |
| role | enum | — |

### Response 201
```json
{ "user": { ...User }, "inviteLink": "https://.../invite?token=..." }
```

### Audit
`user.create`.

---

## GET `/users/:id`
- **Permission:** `User:list`.
- **Response 200:** `User`.
- **Errors:** 404 (also for cross-tenant — `AUTHZ-02`).

---

## PATCH `/users/:id`
- **Permission:** `User:update`.
- **Header:** `If-Match: <ISO updatedAt>`.

### Request (partial)
```json
{ "fullName": "...", "phone": "...", "role": "ADMIN", "status": "inactive", "avatarUrl": "..." }
```

### Domain rules
- BR-USR-03: cannot demote / deactivate the last `ADMIN` → 422 `DOMAIN-LAST-ADMIN`.
- A user cannot change their own role via this endpoint.

### Response 200: `User`.

### Audit
`user.update` (with before/after) or `user.role_change` / `user.deactivate` if those specific fields changed.

---

## POST `/users/:id/resend-invite`
- **Permission:** `User:create`.
- **Response 200:** `{ inviteLink, expiresAt }`.
- **Side-effect:** invalidates previous invite token.

---

## GET `/profile`
- **Permission:** self.
- **Response 200:** `User` (self).

---

## PATCH `/profile`
- **Permission:** self.
- **Request:** `{ fullName?, phone?, avatarUrl? }` (no role, no status, no email — email needs verify flow).
- **Response 200:** `User`.

---

## POST `/profile/change-password`
See `auth.md`.

---

## POST `/profile/change-email` *(optional)*
- **Permission:** self.
- **Request:** `{ newEmail, currentPassword }`.
- **Behavior:** sends confirm link to `newEmail`; email is NOT switched until link is clicked.

---

## Audit events emitted

`user.create`, `user.update`, `user.role_change`, `user.deactivate`, `user.reactivate`, `auth.password_change`.

---

## Related
- `modules/users.md` (SRS).
- `future-architecture/users.md`.
- `roles/roles-and-permissions.md`.
