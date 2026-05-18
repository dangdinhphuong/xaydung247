# Known Issues — Invoice Pro

> Formal SRS-style register of issues currently present in the codebase. Each issue is uniquely identified, classified, severity-rated, and traceable to source files, business rules, and recommended fixes. Categories used across all gap-analysis files: Business Rule Conflict · Missing Implementation · Functional Gap · UX Inconsistency · Security Risk · Technical Debt · Architecture Limitation · Data Integrity Risk · Validation Issue · Routing Issue · State Management Issue.

---

## ISSUE-001

## Title
Invoice numbering generator does not honour the Settings prefix and silently falls back to a hard-coded literal.

## Category
Business Rule Conflict

## Severity
**Critical**

## Description
`CreateInvoice.tsx` derives the next invoice number from the most recent invoice by stripping the literal substring `'INV'` and incrementing. Seed data uses prefix `HD-2026-` (per `Settings.tsx` default `invoicePrefix='HD-'`), so the regex/strip leaves the entire string intact, `parseInt(...)` returns `NaN`, and the code falls back to the literal `'INV20260001'`. The Settings page exposes `invoicePrefix` and `nextNumber` but the generator ignores both.

## Current Behavior
Every newly-created invoice gets the number `INV20260001`, irrespective of what already exists, breaking the legal requirement that invoice numbers be sequential and unique within a fiscal period.

## Expected Behavior
- Numbering is read from `tenant_settings.invoice_prefix` + zero-padded `tenant_settings.next_invoice_number` (atomically incremented).
- Format: `<prefix><YYYY>-<NNN>` (e.g. `HD-2026-009`).
- Allocation is transactional and unique per tenant.

## Business Impact
- Duplicate invoice numbers break tax-compliance auditing under Vietnamese Circulars on e-invoicing.
- Customers receive invoices that all look identical → reconciliation chaos.
- Accountants cannot trust the document register.

## Technical Impact
- A `UNIQUE(tenant_id, invoice_number)` constraint in production will throw 23505 on the second creation, causing 500-level errors.
- Data backfill required for any test data that already inherited the bad number.

## Root Cause Analysis
`pages/CreateInvoice.tsx` lines 130–137:
```ts
const lastInvoice = invoices[0];
let invoiceNumber = 'INV20260001';
if (lastInvoice) {
  const lastNumber = parseInt(lastInvoice.invoiceNumber.replace('INV', ''));
  invoiceNumber = `INV${(lastNumber + 1).toString().padStart(8, '0')}`;
}
```
1. Hard-coded `'INV'` prefix instead of reading Settings.
2. `parseInt('HD-2026-008')` → `NaN`.
3. `(NaN + 1)` → `NaN` → string `'INVNaN'` (mitigated by the fallback literal).

## Affected Modules
- `modules/orders.md` (BR-CI-04)
- `modules/settings.md` (BR-SET-01)
- `database/database-dictionary.md` table `tenant_settings.next_invoice_number`

## Reproduction Flow
1. Run `npm run dev` with seed data intact.
2. Navigate `/invoices/create`.
3. Pick any customer, add any product, click "Tạo hóa đơn".
4. Observe the resulting `invoiceNumber` on the detail page: `INV20260001` (not `HD-2026-009`).

## Recommended Fix
- Move allocation server-side: `POST /api/invoices` returns the next number via `UPDATE tenant_settings SET next_invoice_number = next_invoice_number + 1 RETURNING …`.
- Format string from `invoice_prefix` + year + zero-padded sequence.
- Until backend exists, client should call `getInvoices()`, parse via regex matching the configured prefix, and fall back to `nextNumber=1`.

## Risk If Unresolved
- Duplicate-key failures in production.
- Tax-authority rejection of invoice register.
- Loss of customer confidence.

## Related Business Rules
BR-CI-04, BR-SET-01, BR-SET-07, INV-X-10.

---

## ISSUE-002

## Title
Aging buckets are inconsistent between Debts module and Reports module.

## Category
Business Rule Conflict

## Severity
High

## Description
`DebtManagement.tsx` uses 3 buckets — `0-30`, `31-60`, `61+`. `Reports.tsx` uses 4 buckets — `0-30`, `31-60`, `61-90`, `90+`. Two screens display contradictory views of the same underlying receivables.

## Current Behavior
A customer with a 95-day-overdue invoice is bucketed `61+` on `/debts` but `90+` on `/reports`. Totals on the two screens do not reconcile.

## Expected Behavior
A single canonical bucketing definition (4 buckets recommended: 0-30 / 31-60 / 61-90 / 90+) used by both screens, plus a single source of truth in either a backend view (`v_customer_debt`) or a shared client helper.

## Business Impact
- Management decisions made on inconsistent numbers.
- Auditors flag the discrepancy.

## Technical Impact
- Two parallel implementations of the same logic; future changes risk drifting further.

## Root Cause Analysis
- `DebtManagement.tsx` lines 52–64: inline bucketing using `getDaysBetween`.
- `Reports.tsx` lines 43–48: bucket array hard-coded (no logic at all; data is fake).
- No central `agingService` exists.

## Affected Modules
`modules/debts.md`, `modules/reports.md`.

## Reproduction Flow
1. Inspect `Reports.tsx` — note hard-coded `agingData`.
2. Inspect `DebtManagement.tsx` — note computed `aging.current/thirtyDays/sixtyDaysPlus`.
3. Manually compute Σ for any customer and compare to either screen.

## Recommended Fix
- Adopt 4 buckets as the standard.
- Implement a shared utility `computeAging(invoices, asOf)` returning `{0-30, 31-60, 61-90, 90+}`.
- Replace hard-coded `agingData` in `Reports.tsx` with real aggregation.

## Risk If Unresolved
Long-term loss of trust in dashboards; report exports diverge.

## Related Business Rules
BR-DEBT-01, BR-DEBT-06, BR-RPT-03.

---

## ISSUE-003

## Title
Dashboard `totalDebt` includes draft invoices, inflating receivables.

## Category
Business Rule Conflict

## Severity
High

## Description
`Dashboard.tsx` computes `totalDebt = Σ remainingBalance` across **all** invoices. Drafts have `remainingBalance == total` because no payment can exist on a draft. They inflate the KPI even though they are not legal receivables. The `/debts` screen correctly excludes drafts.

## Current Behavior
Dashboard's "Tổng công nợ phải thu" can exceed the value shown on `/debts`.

## Expected Behavior
`totalDebt = Σ remainingBalance WHERE status != 'draft'` — consistent with BR-DEBT-02.

## Business Impact
Management over-estimates receivables, may demand collections on non-existent debts.

## Technical Impact
Minor; one filter to add.

## Root Cause Analysis
`Dashboard.tsx` line 50:
```ts
const totalDebt = invoices.reduce((sum, inv) => sum + inv.remainingBalance, 0);
```
Missing `.filter(inv => inv.status !== 'draft')` before reduce.

## Affected Modules
`modules/dashboard.md` (BR-DASH-02).

## Reproduction Flow
1. Seed invoice INV008 has `status='draft'`, `total=10,450,000`, `remainingBalance=10,450,000`.
2. Visit `/`; note `Tổng công nợ phải thu` value.
3. Visit `/debts`; note its summary `Tổng công nợ phải thu`.
4. The Dashboard value is 10,450,000 higher.

## Recommended Fix
Add the filter on Dashboard or move to a backend `/api/dashboard/summary` that uses the same rule as `/debts`.

## Risk If Unresolved
Inconsistent management reporting.

## Related Business Rules
BR-DASH-02, BR-DEBT-02.

---

## ISSUE-004

## Title
Hard-coded "+12.5%" trend on Dashboard monthly-revenue KPI.

## Category
Missing Implementation

## Severity
Medium

## Description
The "Tổng doanh thu tháng này" card shows a literal `+12.5%` green trend chip regardless of actual month-over-month change.

## Current Behavior
The chip never changes.

## Expected Behavior
`trend = (currentMonth − prevMonth) / prevMonth` with sign-aware colouring and graceful handling of zero / NaN.

## Business Impact
Misleading executive KPI.

## Technical Impact
Trivial.

## Root Cause Analysis
`Dashboard.tsx` line 82 — `trend={{ value: '+12.5%', isPositive: true }}` is a JSX literal.

## Affected Modules
`modules/dashboard.md` (BR-DASH-05).

## Reproduction Flow
Visit `/` with any data set; the chip always reads `+12.5%`.

## Recommended Fix
Compute MoM in `Dashboard.tsx` (or backend). Format `(x*100).toFixed(1)%`. Handle prev=0 as `—`.

## Risk If Unresolved
KPI dishonesty; loss of trust.

## Related Business Rules
BR-DASH-01, BR-DASH-05.

---

## ISSUE-005

## Title
Route `/menu` referenced from MobileMenu logic but not registered in router.

## Category
Routing Issue

## Severity
Medium

## Description
`Layout.tsx` watches `location.pathname === '/menu'` to open the mobile menu sheet, and `MobileNav.tsx` renders a tab pointing to `/menu`. The path is not in `routes.ts`, so React Router falls through to the `*` `NotFound` page, briefly flashing 404 underneath the menu drawer.

## Current Behavior
Tapping "Menu" on mobile bottom nav navigates to `/menu`, the 404 page renders behind the sheet, the URL stays `/menu` after the drawer is closed.

## Expected Behavior
Opening the mobile menu should not change the route (or should use a registered route that renders nothing / the previous page).

## Business Impact
Mobile UX defect noticed every time a user opens the menu; SEO/back-button confusion.

## Technical Impact
The browser's back button takes the user to the previous real page but the user perceives the menu as "broken".

## Root Cause Analysis
- `components/Layout.tsx` lines 19–23 — `useEffect` on `pathname === '/menu'` opens the menu.
- `components/MobileNav.tsx` lines 11–17 — tab item `{ path: '/menu', label: 'Menu', icon: Menu }`.
- `app/routes.ts` does not include `/menu`.

## Affected Modules
`overview/system-overview.md` (Route map).

## Reproduction Flow
1. Open the app on mobile width.
2. Tap "Menu" bottom-nav.
3. Observe URL → `/menu`; close the sheet; the URL stays `/menu` and a 404 is rendered behind.

## Recommended Fix
- Convert "Menu" tab into a `<button>` that triggers a Layout-level callback (e.g. via context) instead of a `<Link>`.
- Remove the `useEffect` in `Layout.tsx`.

## Risk If Unresolved
Persistent broken UX on mobile.

## Related Business Rules
NFR-11 (mobile usability).

---

## ISSUE-006

## Title
Payment IDs generated with `Date.now()` are not collision-safe.

## Category
Data Integrity Risk

## Severity
High

## Description
`InvoiceDetail.tsx` assigns new payment IDs via `'PAY' + Date.now()`. Under rapid user interaction or backend race conditions, two payments inserted within the same millisecond collide.

## Current Behavior
Two payments saved in the same millisecond receive the same `id`; later lookups (filters, edits) operate on the wrong record.

## Expected Behavior
Server-generated UUID v4 (or v7) per payment.

## Business Impact
Lost payment records, double-counted collections, customer disputes.

## Technical Impact
`UNIQUE(payments.id)` constraint fires in production; client surfaces 500.

## Root Cause Analysis
`pages/InvoiceDetail.tsx` line 44 — `const newPayment = { id: \`PAY${Date.now()}\`, … }`.

## Affected Modules
`modules/orders.md` (Payment workflow), `database/database-dictionary.md` (payments).

## Reproduction Flow
Hard to reproduce on a single thread; trivial under load tests with concurrent POSTs.

## Recommended Fix
- Backend allocates `id UUID DEFAULT gen_random_uuid()`.
- Client supplies idempotency-key in `Idempotency-Key` header; backend dedupes.

## Risk If Unresolved
Silent data corruption.

## Related Business Rules
BR-PAY-04, INV-X-05.

---

## ISSUE-007

## Title
`updateOverdueStatuses` does not downgrade `overdue` back to `partial` after a payment that does not fully close the invoice.

## Category
Business Rule Conflict

## Severity
Medium

## Description
`DataStore.calculateStatus` returns `overdue` whenever `dueDate < today && remaining > 0`, even after a partial payment. An invoice that was `overdue` and receives a partial payment stays `overdue`, never returning to `partial`. Conversely, paying off fully transitions to `paid`. Business intent is unclear: many systems show `partial` even past due, distinguishing payment progress from over-due flag.

## Current Behavior
After a partial payment on an overdue invoice, status remains `overdue`.

## Expected Behavior
Either (a) status remains `overdue` and a separate `paymentProgress` field indicates partial — preferred for clarity; or (b) status becomes `partial` and a separate `isOverdue` boolean flag is computed.

## Business Impact
Reports collapse `partial-but-overdue` and `unpaid-and-overdue` into one bucket; impossible to see how much has been recovered on overdue invoices.

## Technical Impact
`Reports.tsx` aging and `DebtManagement.tsx` overdue counts both rely on the conflated status.

## Root Cause Analysis
`data/store.ts:calculateStatus`:
```ts
if (paidAmount > 0 && remaining > 0) {
  return isOverdue ? 'overdue' : 'partial';
}
```
Branching combines two orthogonal concepts.

## Affected Modules
`modules/orders.md` (lifecycle), `workflows/order-workflow.md`.

## Reproduction Flow
1. Issue an invoice with `dueDate = today - 5`.
2. Mark a small payment.
3. Status remains `overdue` — not `partial`.

## Recommended Fix
Introduce two fields: `paymentStatus ∈ {unpaid, partial, paid}` + `isOverdue boolean`. Migrate UI badges to combine both (e.g. `partial · overdue`).

## Risk If Unresolved
Long-term reporting and KPI confusion.

## Related Business Rules
BR-PAY-03, lifecycle in `workflows/order-workflow.md`.

---

## ISSUE-008

## Title
HTML-level `min="0"` does not actually prevent negative numeric input via paste.

## Category
Validation Issue

## Severity
Medium

## Description
`CreateInvoice.tsx` and `PaymentModal.tsx` use `<input type="number" min="0">`. Browsers enforce `min` only on stepper buttons, not on typing or pasting. A user pasting `-100` or typing `e-1` bypasses the constraint.

## Current Behavior
Negative discount, tax, shipping, quantity, unit price, or payment amount can be accepted.

## Expected Behavior
Client validation rejects negatives; server validation rejects negatives (single source of truth at the backend).

## Business Impact
Negative tax / shipping reduces total; negative discount inflates it; negative payment reverses the ledger.

## Technical Impact
Possible negative `lineTotal`, negative `total`, negative `remaining_balance` — breaks invariants INV-X-01..05.

## Root Cause Analysis
Reliance on HTML5 form attributes for business validation.

## Affected Modules
`modules/orders.md`, `qa/validation-rules.md`.

## Reproduction Flow
1. Open `/invoices/create`, add a line.
2. Right-click the discount input → paste `-1000000`.
3. Observe `lineTotal` increases.

## Recommended Fix
- Add `onChange` clamp: `Math.max(0, parseFloat(value)) || 0`.
- Backend CHECK constraints already specified in `database-dictionary.md` (quantity > 0, unit_price ≥ 0, discount ≥ 0).

## Risk If Unresolved
Financial inaccuracy.

## Related Business Rules
V-CI-07, V-CI-08, V-PAY-01, INV-X-01..05.

---

## ISSUE-009

## Title
Invoice line `discount` can exceed `quantity × unitPrice`, producing negative `lineTotal`.

## Category
Validation Issue

## Severity
Medium

## Description
There is no upper bound on the per-line discount. `lineTotal = quantity × unitPrice − discount` can become negative.

## Current Behavior
A negative `lineTotal` is summed into `subtotal`, possibly producing nonsensical totals.

## Expected Behavior
`discount ≤ quantity × unitPrice` enforced both client- and server-side (V-CI-08 / V-DISC-01).

## Business Impact
Wrong invoice totals; refund-like behaviour through discount.

## Technical Impact
Breaks INV-X-03.

## Root Cause Analysis
No clamp in `CreateInvoice.tsx:updateItem`.

## Affected Modules
`modules/orders.md`, `workflows/coupon-workflow.md`.

## Reproduction Flow
1. Add product PROD001 (95,000) qty=1 discount=100,000.
2. `lineTotal` displays `-5,000`.

## Recommended Fix
Validate on blur and on submit; server CHECK.

## Risk If Unresolved
Financial defects.

## Related Business Rules
V-CI-08, V-DISC-01, INV-X-03.

---

## ISSUE-010

## Title
`tax` and `shipping` on invoice are entered as absolute amounts; `taxRate` in Settings is never wired.

## Category
Missing Implementation

## Severity
Medium

## Description
Settings exposes `taxRate (%)` and a "Tự động tính thuế" toggle, but `CreateInvoice.tsx` treats `tax` as a free-form absolute number. Users must compute VAT manually.

## Current Behavior
`tax` defaults to 0; users type the amount.

## Expected Behavior
When `autoTax` is ON, `tax = (subtotal − invoiceDiscount) × taxRate / 100` recomputed live.

## Business Impact
Error-prone VAT amounts; non-compliance with declared rate.

## Technical Impact
Two unused settings; users mistrust automation toggles.

## Root Cause Analysis
Settings UI is not wired to a real settings store; `CreateInvoice` does not read settings.

## Affected Modules
`modules/settings.md` (BR-SET-03), `modules/orders.md`.

## Reproduction Flow
1. Go to Settings, set tax rate to 10, toggle "Tự động tính thuế".
2. Create invoice; `tax` remains 0.

## Recommended Fix
- Wire Settings save.
- Compute `tax` automatically when toggle ON.
- Add a "VAT rate" picker per invoice for override.

## Risk If Unresolved
Manual errors at scale.

## Related Business Rules
BR-SET-03, BR-CI-01 (defaultDueDays similar problem).

---

## ISSUE-011

## Title
Settings page save buttons are not wired; inputs are uncontrolled (`defaultValue`).

## Category
Missing Implementation

## Severity
High

## Description
All three "Lưu thay đổi" buttons in `Settings.tsx` have no `onClick`. All inputs use `defaultValue`, so their state is held only in the DOM and lost on navigation.

## Current Behavior
Editing any field and clicking save has no effect.

## Expected Behavior
Form posts to `PUT /api/settings/*`; success toast; values persist across reloads.

## Business Impact
Tenant cannot configure company info, numbering, due-days, VAT rate, automations, or notifications — blocks production rollout.

## Technical Impact
Settings store missing.

## Root Cause Analysis
`pages/Settings.tsx` — no state, no handlers; UI scaffolded only.

## Affected Modules
`modules/settings.md` (entire), `modules/orders.md` (numbering, due-days, tax).

## Reproduction Flow
1. Edit company name.
2. Click "Lưu thay đổi".
3. Reload — original value returns.

## Recommended Fix
Migrate to React Hook Form or controlled state; implement PUT endpoints; show success/error toasts.

## Risk If Unresolved
Settings entire module is decorative.

## Related Business Rules
BR-SET-01..07.

---

## ISSUE-012

## Title
Invoice list row actions Edit, quick-Pay, and "Xuất Excel" have no handlers.

## Category
Missing Implementation

## Severity
High

## Description
The pencil and dollar icons render but do nothing on click; "Xuất Excel" button likewise. Quick-Pay is supposed to open `PaymentModal` directly from the list (state `selectedInvoiceForPayment` exists but is never set).

## Current Behavior
Clicking the icons does nothing.

## Expected Behavior
Edit → navigate to an edit form (currently no `/invoices/:id/edit` route); Quick-Pay → opens `PaymentModal` with the row's invoice; Xuất Excel → triggers download.

## Business Impact
Core list-page productivity actions missing.

## Technical Impact
Dead state `selectedInvoiceForPayment` — code smell.

## Root Cause Analysis
Buttons rendered without `onClick` (`InvoiceList.tsx` lines 191, 195, 129–133).

## Affected Modules
`modules/orders.md`, `qa/qa-test-scenarios.md` (G-02).

## Reproduction Flow
Open `/invoices`, click any pencil or dollar icon; nothing happens. Click "Xuất Excel"; nothing happens.

## Recommended Fix
- Add `/invoices/:id/edit` route + page.
- Bind dollar icon to `setSelectedInvoiceForPayment(invoice)`.
- Implement export-Excel endpoint (server) + client download.

## Risk If Unresolved
Users perceive the system as broken.

## Related Business Rules
TC-INV-LST-11, TC-INV-LST-12.

---

## ISSUE-013

## Title
Invoice Detail "In" and "Tải PDF" buttons have no handlers.

## Category
Missing Implementation

## Severity
High

## Description
Both buttons render with icons but `onClick` is absent. The product depends on printable invoices being delivered to customers.

## Current Behavior
Clicking either button does nothing.

## Expected Behavior
"In" → `window.print()` with print-specific CSS using the active template. "Tải PDF" → server-rendered PDF download.

## Business Impact
Cannot deliver a physical/electronic invoice to a customer; blocks daily use.

## Technical Impact
Need a PDF pipeline (e.g. Puppeteer, wkhtmltopdf) and print CSS.

## Root Cause Analysis
UI placeholders pending implementation.

## Affected Modules
`modules/orders.md`, `modules/templates.md`.

## Reproduction Flow
Open any invoice detail; click "In" or "Tải PDF"; nothing happens.

## Recommended Fix
Wire `window.print()` for In; build `POST /api/invoices/:id/pdf` that returns a PDF stream rendered from the active template.

## Risk If Unresolved
Product is unusable for its primary purpose.

## Related Business Rules
BO-14.

---

## ISSUE-014

## Title
Customer / Product / Quotation pages have non-functional Create-Edit-View buttons.

## Category
Missing Implementation

## Severity
High

## Description
`CustomerManagement`, `ProductManagement`, `QuotationManagement` all expose Add/View/Edit buttons that do nothing. There is no create-customer modal, no create-product form, no create-quotation route.

## Current Behavior
Buttons are decorative.

## Expected Behavior
Each "Thêm …" CTA opens a create modal or navigates to a form; eye/edit buttons open detail/edit screens.

## Business Impact
The seeded list cannot be augmented; the system is read-only for masters.

## Technical Impact
Routes missing: `/customers/new`, `/customers/:id`, `/products/new`, `/products/:id`, `/quotations/new`, `/quotations/:id`.

## Root Cause Analysis
Pages were built around mock data; CRUD pages were not produced.

## Affected Modules
`modules/customers.md`, `modules/products.md`, `modules/quotations.md`.

## Reproduction Flow
Open each page; click any of the action buttons.

## Recommended Fix
Build the four missing CRUD flows.

## Risk If Unresolved
System cannot leave demo stage.

## Related Business Rules
Per-module BR sections.

---

## ISSUE-015

## Title
`TemplateList.handleSetDefault` only logs to console.

## Category
Missing Implementation

## Severity
Medium

## Description
Clicking "Đặt làm mặc định" on a non-default template performs `console.log` and nothing else.

## Current Behavior
Default template never changes.

## Expected Behavior
POST `/api/templates/:id/set-default` (with the partial-unique-index enforcement) and re-fetch list.

## Business Impact
Customer cannot change branding without code changes.

## Technical Impact
Backend endpoint missing.

## Root Cause Analysis
`pages/TemplateList.tsx` line 51.

## Affected Modules
`modules/templates.md` (BR-TPL-01).

## Reproduction Flow
Click "Đặt làm mặc định" on Mẫu hiện đại; nothing changes.

## Recommended Fix
Implement endpoint + state refresh; add toast.

## Risk If Unresolved
Template module half-finished.

## Related Business Rules
BR-TPL-01.

---

## ISSUE-016

## Title
DataStore is in-memory and re-seeded on every page reload.

## Category
Architecture Limitation

## Severity
**Critical**

## Description
`store.ts` keeps invoices/payments/customers/products in JavaScript arrays initialised from `mockData.ts`. A browser refresh wipes all user-entered data.

## Current Behavior
Create an invoice → refresh → it's gone.

## Expected Behavior
Persistence to a backend database; optimistic UI with conflict resolution.

## Business Impact
The system cannot be deployed.

## Technical Impact
Entire data-access layer must be re-implemented behind an HTTP boundary.

## Root Cause Analysis
Original Figma-Make prototype; backend out of scope of the codegen.

## Affected Modules
All modules.

## Reproduction Flow
Create anything → F5 → gone.

## Recommended Fix
Build a NestJS/Spring Boot backend exposing the contract defined in `store.ts` and `database/database-dictionary.md`. Replace store calls with `fetch` / TanStack Query.

## Risk If Unresolved
Total data loss; no production viability.

## Related Business Rules
NFR-7.

---

## ISSUE-017

## Title
No authentication, no authorization, no tenant isolation.

## Category
Security Risk

## Severity
**Critical**

## Description
Every page is reachable by an unauthenticated visitor; the header displays a hard-coded "Nguyễn Văn An — Quản trị viên".

## Current Behavior
Any visitor has full admin powers.

## Expected Behavior
Session-based authentication; RBAC per `roles/roles-and-permissions.md`; tenant isolation per `security-risks.md` SEC-AUTHZ-* and SEC-TEN-*.

## Business Impact
Customer data exposure; financial fraud potential.

## Technical Impact
Adding auth touches every API call and route guard.

## Root Cause Analysis
Prototype scope.

## Affected Modules
All.

## Reproduction Flow
Open the app, browse any module.

## Recommended Fix
See `modules/authentication.md`, `roles/roles-and-permissions.md`, `gap-analysis/security-risks.md`.

## Risk If Unresolved
Cannot ship publicly.

## Related Business Rules
BO-12, BR-AUTH-*, RBAC matrix.

---

## ISSUE-018

## Title
`Template.customHTML` is rendered raw → stored-XSS risk.

## Category
Security Risk

## Severity
High (after auth is added)

## Description
The HTML-editor mode of the template stores raw HTML in `customHTML` and renders it when previewing or printing. Once multi-user, a SALES/ACCOUNTANT user could view a malicious template authored by another tenant member, or by a compromised admin account.

## Current Behavior
No sanitisation.

## Expected Behavior
Sanitise with DOMPurify on render; restrict authorship to ADMIN; show a confirmation banner when rendering custom HTML.

## Business Impact
Account takeover via session-cookie theft; data exfiltration.

## Technical Impact
Need a sanitiser; CSP must be tight.

## Root Cause Analysis
Power-user feature lacks safety rails.

## Affected Modules
`modules/templates.md`, `gap-analysis/security-risks.md`.

## Reproduction Flow
1. Edit template HTML to `<img src=x onerror=alert(1)>`.
2. Open preview / print.
3. Script executes.

## Recommended Fix
Wrap rendering in DOMPurify with a strict allowlist (no `<script>`, no `on*` handlers, no `javascript:` URLs).

## Risk If Unresolved
Severe vulnerability once multi-user.

## Related Business Rules
SEC-XSS-04.

---

## ISSUE-019

## Title
`Header.tsx` notification bell is decorative — always shows red dot.

## Category
UX Inconsistency

## Severity
Low

## Description
The bell icon shows an animated red ping at all times, regardless of notification count.

## Current Behavior
Always red.

## Expected Behavior
Shows the dot only when unread notifications exist; clicking opens a dropdown of recent items.

## Business Impact
"Notification fatigue"; users learn to ignore the bell.

## Technical Impact
Need a notifications store + API.

## Root Cause Analysis
Static JSX.

## Affected Modules
`overview/system-overview.md`, recommended new `modules/notifications.md`.

## Reproduction Flow
Look at any page — the bell always has a red dot.

## Recommended Fix
Bind to `unreadCount > 0`; add `/api/notifications`.

## Risk If Unresolved
Long-term UX defect.

## Related Business Rules
NFR-5.

---

## ISSUE-020

## Title
No empty / loading / error states across the application.

## Category
Functional Gap

## Severity
Medium

## Description
Pages render instantly because data is in-memory. Once a real API is introduced, every page needs loading skeletons, error fallbacks, and "no data" empty states (today only `InvoiceList`, `InvoiceDetail`, `QuotationManagement`, `Products`, `Debts` have partial empty states; `Customers`, `Dashboard`, `Reports`, `Settings`, `Templates` lack them entirely).

## Current Behavior
Pages assume data is always present.

## Expected Behavior
- Loading skeleton per section.
- Error boundary with retry.
- Empty-state hero with CTA.

## Business Impact
Confusing first-use experience.

## Technical Impact
Touch every page; introduce React `Suspense`/`ErrorBoundary` pattern.

## Root Cause Analysis
Prototype assumed synchronous data.

## Affected Modules
All page modules.

## Reproduction Flow
N/A — design gap.

## Recommended Fix
Adopt TanStack Query; wrap pages in error boundaries; build shared skeleton components.

## Risk If Unresolved
Inconsistent UX.

## Related Business Rules
NFR-5.

---

## ISSUE-021

## Title
`isOverdue` uses local time zone, not Asia/Ho_Chi_Minh.

## Category
Data Integrity Risk

## Severity
Medium

## Description
`utils/formatters.ts:isOverdue` constructs `new Date()` (local time zone). Users in different time zones (or servers in UTC) will compute different overdue verdicts.

## Current Behavior
Local-time-dependent.

## Expected Behavior
Always evaluate against `Asia/Ho_Chi_Minh` calendar date.

## Business Impact
Late-night entries near midnight could flip status incorrectly.

## Technical Impact
Use `date-fns-tz` or pass `today` from the server.

## Root Cause Analysis
`new Date()` is environment-dependent.

## Affected Modules
`workflows/order-workflow.md`, `utils/formatters.ts`.

## Reproduction Flow
Set system clock to UTC; with `dueDate=2026-05-18`, between 17:00 and 24:00 local UTC, status flips earlier than expected in Vietnam.

## Recommended Fix
Centralise "today" via a helper that honours the configured TZ.

## Risk If Unresolved
Subtle financial-day errors.

## Related Business Rules
BR-PAY-03, X-03.

---

## ISSUE-022

## Title
`getDaysBetween` uses `Math.ceil` and can return 0 for same-day, off-by-one across DST.

## Category
Data Integrity Risk

## Severity
Low

## Description
`Math.ceil((end - start) / msPerDay)` produces 0 for same-day, 1 for next day, and is wrong by ±1 day around DST transitions (Vietnam does not observe DST, but timestamps from other origins might).

## Current Behavior
Edge values around midnight may round inconsistently.

## Expected Behavior
Use calendar-date arithmetic (`differenceInCalendarDays` from date-fns).

## Root Cause Analysis
Naive millisecond math.

## Affected Modules
`workflows/order-workflow.md`, `modules/debts.md` (BR-DEBT-01).

## Recommended Fix
Replace with `differenceInCalendarDays(parseISO(end), parseISO(start))`.

## Risk If Unresolved
Aging buckets occasionally off by one day.

## Related Business Rules
BR-DEBT-01.

---

## ISSUE-023

## Title
Numbering is computed from `invoices[0]` (an "unshift" head), not `MAX(invoice_number)`.

## Category
Data Integrity Risk

## Severity
High

## Description
`addInvoice` does `unshift`, so `invoices[0]` is always the **latest inserted**. But "latest inserted" is not necessarily "highest number" if invoices are loaded out of order (e.g. on reload from a backend). Numbering should always be derived from a database sequence or `MAX(... )`, never from "first item in the array".

## Current Behavior
Client mutates an array head; numbering depends on insertion order.

## Expected Behavior
Server-side allocation via sequence.

## Business Impact
Two invoices created from different sessions could fight for the same number.

## Technical Impact
Will fail under concurrency.

## Root Cause Analysis
In-memory list mistaken for an ordered ledger.

## Affected Modules
`modules/orders.md` (BR-CI-04), `modules/settings.md`.

## Reproduction Flow
Manually push an invoice with number `HD-2026-050` to the front of the array; the next created invoice tries to be `HD-2026-051`.

## Recommended Fix
Server sequence; see ISSUE-001 for the prefix issue (related).

## Risk If Unresolved
Duplicate numbers; legal liability.

## Related Business Rules
BR-CI-04, BR-SET-01.

---

## ISSUE-024

## Title
React-Hook-Form is installed but not used; forms are hand-rolled controlled components.

## Category
Technical Debt

## Severity
Low

## Description
`react-hook-form 7.55.0` is in `package.json`. No page imports it. Forms (`CreateInvoice`, `PaymentModal`, `Settings`) are hand-rolled.

## Current Behavior
Boilerplate state, manual validation, duplicated patterns.

## Expected Behavior
Either remove the dependency or migrate forms to RHF + zod for consistent validation and submission lifecycle.

## Root Cause Analysis
Dependency was probably planned but never adopted.

## Affected Modules
`modules/orders.md`, `modules/settings.md`.

## Recommended Fix
Decide: adopt RHF + zod across all forms (recommended) or remove the dep.

## Risk If Unresolved
Long-term maintenance cost.

## Related Business Rules
None directly.

---

## ISSUE-025

## Title
Dead state `selectedInvoiceForPayment` in `InvoiceList`.

## Category
Technical Debt

## Severity
Low

## Description
`useState<Invoice | null>(null)` is declared and a `PaymentModal` is conditionally rendered, but no code ever calls `setSelectedInvoiceForPayment(invoice)`. The variable is permanently `null` and the modal can never open from the list.

## Current Behavior
Dead code; modal never appears.

## Expected Behavior
Either wire the dollar-icon click to set the state (and remove the navigation it currently performs), or remove the dead state.

## Root Cause Analysis
Scaffolded feature; integration never finished.

## Affected Modules
`modules/orders.md`.

## Recommended Fix
Bind the icon to `setSelectedInvoiceForPayment`.

## Risk If Unresolved
Confuses future maintainers.

## Related Business Rules
TC-INV-LST-11.

---

## ISSUE-026

## Title
`InvoiceDetail` re-fetches via `useEffect` keyed on `[id]` only, so payments added in-page don't trigger a re-fetch from the store after `addPayment`.

## Category
State Management Issue

## Severity
Medium

## Description
After `store.addPayment`, the handler manually calls `store.getInvoice(id!)` and `setInvoice`. The `useEffect` dependency `[id]` would not re-run on data change. If the same `id` is involved, only the explicit setter keeps state in sync. Any other consumer of `store` (sidebar counts, dashboard) will be stale until re-mount.

## Current Behavior
Sidebar/dashboard counts are stale until manual nav.

## Expected Behavior
A reactive store (Zustand / TanStack Query) so subscribers re-render automatically.

## Business Impact
Stale KPIs after payment.

## Technical Impact
Tight coupling between page-level logic and store mutations.

## Root Cause Analysis
Singleton class-based store with no subscriber mechanism.

## Affected Modules
`overview/system-overview.md`, `modules/dashboard.md`, `modules/orders.md`.

## Recommended Fix
Replace `DataStore` with Zustand or TanStack Query (mutations + invalidate-queries).

## Risk If Unresolved
Subtle UI staleness.

## Related Business Rules
None directly.

---

## ISSUE-027

## Title
Customer `currentDebt` derived but `mockData.customers[*].totalDebt` is also stored — two sources of truth.

## Category
Data Integrity Risk

## Severity
Medium

## Description
`Customer` interface has `totalDebt: number` (stored), and `CustomerManagement.tsx` re-derives `currentDebt` from invoices. The two will drift as soon as invoices change.

## Current Behavior
The UI shows derived `currentDebt` but the seed value `totalDebt` is also present in mock objects and could be used by future code.

## Expected Behavior
Drop `totalDebt` from the schema entirely; always derive.

## Root Cause Analysis
Mock data conflated cached and authoritative values.

## Affected Modules
`modules/customers.md` (BR-CUST-01), `database/database-dictionary.md`.

## Recommended Fix
Remove `totalDebt` from `Customer` type and mock data.

## Risk If Unresolved
Future bugs based on stale field.

## Related Business Rules
BR-CUST-01.

---

## ISSUE-028

## Title
`Edit` button on `InvoiceList` would corrupt `partial`/`paid` invoices because line-item lock is not implemented.

## Category
Functional Gap

## Severity
High (latent — appears once Edit is wired)

## Description
There is no rule preventing edits to line items of an invoice that has received payments. Recommended business rule (WF-INV-R-03) requires line items become read-only once `status ∈ {partial, paid, overdue}`.

## Current Behavior
No edit page exists yet (ISSUE-012).

## Expected Behavior
When Edit is built, the page MUST enforce a partial lock: header notes only.

## Business Impact
Editing a partially-paid invoice can break ledger consistency.

## Technical Impact
Recompute paid_amount, remaining_balance, status if total changes — risk of negative remaining.

## Root Cause Analysis
Feature not yet built; rule must be designed in.

## Affected Modules
`modules/orders.md`, `workflows/order-workflow.md`.

## Recommended Fix
Implement lock at component level + backend rule.

## Risk If Unresolved
High once Edit ships.

## Related Business Rules
WF-INV-R-03.

---

## ISSUE-029

## Title
Inventory `stock` is never decremented when an invoice is issued.

## Category
Functional Gap

## Severity
Medium

## Description
The product master has a `stock` field; `CreateInvoice` does not touch it. The "low stock <100" cue therefore reflects only seed data.

## Current Behavior
Stock is static.

## Expected Behavior
Either declare inventory **out of scope** and remove the `stock` field & low-stock cue, OR implement stock movements on invoice transition to `unpaid` (configurable per shop).

## Business Impact
False sense of stock visibility.

## Technical Impact
True inventory needs a movements ledger; out of scope today.

## Root Cause Analysis
Display-only feature, not wired to operations.

## Affected Modules
`modules/products.md` (BR-PROD-05).

## Recommended Fix
Decide scope; if in scope, build `stock_movements` table and triggers.

## Risk If Unresolved
Misleading product page.

## Related Business Rules
BR-PROD-05.

---

## ISSUE-030

## Title
`MobileMenu` opening is tied to URL change, but closing is via state (`setIsMobileMenuOpen(false)`) — back-button leaves URL=`/menu` even when menu is closed.

## Category
State Management Issue

## Severity
Low

## Description
Opening menu mutates URL → `/menu`; closing it mutates only state. After close, URL still `/menu`. Browser back button has to be pressed to clear.

## Current Behavior
URL not cleaned after menu close.

## Expected Behavior
Close should pop the history entry OR menu should not change URL at all (preferred — see ISSUE-005).

## Business Impact
Minor confusion.

## Technical Impact
Coupled with ISSUE-005.

## Recommended Fix
Fix ISSUE-005 — make menu purely state-driven.

## Risk If Unresolved
Persistent UX defect.

## Related Business Rules
NFR-11.

---

## Summary by severity

| Severity | Count | IDs |
|---|---|---|
| Critical | 3 | ISSUE-001, ISSUE-016, ISSUE-017 |
| High | 9 | ISSUE-002, ISSUE-003, ISSUE-006, ISSUE-011, ISSUE-012, ISSUE-013, ISSUE-014, ISSUE-018, ISSUE-023, ISSUE-028 |
| Medium | 12 | ISSUE-004, ISSUE-005, ISSUE-007, ISSUE-008, ISSUE-009, ISSUE-010, ISSUE-015, ISSUE-020, ISSUE-021, ISSUE-026, ISSUE-027, ISSUE-029 |
| Low | 5 | ISSUE-019, ISSUE-022, ISSUE-024, ISSUE-025, ISSUE-030 |
