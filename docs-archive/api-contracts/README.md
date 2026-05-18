# API Contracts — Index

> **All endpoints in this folder are [RECOMMENDED].** No backend exists in the repository (**[VERIFIED]** in `architecture/system-classification.md`). These contracts are the build brief for a future backend.

---

## Conventions (apply to every endpoint)

### Base URL
`https://<tenant>.<host>/api/v1`

### Transport
- HTTPS only; TLS 1.2+.
- `Content-Type: application/json; charset=utf-8`.
- `Accept-Language: vi-VN` (default).
- All money on the wire = decimal string (`"15000000"`) — never JS `number`.
- All dates = ISO `YYYY-MM-DD` in Asia/Ho_Chi_Minh; all timestamps = ISO 8601 UTC.

### Authentication
Default: **session cookie** (`HttpOnly Secure SameSite=Lax`) issued by `POST /api/v1/auth/login`. Alternative: **Bearer JWT** in `Authorization` header. Tenant ID **derived from session** — never trusted from request body.

### Permissions
Every endpoint declares its required permission token (e.g. `Invoice:create:final`). See `roles/roles-and-permissions.md` and `architecture/missing-authorization.md`.

### Idempotency
- All POST / PATCH endpoints with financial side-effects accept and honour `Idempotency-Key: <uuid>`.
- The server stores `(tenant_id, key) → response` in Redis for 24 h.
- Replays with the same key + same body return the cached response.

### Optimistic concurrency
- All PATCH / PUT endpoints accept `If-Match: <ISO updated_at>`.
- Mismatch → `409 Conflict` (`type: …/errors/conflict-version`).

### Pagination
- Cursor-based for high-cardinality lists (invoices, payments, audit logs).
- `?page=1&size=20&sort=field:asc|desc` for small lists.
- Response envelope (always for list endpoints):
  ```json
  {
    "data":  [ ... ],
    "page":  { "size": 20, "total": 137, "next": "cursor..." },
    "meta":  { "requestId": "..." }
  }
  ```

### Filtering
- Convention: `field=value` for equality, `field[gte]=...&field[lt]=...` for range.
- Free-text search: `?search=<query>` — case-insensitive substring (server-side decides which fields).

### Error envelope (RFC 7807 Problem Details)
```json
{
  "type":     "https://invoicepro.vn/errors/validation",
  "title":    "Số tiền không hợp lệ",
  "status":   400,
  "code":     "V-PAY-01",
  "detail":   "amount must be > 0",
  "instance": "/api/v1/invoices/INV001/payments",
  "fields":   { "amount": ["must be > 0"] },
  "requestId": "..."
}
```

Standard HTTP codes:

| Code | Meaning |
|---|---|
| 200 OK | Success with body |
| 201 Created | Created with body |
| 202 Accepted | Async job enqueued |
| 204 No Content | Success without body |
| 400 Bad Request | Validation failure (V-*) |
| 401 Unauthenticated | Missing/expired session |
| 403 Forbidden | Authenticated but lacks permission |
| 404 Not Found | Missing OR foreign-tenant (do not distinguish) |
| 409 Conflict | Concurrency or unique-constraint violation |
| 422 Unprocessable | Domain-rule violation (e.g. add payment to draft) |
| 429 Too Many Requests | Rate-limited |
| 5xx | Server error — request-id surfaced for support |

### Audit
Every mutating endpoint MUST emit one row to `audit_logs` after the underlying DB transaction commits. See `architecture/missing-audit-system.md`.

### Tenant isolation
Every query MUST include `WHERE tenant_id = :session_tenant`. Postgres RLS is enforced as defence in depth.

---

## Files

| File | Module |
|---|---|
| [auth.md](./auth.md) | Authentication |
| [users.md](./users.md) | User management & profile |
| [customers.md](./customers.md) | Customers |
| [products.md](./products.md) | Products |
| [invoices.md](./invoices.md) | Invoices + payments |
| [quotations.md](./quotations.md) | Quotations |
| [debts.md](./debts.md) | Receivables / aging |
| [reports.md](./reports.md) | Reports + exports |
| [settings.md](./settings.md) | Tenant settings |
| [templates.md](./templates.md) | Invoice templates |
| [notifications.md](./notifications.md) | In-app notifications |
| [common-errors.md](./common-errors.md) | Error-code catalog |

---

## Maintenance rule

Whenever a per-module SRS (`modules/*.md`) or per-module build brief (`future-architecture/*.md`) changes, the corresponding API-contract file MUST be updated in the same PR.
