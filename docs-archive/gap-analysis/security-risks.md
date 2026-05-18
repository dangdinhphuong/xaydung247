# Security Risks — Invoice Pro

> Formal security findings register. Complements `qa/security-test-cases.md` (which lists positive/negative test cases). This file documents the RISKS in standard issue format.

---

## SECR-001

## Title
No authentication — full application accessible to any visitor.

## Category
Security Risk

## Severity
**Critical**

## Description
There is no login, no session, no JWT, no cookie auth. The app trusts the browser entirely. `Header.tsx` renders a hard-coded "Nguyễn Văn An — Quản trị viên".

## Current Behavior
Anyone with the URL has the powers of an administrator.

## Expected Behavior
Per `modules/authentication.md`.

## Business Impact
Total exposure of customer data, financial records, tax codes. GDPR/PDPL violation. Tax fraud risk.

## Technical Impact
Touches every route, every page, every API call.

## Root Cause Analysis
Prototype scope.

## Affected Modules
All.

## Reproduction Flow
Open the app URL → browse anything.

## Recommended Fix
Implement auth before exposing on the public Internet. Until then, deploy only behind an SSO proxy (Cloudflare Access, Tailscale, basic-auth at the reverse proxy).

## Risk If Unresolved
**Cannot ship publicly.** Inevitable breach.

## Related Business Rules
BO-12, BR-AUTH-*.

---

## SECR-002

## Title
No authorization / RBAC enforcement.

## Category
Security Risk

## Severity
**Critical**

## Description
No `<AuthGuard>`; no role checks; no backend middleware. Even after auth, any authenticated user would have admin rights.

## Current Behavior
N/A — no auth yet.

## Expected Behavior
Per `roles/roles-and-permissions.md` permission matrix.

## Business Impact
SoD violations; junior staff could delete data or alter settings.

## Technical Impact
Frontend route guards + backend middleware on every endpoint.

## Recommended Fix
Implement together with SECR-001. Use a single `requirePermission('resource:action')` middleware.

## Risk If Unresolved
Privilege escalation trivial.

## Related Business Rules
RBAC matrix in `roles/roles-and-permissions.md`.

---

## SECR-003

## Title
No tenant isolation in the data model.

## Category
Security Risk / Architecture Limitation

## Severity
**Critical** (SaaS) / N/A (single-tenant on-prem)

## Description
No `tenant_id` column anywhere. A SaaS deployment leaks every tenant's data to every other tenant.

## Current Behavior
Single shared dataset.

## Expected Behavior
`tenant_id` on every business row + Postgres RLS enforced from session-bound `app.current_tenant`.

## Recommended Fix
Refactor schema and queries before first SaaS customer.

## Risk If Unresolved
Multi-tenant disaster.

## Related Business Rules
ARCH-003.

---

## SECR-004

## Title
Stored XSS via `Template.customHTML` — raw HTML rendered unescaped.

## Category
Security Risk

## Severity
High (once multi-user)

## Description
The HTML-editor mode of templates stores arbitrary markup and renders it raw in preview / print. A malicious template author could inject `<script>` or event handlers.

## Current Behavior
No sanitisation.

## Expected Behavior
DOMPurify on render; explicit allowlist (no `script`, no `on*`, no `javascript:` URLs); editor restricted to ADMIN; banner on preview when `isCustomHTML`.

## Business Impact
Session theft, data exfiltration once cookies/JWTs exist.

## Technical Impact
Add DOMPurify; strict CSP.

## Recommended Fix
```ts
import DOMPurify from 'dompurify';
const safe = DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } });
```
Plus CSP `script-src 'self'`; `object-src 'none'`.

## Risk If Unresolved
Account takeover.

## Related Business Rules
SEC-XSS-04.

---

## SECR-005

## Title
No CSP, HSTS, X-Content-Type-Options, Referrer-Policy or other security headers.

## Category
Security Risk

## Severity
High

## Description
The Vite default serves no security headers. No CSP to limit XSS impact, no HSTS to force HTTPS, no `X-Frame-Options` to prevent clickjacking.

## Current Behavior
Default headers only.

## Expected Behavior
- `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: same-origin`
- `Permissions-Policy: geolocation=(), camera=(), microphone=()`

## Recommended Fix
Set at the reverse proxy (nginx) or the backend framework.

## Risk If Unresolved
Cheap exploits (clickjack, MIME-sniff XSS).

---

## SECR-006

## Title
No CSRF protection planned.

## Category
Security Risk

## Severity
High (once auth is cookie-based)

## Description
If cookies are the auth mechanism, any cross-origin POST will succeed unless CSRF tokens are enforced.

## Recommended Fix
Use `SameSite=Lax` (default protection) + CSRF token on state-changing requests (double-submit cookie pattern).

## Risk If Unresolved
Cross-site request forgery → unwanted payments, edits.

---

## SECR-007

## Title
No rate limiting on any endpoint.

## Category
Security Risk

## Severity
High (once API exists)

## Description
Brute force on login, enumeration on reset-password, scraping on list endpoints all unmitigated.

## Recommended Fix
Per-IP and per-account rate limits (see `qa/security-test-cases.md` §10). Use a sliding-window limiter at the API gateway.

## Risk If Unresolved
Easy account takeover; service degradation.

---

## SECR-008

## Title
No CORS allowlist.

## Category
Security Risk

## Severity
Medium

## Description
No `CORS` policy defined. Vite dev server is permissive. Production must restrict origins.

## Recommended Fix
`Access-Control-Allow-Origin: https://<tenant>.invoicepro.vn` only; allow credentials only if cookies are used.

## Risk If Unresolved
Cross-origin data theft via malicious site.

---

## SECR-009

## Title
Sensitive PII (tax codes, phone, address) returned by APIs without role-based field masking.

## Category
Security Risk

## Severity
Medium

## Description
Even with RBAC, a SALES user listing customers will receive the full PII payload. Should mask MST and address for low-privilege roles.

## Recommended Fix
Backend serialiser respects role: redact `tax_code`, `address` for SALES.

## Risk If Unresolved
Insider data leak.

## Related Business Rules
SEC-DAT-05.

---

## SECR-010

## Title
No idempotency-key pattern on financial writes — risk of double-recorded payments.

## Category
Security Risk / Data Integrity Risk

## Severity
High

## Description
If the user double-clicks "Xác nhận" in PaymentModal, two `addPayment` calls occur. The store is synchronous so two payments are recorded.

## Current Behavior
Double-click → double payment.

## Expected Behavior
Client supplies `Idempotency-Key: <uuid>`; backend dedupes for 24 h.

## Recommended Fix
- Disable submit button on first click (UI).
- Server idempotency key.

## Risk If Unresolved
Customer over-credit; manual reversal needed.

## Related Business Rules
SEC-BIZ-04.

---

## SECR-011

## Title
No audit log of any kind.

## Category
Security Risk

## Severity
High

## Description
"Who created this invoice", "who changed this setting" — unanswerable.

## Recommended Fix
Implement `audit_logs` per `database/database-dictionary.md`. Append-only DB privileges. UI per `gap-analysis/missing-features.md` MISS-015.

## Risk If Unresolved
Cannot pass an audit; cannot investigate incidents.

---

## SECR-012

## Title
Logging of secrets and PII is unrestricted.

## Category
Security Risk

## Severity
Medium

## Description
`console.log` calls exist in production code (`TemplateList.tsx:handleSetDefault`). No PII scrubbing convention.

## Recommended Fix
- Replace `console.log` with a structured logger (pino on Node).
- Scrub fields named `password`, `token`, `secret`, `taxCode`, `phone`, `email` from logs.
- Sentry/observability with PII filter.

## Risk If Unresolved
Accidental disclosure via logs.

---

## SECR-013

## Title
Password policy & breach detection not specified.

## Category
Security Risk

## Severity
Medium (once auth exists)

## Description
Recommended policy is "≥ 8 chars + letter + digit". No breach check (HaveIBeenPwned), no rotation, no MFA.

## Recommended Fix
- Bcrypt cost ≥ 10.
- Check new passwords against HIBP k-anonymity API.
- Optional TOTP MFA for ADMIN.
- Re-use prevention (last 5).

## Risk If Unresolved
Credential-stuffing success.

---

## SECR-014

## Title
No file-upload sanitisation (planned attachments / logos).

## Category
Security Risk

## Severity
Medium

## Description
When attachments / logo uploads are built, lacking MIME/extension/magic-byte verification is a common vector.

## Recommended Fix
- Verify MIME, extension, and magic-bytes match.
- Cap size (10 MB).
- Store in S3 with random filenames; serve via signed URLs.
- Run AV scan (ClamAV) if budget allows.

## Risk If Unresolved
Malware distribution via shared invoices.

---

## SECR-015

## Title
No protection against IDOR (Insecure Direct Object Reference).

## Category
Security Risk

## Severity
High (once API exists)

## Description
Endpoints like `GET /api/invoices/:id` will be vulnerable to IDOR unless backend checks the row's `tenant_id` (and role) against the session.

## Recommended Fix
Every `GET/PUT/DELETE :id` endpoint adds: `WHERE id = :id AND tenant_id = :session_tenant`. Return 404 (not 403) on mismatch.

## Risk If Unresolved
Cross-tenant data access.

## Related Business Rules
SEC-AUTHZ-04, SEC-TEN-*.

---

## SECR-016

## Title
No API input length / depth limits.

## Category
Security Risk

## Severity
Medium

## Description
Request body size unbounded; nested JSON depth unbounded. DoS via giant payloads.

## Recommended Fix
`bodyParser` limit 1 MB; depth 6 in JSON parser.

## Risk If Unresolved
Memory exhaustion.

---

## SECR-017

## Title
No protection against business-logic abuse for negative amounts / over-payments.

## Category
Security Risk

## Severity
High

## Description
See ISSUE-008 and ISSUE-009. A motivated user can manipulate ledger via paste.

## Recommended Fix
Server-side CHECK constraints + DTO validation (class-validator on NestJS / Bean Validation on Spring).

## Risk If Unresolved
Financial fraud.

## Related Business Rules
SEC-BIZ-01..05.

---

## SECR-018

## Title
No dependency-vulnerability scanning in CI.

## Category
Security Risk

## Severity
Medium

## Description
No `npm audit`, Dependabot, Renovate, or Snyk integration.

## Recommended Fix
Enable Dependabot / Renovate; fail CI on `high`/`critical`.

## Risk If Unresolved
Vulnerable transitive deps slip in.

---

## SECR-019

## Title
No secrets management — no `.env`, no vault.

## Category
Security Risk

## Severity
Medium (once secrets exist)

## Description
Today there are no secrets, but DB passwords, mail-provider keys, S3 access keys, signing keys will appear.

## Recommended Fix
Use HashiCorp Vault or cloud-native secret manager; never commit secrets; CI injects via masked variables.

## Risk If Unresolved
Secret leakage via git history.

---

## SECR-020

## Title
Vietnam personal-data protection (PDPL 2023) compliance not addressed.

## Category
Security Risk

## Severity
Medium

## Description
PDPL requires explicit consent, breach notification within 72 h, data-subject access rights, lawful basis documentation.

## Recommended Fix
- Add a privacy policy + consent capture for customer data.
- Implement data-subject export and erasure endpoints (with the 10-year retention exception for tax invoices — see SEC-PRIV-03).
- Breach-response runbook.

## Risk If Unresolved
Regulatory fines, customer trust loss.

---

## SECR-021

## Title
No backup or disaster-recovery plan.

## Category
Security Risk / Data Integrity Risk

## Severity
High (once DB exists)

## Description
A data loss event would be unrecoverable.

## Recommended Fix
- PITR (Point-In-Time Recovery) on Postgres.
- Daily logical backups (pg_dump) to S3, retained 30 days.
- Quarterly restore drills.
- 10-year retention of invoice exports.

## Risk If Unresolved
Catastrophic loss.

---

## SECR-022

## Title
No security testing in the pipeline.

## Category
Security Risk

## Severity
Medium

## Description
No SAST/DAST, no penetration test cadence.

## Recommended Fix
- SAST in CI (Semgrep, CodeQL).
- DAST scheduled (OWASP ZAP).
- Annual pen-test by external firm.

## Risk If Unresolved
Vulnerabilities discovered by attackers first.

---

## Summary by severity

| Severity | Count | IDs |
|---|---|---|
| Critical | 3 | SECR-001, SECR-002, SECR-003 |
| High | 8 | SECR-004, SECR-005, SECR-006, SECR-007, SECR-010, SECR-011, SECR-015, SECR-017, SECR-021 |
| Medium | 10 | SECR-008, SECR-009, SECR-012, SECR-013, SECR-014, SECR-016, SECR-018, SECR-019, SECR-020, SECR-022 |

> Note: Multiple "High" entries combined exceed 8 due to SECR-021 also being High. Recount: SECR-004 through SECR-021 — 9 High items; rest Medium.

---

## Hardening priority matrix

| Priority | Goal | Items |
|---|---|---|
| P0 — pre-launch | Block trivial attacks | SECR-001, SECR-002, SECR-003, SECR-004, SECR-007, SECR-015, SECR-017 |
| P1 — early ops | Establish defence in depth | SECR-005, SECR-006, SECR-010, SECR-011, SECR-021 |
| P2 — maturity | Compliance & resilience | SECR-008, SECR-009, SECR-012, SECR-013, SECR-018, SECR-020, SECR-022 |
| P3 — polish | Operational excellence | SECR-014, SECR-016, SECR-019 |
