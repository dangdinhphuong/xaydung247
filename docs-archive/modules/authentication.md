# Module — Authentication & User Session

> **Status: NOT IMPLEMENTED in current build.** This file specifies the **recommended target behavior** to be built before any production release. It is included because the dashboard layout already assumes a logged-in user ("Nguyễn Văn An — Quản trị viên" hard-coded in `components/Header.tsx`).

---

## 1. Purpose
Authenticate users, manage sessions, and gate the application behind an identity check that the rest of the modules (RBAC, audit log, tenant isolation) depend on.

---

## 2. Business description
Each merchant deploys Invoice Pro for their shop. Each shop has 1–N named users (owner, accountants, salespersons). The system must:
- Let each user sign in with credentials.
- Persist their session across page reloads.
- Surface a sign-out action.
- Expose the authenticated profile (full name, role, avatar) in the top header.
- Lock writes behind a valid session and an authorised role (see `roles/roles-and-permissions.md`).

---

## 3. Actors
- Unauthenticated visitor.
- Authenticated user (any role).
- Administrator (manages other users — see `users.md`).

---

## 4. Preconditions
- The user exists in the `users` table and is `active`.
- The session secret / JWT key is configured server-side.

---

## 5. Workflows

### 5.1 Sign in (Đăng nhập)
1. User opens any URL while unauthenticated → redirect to `/login` (route to be added).
2. User enters **email** + **password** (+ optional **remember me**).
3. Client submits to `POST /api/auth/login`.
4. Server verifies credentials (bcrypt), issues a session token (HttpOnly secure cookie or JWT in `Authorization: Bearer …`).
5. On success → redirect to last requested URL (default `/`).
6. On failure → display "Email hoặc mật khẩu không đúng" (do not reveal which one is wrong).

### 5.2 Sign out (Đăng xuất)
- Triggered from the avatar dropdown's **Đăng xuất** menu item (UI already present in `Header.tsx`).
- Client calls `POST /api/auth/logout` → server invalidates session → redirect to `/login`.

### 5.3 Forgot password
- "Quên mật khẩu?" link on `/login` → `/forgot-password`.
- User enters email → server emails a one-time reset link valid 30 min.
- Clicking link → `/reset-password?token=…` → user enters new password twice.

### 5.4 Session refresh
- JWT TTL recommended 15 min access + 7 day refresh; or sliding-cookie sessions of 24 h.
- On 401 from any API call, the client triggers `POST /api/auth/refresh`; if that fails, redirect to `/login`.

---

## 6. Form fields

### 6.1 Login form

| Field | Type | Required | Validation | Default | Editable | Business meaning |
|---|---|---|---|---|---|---|
| email | email | Yes | RFC-5322 format, ≤ 100 chars, trimmed lowercase | empty | Yes | Login identifier |
| password | password | Yes | ≥ 8 chars (server policy) | empty | Yes | Secret |
| rememberMe | checkbox | No | — | unchecked | Yes | Extends cookie to 30 days |

### 6.2 Forgot-password form

| Field | Type | Required | Validation | Business meaning |
|---|---|---|---|---|
| email | email | Yes | RFC-5322 | Account to recover |

### 6.3 Reset-password form

| Field | Type | Required | Validation | Business meaning |
|---|---|---|---|---|
| password | password | Yes | ≥ 8 chars, ≥ 1 letter + 1 digit | New secret |
| confirmPassword | password | Yes | === password | Confirmation |
| token | hidden | Yes | server-validated, single-use, 30 min TTL | Reset proof |

---

## 7. Business rules

| ID | Rule |
|---|---|
| BR-AUTH-01 | Passwords are stored as bcrypt hashes (cost ≥ 10). |
| BR-AUTH-02 | After 5 failed login attempts within 15 min for the same email → temporarily lock for 30 min and log the event. |
| BR-AUTH-03 | Sessions / JWTs MUST be transmitted only over HTTPS. Cookies MUST be `HttpOnly`, `Secure`, `SameSite=Lax`. |
| BR-AUTH-04 | Logout invalidates the session server-side (revocation list or short-TTL+refresh). |
| BR-AUTH-05 | The authenticated user's `tenant_id` is derived from the session — never from the request body. |
| BR-AUTH-06 | Self-service password change is allowed; current password MUST be re-typed. |

---

## 8. API contract (recommended)

| Verb | Path | Body | Response | Status |
|---|---|---|---|---|
| POST | `/api/auth/login` | `{email, password, rememberMe}` | `{user, accessToken, refreshToken?}` | 200 / 401 / 423 |
| POST | `/api/auth/logout` | — | — | 204 |
| POST | `/api/auth/refresh` | `{refreshToken}` | `{accessToken}` | 200 / 401 |
| POST | `/api/auth/forgot-password` | `{email}` | — (always 204 to avoid enumeration) | 204 |
| POST | `/api/auth/reset-password` | `{token, password}` | — | 204 / 400 |
| GET  | `/api/auth/me` | — | `{user}` | 200 / 401 |

---

## 9. UI behaviors

- Login form: disable submit while pending; show inline error in a red panel.
- After login, the avatar dropdown in `Header.tsx` shows real `user.fullName` + `user.role` instead of the current hard-coded text.
- "Hồ sơ" menu item → `/profile` (to be added) for self-service edits.

---

## 10. Error cases

| Code | Trigger | UX |
|---|---|---|
| AUTH-01 | Wrong credentials | Toast / inline: "Email hoặc mật khẩu không đúng" |
| AUTH-02 | Account locked (BR-AUTH-02) | "Tài khoản tạm khoá. Vui lòng thử lại sau 30 phút." |
| AUTH-03 | Account disabled by admin | "Tài khoản đã bị vô hiệu hoá. Liên hệ quản trị viên." |
| AUTH-04 | Reset token invalid/expired | "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." |
| AUTH-05 | Session expired (401) | Redirect to `/login` with `?from=…` to return after re-login. |

---

## 11. Security constraints

- TLS-only.
- Rate-limit `/login`, `/forgot-password`, `/reset-password` to 10 req/min/IP.
- CSRF protection if cookie-based auth.
- Audit every authentication event (success and failure) including IP and user-agent.
- Never log passwords or tokens.
- Reject reuse of last 5 passwords (recommended).

---

## 12. Gaps in current build to close

1. Build `/login`, `/forgot-password`, `/reset-password` routes.
2. Introduce an `AuthGuard` wrapping `routes.ts` children.
3. Replace hard-coded user in `Header.tsx` with `useAuth()` hook.
4. Wire the *Đăng xuất* menu item to `POST /api/auth/logout`.
5. Add `Authorization` header / cookie handling to all `fetch` calls.
