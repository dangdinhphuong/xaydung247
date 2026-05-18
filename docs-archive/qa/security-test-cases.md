# Security Test Cases — Invoice Pro

> Security expectations and explicit test cases. Use together with the OWASP Top 10 (2021) and ASVS L2 as the baseline.
> Test IDs follow `SEC-<CATEGORY>-<SEQ>`.

---

## 0. Threat surface summary

| Surface | Notes |
|---|---|
| Auth endpoints (recommended) | `/api/auth/*` — must rate-limit & log. |
| Read APIs | All `GET` endpoints — tenant isolation. |
| Write APIs | Invoice / payment / template / settings — RBAC + validation + audit. |
| Template rendering | `customHTML` field accepts raw HTML — stored-XSS risk if rendered to other users (e.g. printing on a shared kiosk). |
| File uploads (future) | Logo upload, invoice attachments — MIME validation, size cap, malware scan. |
| Notification channels (future) | Email injection, header smuggling. |

---

## 1. Authentication

| ID | Category | Scenario | Expected |
|---|---|---|---|
| SEC-AUTH-01 | Brute force | 5 failed logins same email/IP/15 min | Account locked 30 min (BR-AUTH-02) |
| SEC-AUTH-02 | Brute force | 100 failed logins distributed across emails from same IP | IP rate-limited |
| SEC-AUTH-03 | Enumeration | Request `/forgot-password` for unknown email | Always 204 (do not reveal existence) |
| SEC-AUTH-04 | Token | Use a reset token after 30 min | 400 invalid |
| SEC-AUTH-05 | Token | Use a reset token twice | Second attempt 400 |
| SEC-AUTH-06 | Cookie | Inspect login cookie | `Secure`, `HttpOnly`, `SameSite=Lax` |
| SEC-AUTH-07 | TLS | `http://` request | 301 → `https://` (or HSTS) |
| SEC-AUTH-08 | Password | Set "12345678" | Reject (must contain letter + digit) |
| SEC-AUTH-09 | Logout | After logout, replay old cookie/JWT | 401 |
| SEC-AUTH-10 | Session fixation | Login then check session id | Rotates on login |

---

## 2. Authorization (RBAC)

| ID | Scenario | Expected |
|---|---|---|
| SEC-AUTHZ-01 | SALES user calls `POST /api/payments` | 403 |
| SEC-AUTHZ-02 | VIEWER calls `POST /api/invoices` | 403 |
| SEC-AUTHZ-03 | ACCOUNTANT calls `PUT /api/settings/company` | 403 |
| SEC-AUTHZ-04 | SALES requests `GET /api/invoices/:id` for invoice they did not create | 404 (do NOT leak existence) |
| SEC-AUTHZ-05 | ADMIN of tenant A requests resource of tenant B | 404 |
| SEC-AUTHZ-06 | Direct page nav to `/settings` as SALES | client guard hides; server rejects writes |
| SEC-AUTHZ-07 | Force-grant: client sends `Role: ADMIN` header | ignored; role comes from session |
| SEC-AUTHZ-08 | Deactivate the only ADMIN | 400 — V-USR-03 |

---

## 3. Tenant isolation

| ID | Scenario | Expected |
|---|---|---|
| SEC-TEN-01 | API request with `tenantId` in body different from session | body field ignored; session value wins |
| SEC-TEN-02 | Database query without `tenant_id = :current` predicate | Row-Level-Security policy blocks |
| SEC-TEN-03 | Audit-log search across tenants | Forbidden |
| SEC-TEN-04 | Export Excel: file contains only own-tenant rows | verify |
| SEC-TEN-05 | Cache key for `/api/dashboard/summary` | scoped by tenant + role |

---

## 4. Input validation & injection

| ID | Scenario | Expected |
|---|---|---|
| SEC-INJ-01 | SQL injection via `customerName` (`'; DROP TABLE customers;--`) | parameterised queries; record persists literally |
| SEC-INJ-02 | NoSQL injection via search field | parameterised |
| SEC-INJ-03 | Command injection via filename (export, PDF) | sanitised; no shell interpolation |
| SEC-INJ-04 | LDAP injection (n/a unless integrated) | — |
| SEC-INJ-05 | Path traversal in template asset URLs (`../etc/passwd`) | rejected |
| SEC-INJ-06 | XXE in any XML import (n/a current; flag if added) | disabled |
| SEC-INJ-07 | Number overflow (`amount = 1e308`) | server caps at 10^12 (V-PAY-07) |

---

## 5. XSS (Cross-Site Scripting)

| ID | Scenario | Expected |
|---|---|---|
| SEC-XSS-01 | Reflected XSS in search box (`/invoices?search=<script>alert(1)</script>`) | React auto-escapes; verify no `dangerouslySetInnerHTML` |
| SEC-XSS-02 | Stored XSS in `Customer.name` rendered in invoice list | escaped |
| SEC-XSS-03 | Stored XSS in `Invoice.notes` rendered in detail page | escaped |
| SEC-XSS-04 | Stored XSS in `Template.customHTML` rendered in invoice preview | **HIGH RISK** — `customHTML` is intentionally rendered raw. Mitigation: sanitise with DOMPurify; restrict editor to ADMIN; surface a warning before rendering an untrusted template. |
| SEC-XSS-05 | CSP header | `default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'` |
| SEC-XSS-06 | Inline event handlers in `customHTML` | stripped by sanitiser |

---

## 6. CSRF

| ID | Scenario | Expected |
|---|---|---|
| SEC-CSRF-01 | If using cookie auth, write call lacks CSRF token | 403 |
| SEC-CSRF-02 | Cross-origin POST from attacker page | blocked by `SameSite=Lax` + CSRF token |
| SEC-CSRF-03 | If using `Authorization: Bearer`, CORS allowlist only own domain | preflight rejects others |

---

## 7. Sensitive-data exposure

| ID | Scenario | Expected |
|---|---|---|
| SEC-DAT-01 | Inspect API response on `/api/users/me` | no `password_hash` |
| SEC-DAT-02 | Inspect server logs | no passwords, tokens, PII beyond minimum |
| SEC-DAT-03 | At-rest DB encryption | TDE / disk-level enabled |
| SEC-DAT-04 | TLS version | ≥ TLS 1.2; ideally 1.3 |
| SEC-DAT-05 | Customer tax codes visible to wrong roles | enforce field-level masking per role if business requires |

---

## 8. Business-logic abuse

| ID | Scenario | Expected |
|---|---|---|
| SEC-BIZ-01 | POST `/api/payments` `{amount: -100}` | reject (V-PAY-01) |
| SEC-BIZ-02 | POST `/api/payments` `{amount: 1, invoiceId: <draft>}` | reject (V-PAY-04) |
| SEC-BIZ-03 | POST `/api/payments` with `amount` > remaining | reject (V-PAY-02) |
| SEC-BIZ-04 | Double-submit same payment within 100 ms (race) | idempotency key prevents double-write |
| SEC-BIZ-05 | Create invoice with item `discount` > `quantity × price` | reject (V-CI-08) |
| SEC-BIZ-06 | Convert quotation that's already converted | return existing invoice (idempotent); do not create second |
| SEC-BIZ-07 | Set `nextInvoiceNumber` lower than current max | reject (V-SET-03) |
| SEC-BIZ-08 | Concurrent finalize with same allocated number | DB unique constraint surfaces 409 |
| SEC-BIZ-09 | Re-use a refunded payment record (future) | impossible — payments append-only |

---

## 9. Audit log integrity

| ID | Scenario | Expected |
|---|---|---|
| SEC-AUD-01 | Try to UPDATE / DELETE an `audit_logs` row | denied at DB level (revoke privileges) |
| SEC-AUD-02 | Verify every write API produces an audit row | covered by integration tests |
| SEC-AUD-03 | Search audit by `actor_user_id` | available to ADMIN of same tenant only |
| SEC-AUD-04 | Audit row for failed login | exists |

---

## 10. Rate limiting

| Endpoint | Limit (per IP) | Limit (per user) |
|---|---|---|
| `POST /api/auth/login` | 10 / min | 5 / 15 min per email (BR-AUTH-02) |
| `POST /api/auth/forgot-password` | 5 / min | 3 / hour per email |
| `POST /api/payments` | 60 / min | 30 / min per user |
| `POST /api/invoices` | 30 / min | 30 / min per user |
| `GET /api/reports/export` | 5 / min | — |
| Generic GET | 600 / min | — |

---

## 11. Dependency & supply-chain

| ID | Scenario | Expected |
|---|---|---|
| SEC-DEP-01 | `npm audit` | 0 high/critical |
| SEC-DEP-02 | Lock file integrity | pnpm-lock.yaml committed; CI fails on tampering |
| SEC-DEP-03 | SBOM | generated per release |
| SEC-DEP-04 | Vulnerability scanning | weekly Dependabot / Renovate |

---

## 12. Privacy & regulatory

| ID | Scenario | Expected |
|---|---|---|
| SEC-PRIV-01 | Customer requests their data | export endpoint produces JSON of all rows where they appear |
| SEC-PRIV-02 | Customer requests deletion | soft-delete + anonymise (replace name/phone/email/address with hashed placeholder) on records older than retention |
| SEC-PRIV-03 | Vietnam tax record retention | 10 years for invoices — do NOT hard-delete invoice rows |
| SEC-PRIV-04 | Logging of PII | log IDs, not contact data |

---

## 13. Current build — known issues

| Ref | Issue |
|---|---|
| S-NOW-01 | No authentication at all — any visitor sees all data. |
| S-NOW-02 | `Template.customHTML` rendered raw → potential stored-XSS once auth + multi-user exist. |
| S-NOW-03 | Payment ID `'PAY'+Date.now()` collision risk under load. |
| S-NOW-04 | No CSP, HSTS, or other security headers configured. |
| S-NOW-05 | `console.log` of server-side-equivalent actions in template handlers (development residue). |
| S-NOW-06 | No CORS / API origin allowlist. |

These MUST be remediated before exposing the system on the public Internet.
