# Future Architecture — User Management

---

## 1. Current Frontend Implementation [VERIFIED]

- No user-management screen.
- No profile screen.

## 2. Missing Backend Requirements [RECOMMENDED]

- Full CRUD for `ADMIN`.
- Self-service profile / password change.
- Invite link flow (single-use, 7 days).
- Last-admin protection.

## 3. Recommended API Design [RECOMMENDED]

| Verb | Path | Body | Permission |
|---|---|---|---|
| GET    | `/api/users` | — | `User:list` |
| POST   | `/api/users` | `{fullName, email, phone?, role}` | `User:create` (returns `{user, inviteLink}`) |
| GET    | `/api/users/:id` | — | `User:list` |
| PATCH  | `/api/users/:id` | `{fullName?, phone?, role?, status?, avatarUrl?}` | `User:update` |
| POST   | `/api/users/:id/resend-invite` | — | `User:create` |
| GET    | `/api/profile` | — | (self) |
| PATCH  | `/api/profile` | partial | (self) |
| POST   | `/api/profile/change-password` | `{currentPassword, newPassword}` | (self) |

## 4. Recommended Database Tables [RECOMMENDED]

- `users` (see `database/database-dictionary.md`).
- UNIQUE(tenant_id, lower(email)).

## 5. Recommended Auth Flow [RECOMMENDED]

- `JwtAuthGuard` + `@RequirePermission('User:…')`.
- Profile endpoints accessible to authenticated user for self only.

## 6. Recommended Validation Strategy [RECOMMENDED]

- V-USR-01..05 (`qa/validation-rules.md` §8).
- BR-USR-03: cannot deactivate / demote the last admin.

## 7. Recommended Audit Logging [RECOMMENDED]

- `user.create / .update / .role_change / .deactivate / .reactivate`.
- `auth.password_change`.

## 8. Recommended State Persistence [RECOMMENDED]

- FE: `useQuery(['users', filters])`, `useQuery(['user', id])`.
- Mutations invalidate `['users']`.
