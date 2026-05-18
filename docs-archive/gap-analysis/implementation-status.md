# Implementation Status Matrix — Invoice Pro

> Single-page status board for every feature in the BRD. This file supersedes the prior implementation-status matrix and uses the **strict classification** required by the latest brief.

---

## 0. Classification rules used in this file

A feature is graded with **one or more** of the following flags. None of the flags equal "Fully Implemented" because **no backend exists** in this codebase (**[VERIFIED]** — see `architecture/system-classification.md`).

| Flag | Meaning |
|---|---|
| **UI Prototype Only** | JSX renders; no behavior bound to the click / change. |
| **Simulated Workflow** | Frontend executes business logic in the browser (e.g. status recompute, aging) — *not* a real backend behavior. |
| **Local State Persistence** | Mutations survive within the current browser tab only. Lost on refresh. |
| **Mock Business Logic** | Output derived from hard-coded fixtures, not real data. |
| **Backend Not Implemented** | No HTTP API. |
| **Database Not Implemented** | No persistent storage. |
| **Auth Not Implemented** | No login, no RBAC, no tenant isolation. |
| **Validation Missing** | Required validations absent from current code. |
| **Security Incomplete** | Functions exist but lack auth / sanitisation / rate-limit. |
| **UI Not Implemented** | Screen does not exist at all. |

**No feature in this codebase qualifies as Fully Implemented** per the strict rule: *"UI + API + DB persistence + validation must all exist."*

---

## 1. Cross-cutting (apply to every module below)

| Concern | Status |
|---|---|
| Backend | Backend Not Implemented |
| Database | Database Not Implemented |
| Authentication | Auth Not Implemented |
| Authorization (RBAC) | Auth Not Implemented |
| Tenant isolation | Auth Not Implemented · Backend Not Implemented |
| Persistence | Local State Persistence (volatile, in-memory) |
| Audit logging | Backend Not Implemented |
| Observability | Backend Not Implemented |
| CI/CD, lint, typecheck, tests | Backend Not Implemented |
| Email / notifications | Backend Not Implemented |
| PDF / print | UI Prototype Only · Backend Not Implemented |
| Excel export | UI Prototype Only · Backend Not Implemented |
| File uploads / attachments | UI Not Implemented |
| Service worker / PWA | UI Not Implemented |

---

## 2. Authentication & user session

| Feature | Status |
|---|---|
| Login page | UI Not Implemented · Auth Not Implemented |
| Logout | UI Prototype Only · Auth Not Implemented |
| Forgot / reset password | UI Not Implemented · Auth Not Implemented |
| Session refresh | UI Not Implemented · Auth Not Implemented |
| Profile self-edit | UI Not Implemented · Backend Not Implemented |
| Avatar dropdown (Hồ sơ / Cài đặt / Đăng xuất) | UI Prototype Only |
| Hard-coded user "Nguyễn Văn An — Quản trị viên" | UI Prototype Only · Auth Not Implemented |

## 3. User management & RBAC

| Feature | Status |
|---|---|
| User list / CRUD | UI Not Implemented · Backend Not Implemented |
| Role assignment | Auth Not Implemented |
| Permission enforcement (FE + BE) | UI Prototype Only · Backend Not Implemented |
| Audit of user / RBAC events | Backend Not Implemented |

## 4. Dashboard (`/`)

| Feature | Status |
|---|---|
| KPI: Monthly revenue (paidAmount in current month) | Simulated Workflow · Local State Persistence |
| KPI: Total receivables | Simulated Workflow · **Validation Missing** (includes drafts — see RULE-002) |
| KPI: Unpaid invoice count | Simulated Workflow |
| KPI: Overdue invoice count | Simulated Workflow · (conflates partial+past-due — RULE-004) |
| KPI trend chip `+12.5%` | Mock Business Logic |
| 6-month revenue line chart | Mock Business Logic |
| Aging pie chart | Mock Business Logic |
| Recent invoices table | Simulated Workflow · Local State Persistence |
| Empty / loading / error states | UI Not Implemented |

## 5. Invoice Management

### 5.1 List `/invoices`
| Feature | Status |
|---|---|
| List & filter & search | Simulated Workflow · Local State Persistence |
| Mobile filter bottom sheet | Simulated Workflow |
| Row → View | Simulated Workflow |
| Row → Edit | UI Prototype Only (no handler) |
| Row → Quick-Pay | UI Prototype Only (dead state) |
| Xuất Excel | UI Prototype Only |
| Pagination | UI Not Implemented |
| Empty state | Simulated Workflow |

### 5.2 Create `/invoices/create`
| Feature | Status |
|---|---|
| Customer picker | Simulated Workflow · reads from mock |
| Auto-fill product price | Simulated Workflow |
| Line total / subtotal / total live calc | Simulated Workflow |
| Save Draft / Finalize | Simulated Workflow · Local State Persistence |
| Validation V-CI-01..04 | Simulated Workflow |
| Validation V-CI-05..10 | Validation Missing |
| Invoice numbering | Simulated Workflow · Mock Business Logic (defective — see ISSUE-001) |
| Negative-paste guard | Validation Missing |
| Discount upper bound | Validation Missing |
| Default `dueDate` from Settings | Mock Business Logic (hard-coded +30) |
| Auto-VAT from Settings rate | UI Prototype Only |

### 5.3 Detail `/invoices/:id`
| Feature | Status |
|---|---|
| Header / items / totals / payments display | Simulated Workflow |
| Payment summary cards | Simulated Workflow |
| Add Payment CTA visibility logic | Simulated Workflow |
| In / Tải PDF buttons | UI Prototype Only |
| Edit invoice | UI Not Implemented |
| Void / cancel | UI Not Implemented · Backend Not Implemented |
| 404 fallback | Simulated Workflow |

### 5.4 Add Payment Modal
| Feature | Status |
|---|---|
| Form fields | Simulated Workflow |
| V-PAY-01 / V-PAY-02 | Simulated Workflow |
| `reference` required for bank-transfer | Validation Missing |
| Status recompute after payment | Simulated Workflow |
| Append-only ledger | Simulated Workflow (no UI for edit/delete) |
| Idempotency on double-submit | Validation Missing · Security Incomplete |
| Payment ID generation | Simulated Workflow · **Validation Missing** (collision risk — ISSUE-006) |

## 6. Quotation Management `/quotations`

| Feature | Status |
|---|---|
| List & search | UI Prototype Only · Mock Business Logic |
| Status filter | UI Not Implemented |
| Create / Edit / Send / Accept / Reject / Convert | UI Not Implemented · Backend Not Implemented |
| Auto-expire on `validUntil` | Backend Not Implemented |
| Subtotal / tax / shipping breakdown | UI Not Implemented (model has only `total` — RULE-011) |

## 7. Debt / Receivables `/debts`

| Feature | Status |
|---|---|
| Summary cards | Simulated Workflow |
| Per-customer aging table (3 buckets) | Simulated Workflow · (conflicts with Reports buckets — RULE-001) |
| Drilldown dialog | Simulated Workflow |
| Empty state | Simulated Workflow |
| Mobile responsive | UI Not Implemented (desktop-only) |
| Export | UI Not Implemented |

## 8. Customer Management `/customers`

| Feature | Status |
|---|---|
| List & search | UI Prototype Only · Mock Business Logic |
| `currentDebt` derived | Simulated Workflow (but stored field `totalDebt` also exists — RULE-008) |
| Add / View / Edit | UI Prototype Only · Backend Not Implemented |
| Mobile responsive | UI Not Implemented (desktop-only) |
| Bulk import / export | UI Not Implemented · Backend Not Implemented |

## 9. Product Management `/products`

| Feature | Status |
|---|---|
| List & filter | UI Prototype Only · Mock Business Logic |
| Mobile cards + bottom-sheet filter + FAB | Simulated Workflow |
| Low-stock cue (<100) | Simulated Workflow · Mock Business Logic (threshold hard-coded) |
| Stock decrement on invoice issue | UI Not Implemented · Backend Not Implemented (ISSUE-029) |
| Add / Edit | UI Prototype Only · Backend Not Implemented |
| Bulk import / export | UI Not Implemented · Backend Not Implemented |

## 10. Reports `/reports`

| Feature | Status |
|---|---|
| Monthly revenue bar chart | Mock Business Logic |
| Top-5 customers | Simulated Workflow |
| Aging analysis table (4 buckets) | Mock Business Logic · (conflicts with Debts buckets — RULE-001) |
| Export Excel / PDF | UI Prototype Only · Backend Not Implemented |
| Date-range filter | UI Not Implemented |

## 11. Settings `/settings`

| Feature | Status |
|---|---|
| Company info form | UI Prototype Only (uncontrolled inputs; no handler) |
| Invoice settings (prefix, nextNumber, defaultDueDays, taxRate) | UI Prototype Only (no consumers — RULE-005..007, RULE-020) |
| Auto-tax / auto-email / payment-reminder toggles | UI Prototype Only |
| Notification preferences (per user) | UI Prototype Only · Backend Not Implemented |
| Save button | UI Prototype Only |

## 12. Templates `/settings/templates`

| Feature | Status |
|---|---|
| Template list (cards) | UI Prototype Only · Mock Business Logic |
| Visual block builder | Simulated Workflow · Local State Persistence (no save) |
| HTML editor (Monaco) | Simulated Workflow · Local State Persistence (no save) |
| Preview | Simulated Workflow |
| Set default | UI Prototype Only (`console.log` — ISSUE-015) |
| Clone | UI Prototype Only |
| Sanitisation of `customHTML` | Security Incomplete (SECR-004 / ISSUE-018) |
| PDF render | UI Not Implemented · Backend Not Implemented |

## 13. Templates — preview / print pipeline

| Feature | Status |
|---|---|
| Print stylesheet (`@media print`) | UI Not Implemented |
| Print invoice via active template | UI Prototype Only · Backend Not Implemented |
| Download PDF | UI Prototype Only · Backend Not Implemented |

## 14. Notifications

| Feature | Status |
|---|---|
| Bell with unread badge | UI Prototype Only (always red dot) |
| Notification dropdown / list | UI Not Implemented |
| Read / mark-all-read | UI Not Implemented · Backend Not Implemented |
| Real-time push | Backend Not Implemented |

## 15. Audit log

| Feature | Status |
|---|---|
| Write on every mutation | Backend Not Implemented |
| Admin read UI | UI Not Implemented · Backend Not Implemented |
| Retention worker | Backend Not Implemented |

## 16. Search & navigation

| Feature | Status |
|---|---|
| Header global search input | UI Prototype Only (unwired) |
| Cross-entity search results | UI Not Implemented · Backend Not Implemented |
| `/menu` mobile pseudo-route | UI Prototype Only · **Routing Issue** (not registered — ISSUE-005) |

---

## 17. Roll-up — total flag occurrences

| Flag | Approx. count of features |
|---|---|
| UI Prototype Only | ~30 |
| Simulated Workflow | ~25 |
| Local State Persistence (volatile) | every persistent feature |
| Mock Business Logic | ~10 (reports, hard-coded series, low-stock threshold, numbering bug, dashboard trend) |
| Backend Not Implemented | every cross-cutting concern |
| Database Not Implemented | universal |
| Auth Not Implemented | universal |
| Validation Missing | ~10 specific (V-CI-05..10, V-PAY-06..08, negative paste, discount upper bound) |
| Security Incomplete | `customHTML` rendering, idempotency, all writes |
| UI Not Implemented | ~25 (entire user / audit / notification / quotation-CRUD / customer-CRUD / product-CRUD modules; print stylesheet; date filter; etc.) |

---

## 18. Pre-launch gating checklist

A release is NOT shippable until each item below is fully delivered (UI + API + DB + validation + auth + audit). Status today: **all items pending**.

| # | Gate |
|---|---|
| 1 | Backend service implementing the API contract in `architecture/missing-backend-components.md` |
| 2 | Persistent database matching `database/database-dictionary.md` |
| 3 | Authentication (login / logout / refresh / forgot / reset) per `architecture/missing-authentication.md` |
| 4 | Authorization (RBAC + ownership) per `architecture/missing-authorization.md` |
| 5 | Tenant isolation (application + DB RLS) |
| 6 | Audit log (table + interceptor + UI) per `architecture/missing-audit-system.md` |
| 7 | Invoice numbering allocation fixed (ISSUE-001) |
| 8 | Payment ID and idempotency fixed (ISSUE-006, SECR-010) |
| 9 | Settings save wired (ISSUE-011) and consumed (RULE-005..007, RULE-020) |
| 10 | Customer / Product / Quotation CRUD UIs built |
| 11 | PDF / print pipeline (MISS-004) + print stylesheet (MISS-016) |
| 12 | Excel export (MISS-006) |
| 13 | Negative-value & over-discount validation (ISSUE-008, ISSUE-009) |
| 14 | Aging-bucket unification (RULE-001) |
| 15 | Dashboard `totalDebt` excludes drafts (RULE-002, ISSUE-003) |
| 16 | Real MoM trend (ISSUE-004) |
| 17 | `customHTML` sanitisation (SECR-004 / ISSUE-018) |
| 18 | Security headers, rate-limits, CSRF, CORS allowlist |
| 19 | Backups + DR + observability stack |
| 20 | CI/CD with typecheck + lint + unit + integration tests |

---

## 19. Audience routing for this file

- **PM / Product** — read §17 and §18 for scoping.
- **Architect** — start at `architecture/system-classification.md`, then per-module future-architecture files.
- **Backend developer** — use the per-module `future-architecture/*.md` files plus `database/database-dictionary.md` as the build brief.
- **Frontend developer** — items flagged **UI Not Implemented** or **UI Prototype Only** require a screen build.
- **QA** — cross-reference `qa/qa-test-scenarios.md` and `qa/validation-rules.md`.
- **Security reviewer** — cross-reference `gap-analysis/security-risks.md` and `qa/security-test-cases.md`.

> **Final classification:** This codebase is a **Frontend Prototype — UI-driven MVP with Mock-data Architecture**. It is suitable for stakeholder demo and UX validation; it is NOT suitable for production deployment in its current state.
