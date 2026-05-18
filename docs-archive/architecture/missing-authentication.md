# Missing Authentication — Invoice Pro

> Authentication does not exist (**[VERIFIED]**). This document is the **[RECOMMENDED]** target.

---

## 1. Current state

**[VERIFIED]**:
- No `/login`, `/forgot-password`, `/reset-password`, `/profile` routes (see `src/app/routes.ts`).
- No `@nestjs/jwt`, `jsonwebtoken`, `passport`, `bcrypt`, `next-auth` in `package.json`.
- No `Authorization` header is ever set; no `fetch` call exists anywhere.
- `src/app/components/Header.tsx` renders a hard-coded user "Nguyễn Văn An — Quản trị viên".
- Avatar dropdown items `Hồ sơ / Cài đặt / Đăng xuất` have no handlers.

Consequence: anyone with the URL is implicitly an administrator with full app powers.

---

## 2. Recommended authentication strategy

### 2.1 Primary strategy — **Session cookie + CSRF token**
- POST `/api/auth/login` validates email/password, creates a server-side session, returns a `HttpOnly Secure SameSite=Lax` cookie.
- Every mutating request sends `X-CSRF-Token` (double-submit cookie pattern).
- Logout invalidates the session server-side.
- Pros: opaque tokens, easy revocation, no localStorage usage.
- Cons: requires sticky sessions OR Redis-backed session store.

### 2.2 Alternative — **JWT (access + refresh)**
- POST `/api/auth/login` returns `accessToken` (15 min TTL) and `refreshToken` (7 days TTL).
- Client sends `Authorization: Bearer <accessToken>` on every request.
- On 401, client calls `POST /api/auth/refresh`; if that fails, redirect to `/login`.
- Refresh tokens stored in Redis revocation list; logout adds the JTI to the deny list.
- Pros: stateless, scales horizontally trivially.
- Cons: harder revocation, larger attack surface if tokens leak.

### 2.3 Optional — **OIDC SSO**
For enterprise customers — Keycloak, Google Workspace, Azure AD via authorization-code + PKCE flow. Email/password remains the default.

> **Default recommendation:** start with cookie sessions; add OIDC later for enterprise tenants.

---

## 3. Recommended endpoints

| Verb | Path | Body | Response | Notes |
|---|---|---|---|---|
| POST | `/api/auth/login` | `{email, password, rememberMe?}` | `{user}` + Set-Cookie | 423 if locked |
| POST | `/api/auth/logout` | — | 204 | Always 204 even if no session |
| POST | `/api/auth/refresh` | (cookie or refreshToken) | `{accessToken}` | If JWT mode |
| POST | `/api/auth/forgot-password` | `{email}` | 204 | Always 204 to avoid enumeration |
| POST | `/api/auth/reset-password` | `{token, password}` | 204 | Token single-use, 30 min TTL |
| GET  | `/api/auth/me` | — | `{user}` | 401 if no session |
| POST | `/api/auth/change-password` | `{currentPassword, newPassword}` | 204 | Self-service |

---

## 4. Workflows

### 4.1 Login
```
User enters email + password
   │
   ▼
POST /api/auth/login
   │
   ├─ rate-limit by IP and email (10/min IP; 5/15min per email)
   ├─ verify bcrypt hash
   ├─ on success: create session, set cookie, return {user}
   └─ on failure: increment failure counter; lock after 5 in 15 min (BR-AUTH-02)
   │
   ▼
Client redirects to last requested URL OR `/`
```

### 4.2 Logout
```
User clicks "Đăng xuất" in avatar dropdown
   │
   ▼
POST /api/auth/logout
   │
   └─ invalidate session server-side
   │
   ▼
Cookie cleared; redirect to /login
```

### 4.3 Password reset
```
User requests reset
   │
   ▼ POST /api/auth/forgot-password
   │   (always 204)
   ▼
Server emails reset link valid 30 min
   │
   ▼
User clicks link → /reset-password?token=…
   │
   ▼ POST /api/auth/reset-password
   │   ├─ verify token single-use & not expired
   │   ├─ enforce password policy
   │   └─ bcrypt-hash + store
   ▼
Redirect to /login
```

### 4.4 Session refresh (JWT mode)
```
API returns 401 with "TOKEN_EXPIRED"
   │
   ▼
Client interceptor calls POST /api/auth/refresh
   │
   ├─ success: replay original request with new token
   └─ failure: clear local state; redirect to /login?from=<originalUrl>
```

---

## 5. Form fields

### 5.1 Login form
| Field | Type | Required | Validation | Business meaning |
|---|---|---|---|---|
| email | email | Yes | RFC-5322, ≤ 100 chars, lower-cased | Login identifier |
| password | password | Yes | non-empty | Secret |
| rememberMe | checkbox | No | — | Extends cookie TTL to 30 days |

### 5.2 Forgot-password form
| Field | Type | Required | Validation |
|---|---|---|---|
| email | email | Yes | RFC-5322 |

### 5.3 Reset-password form
| Field | Type | Required | Validation |
|---|---|---|---|
| password | password | Yes | ≥ 8 chars, ≥ 1 letter, ≥ 1 digit, not in HIBP top breaches |
| confirmPassword | password | Yes | === password |
| token | hidden | Yes | server-validated single-use 30 min |

### 5.4 Self-change-password form
| Field | Type | Required | Validation |
|---|---|---|---|
| currentPassword | password | Yes | matches stored hash |
| newPassword | password | Yes | as reset-password |
| confirmNewPassword | password | Yes | === newPassword |

---

## 6. Business rules

| ID | Rule |
|---|---|
| BR-AUTH-01 | Passwords stored as bcrypt hashes (cost ≥ 10). |
| BR-AUTH-02 | After 5 failed login attempts within 15 min for an email → temporarily lock 30 min. |
| BR-AUTH-03 | Sessions/JWTs transmitted only over HTTPS. Cookies HttpOnly + Secure + SameSite=Lax. |
| BR-AUTH-04 | Logout invalidates server-side session (or revokes refresh token JTI). |
| BR-AUTH-05 | `tenant_id` derived from session — never trusted from request body. |
| BR-AUTH-06 | Self-service password change requires current password re-entry. |
| BR-AUTH-07 | Last `ADMIN` cannot be deactivated/demoted (enforce in users module). |
| BR-AUTH-08 | Reset token single-use; on use, invalidate even on failure. |
| BR-AUTH-09 | New passwords checked against HIBP k-anonymity API (advisory; reject top breached passwords). |
| BR-AUTH-10 | Email change requires verifying the new address before switch. |

---

## 7. Error cases

| Code | Trigger | UX |
|---|---|---|
| AUTH-01 | Wrong credentials | "Email hoặc mật khẩu không đúng" — do NOT reveal which one is wrong |
| AUTH-02 | Account locked | "Tài khoản tạm khoá. Vui lòng thử lại sau 30 phút." |
| AUTH-03 | Account inactive | "Tài khoản đã bị vô hiệu hoá. Liên hệ quản trị viên." |
| AUTH-04 | Reset token invalid / expired | "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." |
| AUTH-05 | Session expired (401) | Redirect to `/login?from=…` |
| AUTH-06 | Weak password | "Mật khẩu phải ≥ 8 ký tự, gồm chữ và số" |
| AUTH-07 | Wrong current password on change | "Mật khẩu hiện tại không đúng" |

See `qa/validation-rules.md` codes `V-AUTH-*`, `V-USR-*`.

---

## 8. UI changes required in the existing SPA

1. **Add `/login`, `/forgot-password`, `/reset-password`** routes to `src/app/routes.ts`.
2. **Wrap protected routes** in an `<AuthGuard>` component that:
   - Calls `GET /api/auth/me` once at mount.
   - On 401, redirects to `/login?from=<current>`.
   - Stores the loaded user in a `useAuth()` context.
3. **Replace `src/app/components/Header.tsx` hard-coded user** with `useAuth().user`.
4. **Wire the avatar dropdown** items:
   - "Hồ sơ" → `/profile`.
   - "Cài đặt" → already routes to `/settings`.
   - "Đăng xuất" → `POST /api/auth/logout` → redirect `/login`.
5. **Add `LoginPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `ProfilePage`** components.
6. **Add an Axios/fetch interceptor** that:
   - Attaches CSRF token to mutating requests (cookie mode) OR `Authorization` header (JWT mode).
   - On 401, calls refresh OR redirects to login.

---

## 9. Backend implementation hints (NestJS recommended)

```ts
// src/auth/auth.module.ts
@Module({
  imports: [PassportModule, JwtModule.register({ secret: env.JWT_SECRET, signOptions: { expiresIn: '15m' } })],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

// Guards
@Injectable() export class JwtAuthGuard extends AuthGuard('jwt') {}
@Injectable() export class RolesGuard implements CanActivate { … }

// Decorator
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
export const CurrentUser = createParamDecorator(...);

// Usage
@UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN') @Controller('users')
export class UsersController { ... }
```

---

## 10. Security requirements (cross-reference)

- `gap-analysis/security-risks.md` — SECR-001..003 (auth), SECR-006 (CSRF), SECR-007 (rate-limit), SECR-013 (password policy).
- `qa/security-test-cases.md` — SEC-AUTH-01..10.
- `roles/roles-and-permissions.md` — RBAC matrix.

---

## 11. Pre-launch gating

Authentication MUST be complete before any production exposure. See `gap-analysis/implementation-status.md` §14.

Minimum viable auth deliverables:
- [ ] Login / logout / refresh / forgot / reset endpoints.
- [ ] AuthGuard wrapping all protected routes.
- [ ] Header.tsx reads from `useAuth()`.
- [ ] Bcrypt + rate-limit + lockout (BR-AUTH-01/02).
- [ ] HTTPS-only, secure cookies (BR-AUTH-03).
- [ ] Audit log entries on every login (success/failure) and logout.
