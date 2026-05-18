# Module — User Management

> **Status: NOT IMPLEMENTED in current build.** UI placeholders ("Hồ sơ / Cài đặt / Đăng xuất" in `Header.tsx`) imply intent but no screens exist. This document specifies the recommended module.

---

## 1. Purpose
Let an Administrator create, edit, deactivate, and assign roles to users within their tenant.

## 2. Actors
- Administrator (full CRUD on users in own tenant).
- User (read & update own profile only).

## 3. Preconditions
- Caller is authenticated; for CRUD the caller has role `ADMIN`.

## 4. Modules / submodules
- `/users` — list
- `/users/new` — create
- `/users/:id` — view + edit
- `/profile` — self-service edit (any role)

---

## 5. Workflows

### 5.1 Create user
1. Admin clicks "Thêm người dùng".
2. Fills the form (see §6).
3. System checks email uniqueness within tenant.
4. System creates user with `status='active'`, generates a **one-time invite link** valid 7 days, and emails it (or shows it for copy).
5. New user clicks invite → sets password → can sign in.

### 5.2 Edit role / deactivate
- Admin opens user → toggles role or sets `status='inactive'`.
- A deactivated user is rejected at login (BR-USR-04).

### 5.3 Self-service profile edit
- Any user can change `fullName`, `phone`, `avatar`, `password` (current password required).
- Email change requires re-verification (recommended).

---

## 6. Form fields — User

| Field | Type | Required | Validation | Default | Editable | Business meaning |
|---|---|---|---|---|---|---|
| fullName | text | Yes | 2–100 chars | — | Yes | Display name shown in `Header` and audit logs |
| email | email | Yes | RFC-5322; unique per tenant | — | Yes (admin) / re-verify (self) | Login identifier |
| phone | text | No | VN format (10 digits, starts with 0) | — | Yes | Contact |
| role | enum | Yes | one of `ADMIN | ACCOUNTANT | SALES | VIEWER` | `VIEWER` | RBAC |
| status | enum | Yes | `active | inactive` | `active` | Yes (admin) | Lifecycle |
| avatarUrl | url | No | image url | — | Yes | Header avatar |
| password | password | Yes (on create / change) | ≥ 8 chars + ≥ 1 letter + ≥ 1 digit | — | Yes | Bcrypt-hashed |

---

## 7. Business rules

| ID | Rule |
|---|---|
| BR-USR-01 | A user belongs to exactly one tenant. |
| BR-USR-02 | Email is unique per tenant (not globally). |
| BR-USR-03 | A tenant must always have ≥ 1 active `ADMIN`. The system MUST prevent deactivating / demoting the last admin. |
| BR-USR-04 | A user with `status='inactive'` cannot sign in (BR-AUTH-04). |
| BR-USR-05 | A user cannot change their own role; only an admin can. |
| BR-USR-06 | Deleting a user is forbidden — only deactivation, to preserve audit log integrity. References to the user (created invoices, recorded payments) remain. |

---

## 8. UI behaviors

- User list table columns: avatar, full name, email, role, status, last login, actions.
- Status pill: green "Hoạt động" / grey "Không hoạt động" (mirrors customer-status pattern in `CustomerManagement.tsx`).
- Action buttons: edit, deactivate (red), resend invite (if pending).

---

## 9. API contract

| Verb | Path | Body | Response |
|---|---|---|---|
| GET  | `/api/users` | — | `User[]` |
| POST | `/api/users` | `{fullName, email, phone?, role}` | `{user, inviteLink}` |
| GET  | `/api/users/:id` | — | `User` |
| PUT  | `/api/users/:id` | `{fullName?, phone?, role?, status?, avatarUrl?}` | `User` |
| POST | `/api/users/:id/resend-invite` | — | `{inviteLink}` |
| PUT  | `/api/profile` | self fields | `User` |
| POST | `/api/profile/change-password` | `{currentPassword, newPassword}` | 204 |

---

## 10. Validation rules

| Code | Trigger | Message |
|---|---|---|
| V-USR-01 | Email already exists in tenant | "Email đã được sử dụng" |
| V-USR-02 | Invalid phone | "Số điện thoại không hợp lệ" |
| V-USR-03 | Trying to deactivate last admin | "Không thể vô hiệu hoá quản trị viên cuối cùng" |
| V-USR-04 | Wrong current password on self-change | "Mật khẩu hiện tại không đúng" |

---

## 11. Edge cases

- Re-inviting an already-active user: invalidate previous invite token.
- Email change by self: send confirm link to the **new** address; do not switch until confirmed.
- Admin lowers own role: forbidden (use another admin).

---

## 12. Audit log entries
- `user.create`, `user.update`, `user.deactivate`, `user.reactivate`, `user.role_change`, `auth.password_change`.
