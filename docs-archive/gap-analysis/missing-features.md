# Missing Features — Invoice Pro

> Formal register of features that the BRD requires but the current build does not provide. Each entry follows the standard Issue Document Format and is classified into one of the standard categories.

---

## MISS-001

## Title
Authentication & session management (login, logout, password reset).

## Category
Missing Implementation

## Severity
**Critical**

## Description
No `/login`, `/forgot-password`, `/reset-password` routes; no auth API; no session/cookie handling.

## Current Behavior
Any visitor is treated as a hard-coded admin.

## Expected Behavior
See `modules/authentication.md`.

## Business Impact
Cannot deploy publicly; full data exposure.

## Technical Impact
Adds 3 routes, auth API, cookie/JWT handling, axios interceptor / fetch wrapper, guarded router.

## Root Cause Analysis
Out of scope for the original Figma prototype.

## Affected Modules
All — every API call must carry credentials.

## Reproduction Flow
N/A — feature absent.

## Recommended Fix
Build per `modules/authentication.md`. Block release until done.

## Risk If Unresolved
**Critical security and compliance risk.**

## Related Business Rules
BO-12, BR-AUTH-01..06.

---

## MISS-002

## Title
User management & RBAC enforcement.

## Category
Missing Implementation

## Severity
**Critical**

## Description
No `/users` screen, no role concept, no per-route guards. The avatar dropdown shows static text.

## Current Behavior
N/A.

## Expected Behavior
Per `modules/users.md` and `roles/roles-and-permissions.md`.

## Business Impact
Cannot delegate work safely; cannot satisfy SoD (segregation of duties) for accounting.

## Technical Impact
Adds CRUD pages, RBAC middleware on backend, UI guards on every action.

## Root Cause Analysis
Out of scope.

## Affected Modules
All.

## Recommended Fix
Implement after MISS-001.

## Risk If Unresolved
No tenant safety once multiple users exist.

## Related Business Rules
BO-12, BR-USR-01..06.

---

## MISS-003

## Title
Tenant isolation (multi-tenant SaaS readiness).

## Category
Architecture Limitation

## Severity
**Critical** (if multi-tenant) / N/A (if single-tenant on-prem)

## Description
The data model contains no `tenant_id` and no Row-Level Security policies. Deploying as SaaS would expose all customer data globally.

## Current Behavior
Single shared dataset.

## Expected Behavior
Per `database/entity-relationships.md` §5.

## Business Impact
Cannot run SaaS.

## Technical Impact
Schema migration to add `tenant_id` everywhere; RLS in Postgres; middleware to inject tenant.

## Recommended Fix
Add `tenant_id UUID NOT NULL` + composite indexes + RLS, before first paying customer.

## Risk If Unresolved
Catastrophic data leak in SaaS deployment.

## Related Business Rules
BO-12, SEC-TEN-*.

---

## MISS-004

## Title
PDF generation & printable invoice pipeline.

## Category
Functional Gap

## Severity
**Critical**

## Description
"In" and "Tải PDF" buttons exist (`InvoiceDetail.tsx`) but have no handlers. There is no server-side PDF renderer and no print-only CSS.

## Current Behavior
Buttons are decorative.

## Expected Behavior
- `window.print()` opens a properly styled page (print stylesheet honours active `TemplateSchema`).
- `POST /api/invoices/:id/pdf` returns a `application/pdf` stream rendered from the active template (Puppeteer or similar).
- Generated PDF is also stored (`S3/MinIO`) for future re-download and audit.

## Business Impact
Customers cannot be given an invoice — blocks daily business.

## Technical Impact
PDF pipeline (Puppeteer/Chromium headless), file storage, signed-URL download, print CSS.

## Recommended Fix
Build before launch.

## Risk If Unresolved
Product unusable.

## Related Business Rules
BO-14, BR-TPL-02.

---

## MISS-005

## Title
Email delivery (auto-send invoice, payment reminders).

## Category
Missing Implementation

## Severity
High

## Description
Settings toggles `Gửi email tự động` and `Nhắc nhở thanh toán` exist; no mail service, no templates, no scheduler.

## Current Behavior
No email is ever sent.

## Expected Behavior
- On invoice finalize, if `auto_email`, queue an email with PDF attached to `customer.email`.
- N days before `due_date`, send reminder if `payment_reminder` is true.
- On `overdue` flip, send escalation email.
- Configurable templates per tenant.

## Business Impact
Cannot communicate with customers automatically.

## Technical Impact
SMTP provider, job queue (BullMQ/SQS), template engine.

## Recommended Fix
Implement post-MVP.

## Risk If Unresolved
Manual chasing only.

## Related Business Rules
BR-SET-03, BR-SET-06.

---

## MISS-006

## Title
Excel / CSV export for lists and reports.

## Category
Missing Implementation

## Severity
High

## Description
Multiple "Xuất Excel" / "Xuất PDF" buttons (Reports, InvoiceList) render with no handler.

## Current Behavior
Buttons inert.

## Expected Behavior
- Backend endpoints generating XLSX (e.g. via `exceljs`) and PDF reports.
- Filename includes tenant + date range.
- Audit-log the export event (`report.export`).

## Business Impact
Accountants cannot extract data to upload to bookkeeping software.

## Recommended Fix
Build standard export endpoints.

## Risk If Unresolved
Workaround = re-keying.

## Related Business Rules
BO-15.

---

## MISS-007

## Title
Soft-delete / void / cancel invoice.

## Category
Functional Gap

## Severity
High

## Description
The lifecycle has no `void` / `cancelled` state. Once issued, an invoice cannot legally be removed but must be reversible for typos or mis-issuance.

## Current Behavior
No way to cancel.

## Expected Behavior
- ADMIN-only "Huỷ hóa đơn" action.
- Status transitions to `void`; remaining balance set to 0; payments preserved with note "Hoàn lại do huỷ hóa đơn".
- Number is NOT reused.
- Audit-log entry mandatory.

## Business Impact
Cannot correct mistakes; financial inaccuracy.

## Technical Impact
Status enum extension + lifecycle UI + reverse-payment logic.

## Recommended Fix
Add as a separate "Huỷ hoá đơn" CTA on InvoiceDetail; gate by role.

## Risk If Unresolved
Workaround: create credit-note in notes; tax-non-compliant.

## Related Business Rules
WF-INV-R-01.

---

## MISS-008

## Title
Approval workflow for invoices (submit → approve / reject).

## Category
Functional Gap

## Severity
Medium

## Description
Larger shops want a 2-eyes rule before an invoice becomes a receivable.

## Current Behavior
Creation transitions directly draft → unpaid.

## Expected Behavior
Per `workflows/approval-workflow.md` §3.

## Business Impact
SoD compliance.

## Recommended Fix
Add `pending_approval` state behind tenant setting `require_invoice_approval`.

## Risk If Unresolved
Cannot satisfy customers needing 2-eyes.

## Related Business Rules
Approval Workflow §3.

---

## MISS-009

## Title
Quotation create / edit / send / convert UI.

## Category
Missing Implementation

## Severity
High

## Description
Only quotation list is built. No create/edit page, no "send", no conversion to invoice.

## Current Behavior
List + filter only.

## Expected Behavior
Per `modules/quotations.md`.

## Business Impact
Pre-sales workflow non-functional.

## Recommended Fix
Implement four CRUD endpoints + UI pages.

## Risk If Unresolved
Module is decorative.

## Related Business Rules
Quotation lifecycle in `workflows/quotation-workflow.md`.

---

## MISS-010

## Title
Customer create / edit / view UI.

## Category
Missing Implementation

## Severity
High

## Description
List only.

## Current Behavior
Buttons rendered, no handler.

## Expected Behavior
Per `modules/customers.md`.

## Recommended Fix
Build modal-based create + edit + detail.

## Risk If Unresolved
Cannot onboard new customers.

## Related Business Rules
BR-CUST-*.

---

## MISS-011

## Title
Product create / edit UI.

## Category
Missing Implementation

## Severity
High

## Description
List only.

## Expected Behavior
Per `modules/products.md`.

## Recommended Fix
CRUD pages.

## Risk If Unresolved
Cannot onboard new products.

## Related Business Rules
BR-PROD-*.

---

## MISS-012

## Title
Notification center (in-app).

## Category
Missing Implementation

## Severity
Medium

## Description
Bell icon is decorative; no list of notifications, no read/unread state.

## Current Behavior
Always red dot.

## Expected Behavior
- Dropdown listing recent events: invoice created, payment recorded, overdue, quotation accepted.
- Mark as read / mark all read.
- Per-user filtering by event type.
- Backed by `/api/notifications`.

## Business Impact
Users miss key events.

## Recommended Fix
Build notifications table + WS subscription + UI dropdown.

## Risk If Unresolved
Constant red-dot fatigue.

## Related Business Rules
Settings notification toggles (BR-SET-06).

---

## MISS-013

## Title
Global search.

## Category
Missing Implementation

## Severity
Medium

## Description
Header search box ("Tìm kiếm hóa đơn, khách hàng...") is wired to nothing.

## Current Behavior
Typing has no effect.

## Expected Behavior
Cross-entity search with grouped results (invoices, customers, products, quotations), keyboard navigation, ⌘K shortcut.

## Recommended Fix
Implement `/api/search?q=` with Postgres full-text or Meilisearch; cmdk-based popover.

## Risk If Unresolved
Power-user productivity gap.

## Related Business Rules
None directly.

---

## MISS-014

## Title
File attachments on invoices (delivery note, signed PO, photos).

## Category
Missing Implementation

## Severity
Medium

## Description
No upload widget. Construction VLXD often needs to attach signed delivery slips.

## Expected Behavior
- Up to N files per invoice (image / PDF).
- Stored in S3/MinIO with signed URLs.
- MIME allowlist; size cap 10 MB per file.

## Recommended Fix
Implement after auth & PDF pipeline.

## Risk If Unresolved
Customers rely on external storage.

## Related Business Rules
None directly.

---

## MISS-015

## Title
Audit log UI for ADMIN.

## Category
Missing Implementation

## Severity
Medium

## Description
Audit-log table is recommended (`database-dictionary.md`) but no UI exists.

## Expected Behavior
- `/audit` screen with filters: actor, action, resource, date range.
- Cannot edit; export to CSV.

## Recommended Fix
Build after auth.

## Risk If Unresolved
Cannot answer "who changed what" questions.

## Related Business Rules
Audit log section of each module.

---

## MISS-016

## Title
Print stylesheet & template-driven preview.

## Category
Missing Implementation

## Severity
High

## Description
`@media print` rules are absent; the on-screen layout will be printed as-is including sidebar/header.

## Expected Behavior
- Hide `header`, `sidebar`, `mobile-nav` on print.
- Render the active template body only.
- Use template's `paperSize` and `margins` for `@page` rules.

## Recommended Fix
Add `print.css`; render-invoice route `/print/invoices/:id` returning a clean template-only page.

## Risk If Unresolved
"Print" prints the wrong thing.

## Related Business Rules
BR-TPL-02.

---

## MISS-017

## Title
Configurable invoice numbering & defaults read from Settings.

## Category
Missing Implementation

## Severity
High

## Description
See ISSUE-001 / ISSUE-010 / ISSUE-011. Settings page exists, save doesn't.

## Expected Behavior
- `invoicePrefix`, `nextNumber`, `defaultDueDays`, `taxRate` actually used by Create-Invoice.

## Recommended Fix
Wire settings save + read.

## Risk If Unresolved
Tenant cannot align with their numbering policy.

## Related Business Rules
BR-SET-01..05.

---

## MISS-018

## Title
Coupon / promotion engine.

## Category
Missing Implementation

## Severity
Low (current model uses absolute-VND discounts)

## Description
See `workflows/coupon-workflow.md` §2.

## Expected Behavior
Coupon definitions, eligibility, redemptions ledger.

## Recommended Fix
Build only if/when promotional codes become a business requirement.

## Risk If Unresolved
Manual concessions only.

## Related Business Rules
BR-DISC-01.

---

## MISS-019

## Title
Loyalty / customer-tier engine.

## Category
Missing Implementation

## Severity
Low

## Description
No tiers, points, or rewards. Not currently in BRD scope.

## Recommended Fix
Defer.

## Risk If Unresolved
None — out of scope.

---

## MISS-020

## Title
Multi-currency support.

## Category
Architecture Limitation

## Severity
Low

## Description
All amounts are VND; the schema and UI assume single currency.

## Expected Behavior
- `currency` per invoice, FX rate at issue, totals in tenant base currency.

## Recommended Fix
Defer until international customers in scope.

## Risk If Unresolved
None for VN domestic market.

---

## MISS-021

## Title
Date-range filter on Reports.

## Category
Functional Gap

## Severity
Medium

## Description
The reports page renders a fixed 6-month window with no controls.

## Expected Behavior
- `from`, `to` date pickers; presets (this month, last month, YTD, last 12 months).
- Custom URL state for sharing.

## Recommended Fix
Add controls + bind to API params.

## Risk If Unresolved
Reports can't answer ad-hoc questions.

## Related Business Rules
None directly.

---

## MISS-022

## Title
Bulk operations: bulk import customers/products (Excel), bulk send quotations.

## Category
Missing Implementation

## Severity
Medium

## Description
No way to onboard 500 customers without 500 manual entries.

## Recommended Fix
- `POST /api/customers/bulk-import` accepting XLSX with column mapping.
- Same for products.

## Risk If Unresolved
Onboarding friction.

---

## MISS-023

## Title
Localization & i18n abstraction (only Vietnamese hard-coded today).

## Category
Architecture Limitation

## Severity
Low

## Description
All strings are inline Vietnamese.

## Expected Behavior
- `i18next` or similar; per-tenant locale; messages in JSON.

## Recommended Fix
Defer unless internationalization is required.

---

## MISS-024

## Title
Accessibility audit (WCAG 2.1 AA).

## Category
Functional Gap

## Severity
Medium

## Description
Radix primitives give a baseline (focus rings, keyboard support, ARIA), but no comprehensive audit; Vietnamese language attribute on `<html>` not verified; colour contrast on orange/red badges may fail.

## Recommended Fix
Run axe-core / Lighthouse a11y; fix violations.

## Risk If Unresolved
Excludes assistive-tech users; regulatory exposure for public-sector customers.

---

## MISS-025

## Title
End-to-end test coverage.

## Category
Technical Debt

## Severity
Medium

## Description
No tests in repo (`package.json` has only `build` and `dev` scripts).

## Recommended Fix
Adopt Vitest + Testing Library + Playwright for E2E. Cover BR-CI-*, BR-PAY-*, BR-DEBT-* first.

## Risk If Unresolved
Regressions slip through.

## Related Business Rules
NFR-3 correctness depends on tests.

---

## Summary by severity

| Severity | Count | IDs |
|---|---|---|
| Critical | 4 | MISS-001, MISS-002, MISS-003, MISS-004 |
| High | 7 | MISS-005, MISS-006, MISS-007, MISS-009, MISS-010, MISS-011, MISS-016, MISS-017 |
| Medium | 9 | MISS-008, MISS-012, MISS-013, MISS-014, MISS-015, MISS-021, MISS-022, MISS-024, MISS-025 |
| Low | 4 | MISS-018, MISS-019, MISS-020, MISS-023 |
