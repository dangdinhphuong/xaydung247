# Future Architecture — Authentication

> See `architecture/missing-authentication.md` for the full design. This file is a compact per-module summary.

---

## 1. Current Frontend Implementation [VERIFIED]

- No `/login` route.
- `Header.tsx` displays hard-coded user.
- Logout / Profile dropdown items have no handlers.

## 2. Missing Backend Requirements [RECOMMENDED]

- Session or JWT auth, password hashing, rate limit, lockout, reset flow, MFA-ready.

## 3. Recommended API Design [RECOMMENDED]

`POST /api/auth/login | logout | refresh | forgot-password | reset-password | change-password`
`GET  /api/auth/me`

## 4. Recommended Database Tables [RECOMMENDED]

- `users` (bcrypt `password_hash`).
- Redis: session store / refresh token revocation list.

## 5. Recommended Auth Flow [RECOMMENDED]

See `architecture/missing-authentication.md` §4.

## 6. Recommended Validation Strategy [RECOMMENDED]

- Email RFC-5322.
- Password ≥ 8, letter + digit, not in HIBP top breaches.
- Server-side rate-limit (BR-AUTH-02).

## 7. Recommended Audit Logging [RECOMMENDED]

- `auth.login.success | .failure | .lockout`, `auth.logout`, `auth.password_change`, `auth.password_reset.*`.

## 8. Recommended State Persistence [RECOMMENDED]

- FE: `useAuth()` context populated by `GET /api/auth/me`.
- Redirect to `/login` on 401 with `?from=…`.
- Axios/fetch interceptor adds CSRF token (cookie mode) or Bearer (JWT mode).
