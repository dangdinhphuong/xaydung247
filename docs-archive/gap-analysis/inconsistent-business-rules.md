# Inconsistent Business Rules — Invoice Pro

> Catalogue of contradictions, calculation mismatches, undefined transitions, and rule conflicts across the codebase. Each entry follows the standard issue format and references the conflicting source locations.

---

## RULE-001

## Title
Aging buckets differ between Debts (3 buckets) and Reports (4 buckets).

## Category
Business Rule Conflict

## Severity
High

## Description
- `pages/DebtManagement.tsx` aggregates into `current / thirtyDays / sixtyDaysPlus` (= `0-30`, `31-60`, `61+`).
- `pages/Reports.tsx` declares buckets `0-30`, `31-60`, `61-90`, `90+`.

## Current Behavior
Two screens show different shapes of the same data; totals do not reconcile.

## Expected Behavior
Single canonical bucketing (recommended 4 buckets) shared by both screens.

## Business Impact
Auditors lose confidence; numbers disagree.

## Technical Impact
Duplicated logic across pages.

## Root Cause Analysis
Independent implementations during prototyping; no shared utility.

## Affected Modules
`modules/debts.md`, `modules/reports.md`.

## Reproduction Flow
Compare the Debts page totals to the Reports page totals — they may not sum identically.

## Recommended Fix
Extract `computeAging(invoices, asOf)` shared util returning 4 buckets; refactor both pages to use it.

## Risk If Unresolved
Long-term reporting confusion.

## Related Business Rules
BR-DEBT-01, BR-DEBT-06, BR-RPT-03.

---

## RULE-002

## Title
Draft invoices counted in Dashboard `totalDebt` but excluded in Debts page.

## Category
Business Rule Conflict

## Severity
High

## Description
- `Dashboard.tsx` line 50: `totalDebt = Σ remainingBalance` (no status filter).
- `DebtManagement.tsx` line 35: filters `status !== 'draft'` before summing.

## Current Behavior
Dashboard's total can exceed Debt page total by Σ(drafts).

## Expected Behavior
Draft invoices are NOT receivables (per BR-DEBT-02). Dashboard MUST also exclude drafts.

## Business Impact
Misleads management.

## Recommended Fix
Apply `status !== 'draft'` filter in Dashboard.

## Risk If Unresolved
Permanent inconsistency.

## Related Business Rules
BR-DASH-02 vs BR-DEBT-02.

---

## RULE-003

## Title
Top-customer revenue uses `paidAmount` (cash basis) but Dashboard `monthlyRevenue` also uses `paidAmount`, while invoice "Tổng tiền" cards show `total` (invoiced basis) — mixed reporting basis is undocumented.

## Category
Business Rule Conflict

## Severity
Medium

## Description
- `Reports.tsx` top-5 uses `Σ paidAmount`.
- `Dashboard.tsx` "Tổng doanh thu tháng này" uses `Σ paidAmount`.
- Reports monthly chart uses hard-coded series labelled "Tổng doanh thu" (likely meant invoiced, but currently fake).
- KPIs in Reports footer summarise "Tổng doanh thu 6 tháng" — also fake.

## Current Behavior
Different metrics labelled "doanh thu" can mean different things.

## Expected Behavior
Pick a single convention per metric:
- "Tổng doanh thu" (invoiced) = Σ invoice.total in period.
- "Đã thu" (collected) = Σ payments.amount in period.
- "Còn phải thu" = invoiced − collected.

## Business Impact
Owners cannot distinguish billing performance from collection performance.

## Recommended Fix
Document the basis explicitly on each widget; rename "Tổng doanh thu tháng này" to "Đã thu tháng này" if it's cash basis.

## Risk If Unresolved
Endless management debates.

## Related Business Rules
BR-DASH-01, BR-RPT-01.

---

## RULE-004

## Title
Status transition `overdue → partial` is not modelled — overdue invoices stay overdue after partial payment.

## Category
Business Rule Conflict

## Severity
Medium

## Description
`calculateStatus` returns `overdue` whenever `dueDate < today && remaining > 0`, regardless of any payments. There is no way to express "partial AND overdue" or to return to `partial` after a partial payment.

## Current Behavior
After a partial payment on an overdue invoice, status stays `overdue`; the fact that a payment was made is invisible from the status badge.

## Expected Behavior
Either:
(a) Decouple `paymentStatus ∈ {unpaid, partial, paid}` from `isOverdue: boolean` — preferred.
(b) Treat `overdue` strictly as "past due with any unpaid amount" and surface "đã thanh toán một phần" as a secondary label.

## Business Impact
Cannot distinguish in reports between "fully unpaid + overdue" and "partially paid + overdue".

## Recommended Fix
Migrate to two fields; update all UI badges and report queries.

## Risk If Unresolved
Reporting blind spot.

## Related Business Rules
BR-PAY-03, ISSUE-007.

---

## RULE-005

## Title
Invoice numbering algorithm contradicts Settings configuration.

## Category
Business Rule Conflict

## Severity
**Critical**

## Description
- Settings advertises configurable `invoicePrefix` and `nextNumber`.
- `CreateInvoice.tsx` hard-codes `'INV'` prefix and 8-digit padding.
- Seed data uses prefix `HD-` with 3-digit padding.

## Current Behavior
Settings has no effect; generator falls back to `'INV20260001'` literal.

## Expected Behavior
Single algorithm: read Settings, allocate `<prefix><YYYY>-<padded N>`.

## Recommended Fix
See ISSUE-001, ISSUE-023.

## Risk If Unresolved
Compliance and data-integrity failures.

## Related Business Rules
BR-CI-04, BR-SET-01, BR-SET-07.

---

## RULE-006

## Title
Settings `defaultDueDays` exists but is not used; `dueDate` is hard-coded to today+30.

## Category
Business Rule Conflict

## Severity
Medium

## Description
- Settings field `defaultDueDays` defaults 30 with intent to be tenant-configurable.
- `CreateInvoice.tsx` hard-codes `30 * 24 * 60 * 60 * 1000`.

## Current Behavior
Changing `defaultDueDays` in Settings has no effect.

## Expected Behavior
`dueDate = today + tenant_settings.default_due_days`.

## Recommended Fix
Read from settings store.

## Related Business Rules
BR-CI-01, BR-SET-02.

---

## RULE-007

## Title
Settings `autoTax` + `taxRate` not applied; `tax` is manual absolute amount.

## Category
Business Rule Conflict

## Severity
Medium

## Description
The UI lets the user toggle "Tự động tính thuế" with a default rate, but `CreateInvoice` exposes a raw VND input for tax.

## Expected Behavior
When `autoTax` ON, `tax` is computed and read-only; user toggles a per-invoice override.

## Recommended Fix
Wire Settings; conditional input.

## Related Business Rules
BR-SET-03.

---

## RULE-008

## Title
Customer `totalDebt` is both stored and derived → inevitable divergence.

## Category
Business Rule Conflict / Data Integrity Risk

## Severity
Medium

## Description
- Field `Customer.totalDebt: number` is stored in the seed.
- `CustomerManagement.tsx` ignores the stored value and computes `currentDebt` from invoices.

## Current Behavior
Two values, only one displayed; the stored one is dead weight that future bugs may consume.

## Expected Behavior
Remove `totalDebt` from `Customer` schema; always derive.

## Recommended Fix
Drop the field from `types.ts` and `mockData.ts`.

## Related Business Rules
BR-CUST-01.

---

## RULE-009

## Title
`reference` field in PaymentModal is shown conditionally for bank_transfer but never required.

## Category
Validation Issue

## Severity
Medium

## Description
- UI shows the "Mã giao dịch" input when `method === 'bank_transfer'`, signalling expected entry.
- The form submits successfully with an empty reference.

## Current Behavior
Bank transfers can be recorded without a transaction code.

## Expected Behavior
Either:
(a) Make `reference` mandatory when `method === 'bank_transfer'` (V-PAY-06).
(b) Document as optional and remove the conditional hint.

## Recommended Fix
Confirm intent with business; default recommendation: required for bank transfers and checks.

## Related Business Rules
V-PAY-06.

---

## RULE-010

## Title
Discount semantics differ between "Giảm giá" rows (absolute VND) and possible interpretation as percentage on quotations.

## Category
Business Rule Conflict (potential)

## Severity
Low

## Description
The system treats discount uniformly as absolute VND. Some accounting practices express discount as a percentage in quotations. The spec does not document this.

## Recommended Fix
Document in `modules/quotations.md` that discount is absolute VND for both invoices and quotations; provide a separate "Discount %" UI helper if percentage entry is wanted.

## Related Business Rules
BR-DISC-01.

---

## RULE-011

## Title
Quotation has only a single `total` field — no subtotal/discount/tax/shipping breakdown, contradicting invoice model.

## Category
Business Rule Conflict

## Severity
Medium

## Description
`Invoice` carries subtotal/discount/tax/shipping/total; `Quotation` only has `total`. Converting a quotation to an invoice loses VAT/shipping detail (or requires re-entry).

## Current Behavior
Quotation cannot express tax/shipping; conversion to invoice would re-input them.

## Expected Behavior
Either:
(a) Mirror the full breakdown in Quotation.
(b) Document Quotation as "pre-tax / pre-shipping price offer".

## Recommended Fix
Add `subtotal`, `discount`, `tax`, `shipping` to Quotation for consistency with invoice.

## Related Business Rules
modules/quotations.md §6.

---

## RULE-012

## Title
`updateOverdueStatuses` is invoked on read but cannot fire on the backend (no backend exists).

## Category
Business Rule Conflict / Architecture Limitation

## Severity
Medium

## Description
The current model relies on reading invoices to trigger reclassification. A production backend needs a nightly cron AND an on-read evaluation.

## Recommended Fix
Implement both:
- Nightly job at 00:05 Asia/Ho_Chi_Minh.
- On every `GET /api/invoices`, opportunistically reclassify.

## Related Business Rules
BR-DB-01, X-03.

---

## RULE-013

## Title
"Hóa đơn quá hạn" KPI counts status `overdue` only, but logically should include `partial + past-due` (which currently resolve to `overdue` anyway — entangled with RULE-004).

## Category
Business Rule Conflict

## Severity
Medium

## Description
Today the KPI works only because `partial-and-past-due` is conflated into `overdue`. If RULE-004 is fixed by introducing dual fields, the KPI logic must be updated to `status='overdue' OR (status='partial' AND isOverdue)`.

## Recommended Fix
Update KPI together with RULE-004.

## Related Business Rules
BR-DASH-03, BR-DEBT-04, RULE-004.

---

## RULE-014

## Title
`/menu` route is referenced but unregistered (Routing Issue).

## Category
Routing Issue

## Severity
Medium

## Description
See ISSUE-005.

## Recommended Fix
Make Menu purely state-driven (no URL change).

## Related Business Rules
NFR-11.

---

## RULE-015

## Title
"Còn lại" cell in InvoiceList shows for paid invoices as ₫0 instead of `-` (minor display inconsistency).

## Category
UX Inconsistency

## Severity
Low

## Description
Mobile cards check `remainingBalance > 0` before rendering the orange "Còn:" line. The desktop table always renders the value, even when 0.

## Expected Behavior
Render `-` when 0 (matches Customer's debt display convention).

## Recommended Fix
Conditional render in the desktop column.

## Related Business Rules
None directly.

---

## RULE-016

## Title
Status-pill colour map differs subtly between modules (Quotation pill vs Invoice pill).

## Category
UX Inconsistency

## Severity
Low

## Description
- `StatusBadge` (invoice) uses solid `red-100` / `red-50` variants.
- Quotation pills (`statusConfig` in `QuotationManagement.tsx`) use `red-100` and lighter palette.
Result: similar but not identical pill shades for "Đã từ chối" vs "Quá hạn" — confusing at a glance.

## Recommended Fix
Centralise badge variants in a shared `<StatusBadge variant="…">` so all status colours come from a single token set.

## Related Business Rules
ARCH-015.

---

## RULE-017

## Title
"Đến hạn" date is shown both as "Ngày đến hạn" (Invoice list/detail) and "Hiệu lực đến" (Quotation list) — two labels for similar concepts in Vietnamese; no glossary.

## Category
UX Inconsistency / Documentation Gap

## Severity
Low

## Description
Same domain concept (validity) uses different localisation labels.

## Recommended Fix
Document the glossary in `overview/system-overview.md`; keep the distinct labels (they ARE different concepts — "due date" vs "validity end") but cross-link.

## Related Business Rules
NFR-4.

---

## RULE-018

## Title
"Hóa đơn chưa thanh toán" KPI excludes `draft` AND `paid`; "Hóa đơn quá hạn" only counts `overdue`. The two are not mutually exclusive (overdue is a subset of "chưa thanh toán"). The Dashboard juxtaposes both as if they were independent counts.

## Category
UX Inconsistency

## Severity
Low

## Description
Reader may believe `unpaidCount + overdueCount` equals total open invoices — it doesn't.

## Recommended Fix
Add a small tooltip clarifying the relationship; or replace with a stacked bar (unpaid → not yet due | overdue).

## Related Business Rules
BR-DASH-03, BR-DASH-04.

---

## RULE-019

## Title
Mobile bottom-nav exposes 5 items (Tổng quan, Hóa đơn, Công nợ, Khách hàng, Menu); desktop sidebar exposes 8 (adds Báo giá, Mặt hàng, Báo cáo, Cài đặt). Mobile users must use the "Menu" sheet for the missing four.

## Category
UX Inconsistency

## Severity
Low

## Description
The split is reasonable, but inconsistency in module discoverability between form factors is not documented.

## Recommended Fix
Document in `overview/system-overview.md`; consider adding a recently-used / favourites mechanism in the menu sheet.

## Related Business Rules
NFR-11.

---

## RULE-020

## Title
"Số hóa đơn tiếp theo" in Settings defaults to 9 (string) — implies merchant has 8 invoices issued. Seed data uses INV001..008. Settings is not connected to actual numbering.

## Category
Business Rule Conflict

## Severity
Medium

## Description
The seeded default in Settings is hand-set to "9" to match seed data, but if invoices are created via the broken numbering generator (ISSUE-001), Settings does NOT increment — the two systems are entirely disjoint.

## Recommended Fix
Tied to ISSUE-001 fix.

## Related Business Rules
BR-SET-01.

---

## Cross-reference table

| Rule | Conflicts with |
|---|---|
| RULE-001 | BR-DEBT-01, BR-RPT-03 |
| RULE-002 | BR-DASH-02, BR-DEBT-02 |
| RULE-004 | BR-PAY-03 |
| RULE-005 | BR-CI-04, BR-SET-01 |
| RULE-006 | BR-CI-01, BR-SET-02 |
| RULE-007 | BR-SET-03 |
| RULE-008 | BR-CUST-01 |
| RULE-011 | modules/quotations.md §6 |
| RULE-013 | RULE-004 |
| RULE-018 | BR-DASH-03/04 |
| RULE-020 | BR-SET-01 |

---

## Summary by severity

| Severity | Count | IDs |
|---|---|---|
| Critical | 1 | RULE-005 |
| High | 2 | RULE-001, RULE-002 |
| Medium | 10 | RULE-003, RULE-004, RULE-006, RULE-007, RULE-008, RULE-009, RULE-011, RULE-012, RULE-013, RULE-014, RULE-020 |
| Low | 5 | RULE-010, RULE-015, RULE-016, RULE-017, RULE-018, RULE-019 |
