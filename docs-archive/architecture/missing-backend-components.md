# Missing Backend Components — Invoice Pro

> The backend tier does not exist (**[VERIFIED]** — see `architecture/system-classification.md`). This document is the **[RECOMMENDED]** target architecture for the backend that must be built before production rollout.

---

## 1. Recommended overall shape

```
                  ┌─────────────────────────────┐
                  │  React SPA (existing)       │
                  └────────────┬────────────────┘
                               │ HTTPS / JSON
                               ▼
                  ┌─────────────────────────────┐
                  │  API Gateway / Reverse Proxy│
                  │  (nginx, Cloudflare, AWS    │
                  │   ALB) — TLS, headers,      │
                  │   rate-limit, IP allowlist  │
                  └────────────┬────────────────┘
                               │
                               ▼
                  ┌─────────────────────────────┐
                  │  Application API service    │
                  │  (NestJS recommended)       │
                  │  ─ Controllers              │
                  │  ─ Services                 │
                  │  ─ Guards (auth, RBAC)      │
                  │  ─ Interceptors (logging,   │
                  │     tracing, audit)         │
                  │  ─ DTO + validation pipes   │
                  │  ─ Repositories (per entity)│
                  └─┬───────────────┬──────────┬┘
                    │               │          │
                    ▼               ▼          ▼
          ┌──────────────┐  ┌────────────┐  ┌───────────────┐
          │ PostgreSQL   │  │ Redis      │  │ Object store  │
          │ (or MongoDB) │  │ ─ session  │  │ (S3 / MinIO)  │
          │ Transactional│  │ ─ rate-lim │  │ ─ PDFs        │
          │ data         │  │ ─ cache    │  │ ─ attachments │
          └──────────────┘  └────────────┘  └───────────────┘
                    │               │          │
                    └────────┬──────┴──────────┘
                             ▼
                  ┌─────────────────────────────┐
                  │  Async worker(s)            │
                  │  ─ Cron: overdue scan,      │
                  │    quotation expiry,        │
                  │    reminder emails          │
                  │  ─ Queue: PDF render,       │
                  │    email send, Excel        │
                  │    export                   │
                  └─┬───────────────┬───────────┘
                    │               │
                    ▼               ▼
          ┌──────────────┐  ┌────────────────────┐
          │ Mail provider│  │ Headless renderer  │
          │ (SES, Mailgun│  │ (Puppeteer /       │
          │  SendGrid)   │  │  Gotenberg)        │
          └──────────────┘  └────────────────────┘
```

> Choice of NestJS is **[RECOMMENDED]** because the CLAUDE.md file in this repo already references NestJS-style commands (`/code:gen-handler`, etc.) — implying the team's house framework. Any equivalent stack (Spring Boot, Django REST, FastAPI, ASP.NET Core) is acceptable.

> Choice of PostgreSQL is **[RECOMMENDED]** because the invoice domain is **strongly relational** (foreign keys, transactional invariants, sum-aggregation queries, partial-unique constraints). MongoDB is acceptable if the team prefers and is prepared to enforce constraints in application code (see `database/database-dictionary.md` for relational target; `future-architecture/<module>.md` files include MongoDB-equivalent collection sketches where applicable).

---

## 2. Component-by-component list

### 2.1 HTTP API service

**[RECOMMENDED]** Implement these top-level modules (NestJS terminology):

| Module | Controllers | Notes |
|---|---|---|
| `AuthModule` | `/api/auth/*` | login, logout, refresh, forgot-password, reset-password, me |
| `UsersModule` | `/api/users/*`, `/api/profile/*` | admin CRUD + self-service profile |
| `TenantsModule` | `/api/tenants/me` | tenant settings, branding |
| `CustomersModule` | `/api/customers/*` | CRUD + search + currentDebt derivation |
| `ProductsModule` | `/api/products/*` | CRUD + categories + bulk import |
| `InvoicesModule` | `/api/invoices/*` | CRUD + finalize + void + addPayment subresource |
| `PaymentsModule` | `/api/invoices/:id/payments` | append-only |
| `QuotationsModule` | `/api/quotations/*` | CRUD + send + accept/reject + convert |
| `DebtsModule` | `/api/debts/*` | summary + per-customer aging |
| `ReportsModule` | `/api/reports/*` | revenue, top-customers, aging, exports |
| `SettingsModule` | `/api/settings/*` | per-tenant company / invoice / notification config |
| `TemplatesModule` | `/api/templates/*` | CRUD + set-default + clone + render-PDF |
| `NotificationsModule` | `/api/notifications/*` | in-app feed + mark-read |
| `AuditModule` | `/api/audit/*` | read-only |
| `SearchModule` | `/api/search` | cross-entity (optional) |

Cross-cutting providers:

- `AuthGuard` (JWT or session cookie validator).
- `RolesGuard` + `@Roles('ADMIN', 'ACCOUNTANT', …)` decorator.
- `TenantInterceptor` — extracts `tenant_id` from the validated principal and injects into request context.
- `AuditInterceptor` — wraps mutating endpoints and writes an `audit_logs` row.
- `IdempotencyInterceptor` — dedupes by `Idempotency-Key` header on POST / PATCH financial endpoints.
- `ValidationPipe` — global, with `whitelist: true, forbidNonWhitelisted: true, transform: true`.
- `HttpExceptionFilter` — maps domain errors to standard problem-details responses.

### 2.2 Async workers

**[RECOMMENDED]** Separate process (or threads) for:

| Worker | Trigger | Task |
|---|---|---|
| Cron worker | `0 5 0 * * *` Asia/Ho_Chi_Minh | Reclassify overdue invoices (`fn_recompute_overdue`); expire quotations whose `valid_until < today`. |
| Reminder worker | Daily | Email invoices 3 days before due and on overdue flip (respecting `payment_reminder` setting). |
| PDF worker | Queue-driven | Render invoice PDF using template + invoice data via Puppeteer / Gotenberg. Upload to object store; return signed URL. |
| Email worker | Queue-driven | SMTP send via provider. Retry with backoff. |
| Export worker | Queue-driven | Generate XLSX/PDF reports; upload to object store. |

Recommended queue: **BullMQ on Redis** (Node) or **Spring Cloud Task / RabbitMQ** (Java).

### 2.3 Headless renderer

**[RECOMMENDED]** Either embed Puppeteer in the PDF worker, or run **Gotenberg** as a separate microservice (Docker image). Gotenberg has the advantage of being stateless, language-agnostic, and well-suited to multi-tenant pools.

Inputs:
- Template HTML (either rendered from the block schema or from `customHTML` after DOMPurify sanitisation).
- Invoice data fully populated.
- Tenant company info.

Outputs:
- PDF stream → object store with key `tenants/<tenantId>/invoices/<invoiceId>/<rev>.pdf`.

### 2.4 Object storage

**[RECOMMENDED]** S3 (or MinIO for on-prem). Bucket layout:

```
invoicepro-prod/
  tenants/
    <tenantId>/
      logos/<filename>
      invoices/<invoiceId>/<rev>.pdf
      attachments/<invoiceId>/<uuid>-<originalName>
      exports/<userId>/<jobId>.xlsx
```

All access via **signed URLs** with short TTL (15 min). No public-read bucket policy.

### 2.5 Cache & session store

**[RECOMMENDED]** Redis used for:
- Session storage (if cookie-session) or refresh-token revocation list (if JWT).
- Rate limiting (token bucket).
- Idempotency-key dedupe (24 h TTL).
- Hot caches (dashboard summary per tenant, 60 s TTL).

### 2.6 Mail provider

**[RECOMMENDED]** Transactional mail via AWS SES, Mailgun, or SendGrid. Locally, capture via Mailhog. Template engine: Handlebars or MJML for HTML emails.

### 2.7 Observability

**[RECOMMENDED]**:

| Concern | Tool |
|---|---|
| Structured logs | pino (Node) / logback (Java), JSON to stdout, shipped to Loki / CloudWatch / Datadog |
| Error tracking | Sentry (both FE and BE) with PII scrubbing |
| Tracing | OpenTelemetry → Tempo / Jaeger |
| Metrics | Prometheus scrape `/metrics` endpoint; Grafana dashboards |
| Health | `/healthz` (liveness), `/readyz` (readiness, includes DB + Redis ping) |

### 2.8 Identity provider (optional)

**[RECOMMENDED]** For larger customers, optionally support OIDC SSO (Keycloak, Google Workspace, Azure AD). Local email/password remains the default.

---

## 3. Cross-cutting design choices

### 3.1 Tenancy
Per-tenant isolation enforced at three layers:
- **Application** — `TenantInterceptor` injects `tenant_id` from session.
- **Repository** — every query includes `WHERE tenant_id = :session_tenant`.
- **Database (defence in depth)** — Postgres Row-Level Security policy on every table.

### 3.2 Multi-time-zone
- All `TIMESTAMPTZ` stored in UTC.
- All `DATE` interpreted in Asia/Ho_Chi_Minh (the only target market).
- Backend exposes a `today()` helper that uses tenant TZ; client uses the same date for "Hôm nay" labels.

### 3.3 Money handling
- Server-side amounts: `NUMERIC(18,2)` in Postgres or `Decimal128` in Mongo.
- Wire format: integer minor units OR decimal string — choose one and stick to it (decimal string with up to 2 decimal places recommended for VND clarity).
- Never use JS `number` for arithmetic on currency.

### 3.4 Idempotency
- All financial POSTs require `Idempotency-Key: <uuid>`.
- Backend stores `(key, request_hash, response)` in Redis for 24 h.
- Replays return the cached response.

### 3.5 Optimistic concurrency
- Every mutable row has `updated_at TIMESTAMPTZ`.
- PUT/PATCH endpoints require `If-Match: <ISO8601 updated_at>`.
- Mismatch → 409 Conflict.

### 3.6 Error envelope
**[RECOMMENDED]** RFC 7807 Problem Details JSON:

```json
{
  "type": "https://invoicepro.vn/errors/validation",
  "title": "Số tiền không hợp lệ",
  "status": 400,
  "code": "V-PAY-01",
  "detail": "amount must be > 0",
  "instance": "/api/invoices/INV001/payments",
  "fields": { "amount": ["must be > 0"] }
}
```

---

## 4. Deployment shape (recommended starting point)

| Component | Container | Replica | Notes |
|---|---|---|---|
| `api` | `invoice-pro-api:<sha>` | 2+ | Stateless |
| `worker` | `invoice-pro-worker:<sha>` | 1+ | Same image, different entry point (`node dist/worker.js`) |
| `pdf-renderer` | `gotenberg/gotenberg:latest` | 1+ | Stateless |
| `postgres` | managed RDS / Cloud SQL | 1 primary + 1 replica | PITR backup, encryption at rest |
| `redis` | managed ElastiCache / Memorystore | 1 primary + 1 replica | Persistence optional |
| `frontend` | static SPA served via CDN / nginx | n/a | The existing Vite bundle |

---

## 5. Open decisions for the team

The following choices are **NOT** made by this document; they should be decided by the team before backend work starts:

| Decision | Options | Default recommendation |
|---|---|---|
| Backend language | Node (NestJS), Java (Spring Boot), Python (FastAPI) | NestJS (matches CLAUDE.md hints) |
| Primary DB | PostgreSQL, MongoDB | PostgreSQL (strong relational fit) |
| Auth strategy | Cookie session, JWT, OIDC | Cookie session (simpler), with optional OIDC SSO |
| PDF engine | Puppeteer embedded, Gotenberg microservice | Gotenberg (stateless, isolated) |
| Email provider | SES, Mailgun, SendGrid | SES (cheapest for VN target) |
| Queue | BullMQ (Redis), SQS, RabbitMQ | BullMQ (paired with chosen Redis) |
| Cloud | AWS, GCP, on-prem | AWS for SaaS / on-prem for licence sale |

---

## 6. Relationship to existing documents

- The Singleton `DataStore` API surface in `src/app/data/store.ts` is the **functional contract** that the future backend MUST satisfy. Method names map 1:1 to endpoints (`getInvoices` → `GET /api/invoices`, `addPayment` → `POST /api/invoices/:id/payments`, etc.).
- The recommended Postgres schema is in `database/database-dictionary.md`.
- Per-module endpoint specs live in the `future-architecture/<module>.md` files.
- Per-module validation rules live in `qa/validation-rules.md` (codes `V-CI-*`, `V-PAY-*`, …).
- Security requirements live in `gap-analysis/security-risks.md` and `qa/security-test-cases.md`.

---

## 7. Pre-launch checklist (recap from gap-analysis)

See `gap-analysis/implementation-status.md` §14 for the comprehensive pre-launch gating list. The largest backend deliverables are:

1. Auth + RBAC + tenant isolation.
2. Persistent DB with the schema in `database/database-dictionary.md`.
3. PDF/print pipeline (worker + Gotenberg).
4. Email / reminder pipeline (worker + cron).
5. Audit log (table + interceptor + UI).
6. Idempotency-key enforcement on financial endpoints.
7. Backup / DR + observability stack.
8. CI/CD with typecheck + lint + unit + integration tests.
