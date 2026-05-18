# Canonical Business Rules — Invoice Pro

> **SINGLE SOURCE OF TRUTH.** Every backend service, database constraint, frontend validation, and report MUST conform to the rules in this file. When any other document conflicts with this one, **this file wins** and the other document MUST be updated.

**Status:** RATIFIED — frozen for backend generation.
**Version:** 1.0
**Locale:** vi-VN, currency VND, time zone **Asia/Ho_Chi_Minh** (everywhere).
**Money type:** decimal — wire format = string with up to 0 decimal places (VND has no minor unit), DB type `NUMERIC(18, 2)` (headroom), arithmetic = decimal library (never JS `number`).

---

## Section index

| § | Topic |
|---|---|
| 1 | Tenancy, identity & audit (foundational) |
| 2 | Invoice numbering — atomic allocation |
| 3 | Customer model & debt derivation |
| 4 | Product model & stock semantics |
| 5 | Invoice line model (quantity / price / discount / line total) |
| 6 | Invoice totals (subtotal / discount / tax / shipping / total / paidAmount / remainingBalance) |
| 7 | Tax calculation (autoTax + taxRate) |
| 8 | Payment model & payment allocation |
| 9 | Invoice status lifecycle (formal) — *full diagram in `status-lifecycle.md`* |
| 10 | Overdue rule (date math, time zone, evaluation moments) |
| 11 | Receivables (debt) aggregation — single canonical view |
| 12 | Aging buckets — 4 canonical buckets |
| 13 | Quotation model & lifecycle |
| 14 | Quotation conversion to invoice |
| 15 | Dashboard aggregations (cash basis vs accrual basis) |
| 16 | Reporting formulas |
| 17 | Idempotency & concurrency |
| 18 | Default values from Settings (consumption rules) |
| 19 | Soft-delete / void / retention |
| 20 | Cross-rule invariants (server CHECK + test) |
| 21 | Conflict resolutions (overrides from prior docs) |

---

## 1. Tenancy, identity & audit (foundational)

| ID | Rule |
|---|---|
| **CR-T-01** | Every business row carries `tenant_id UUID NOT NULL`. No exception. |
| **CR-T-02** | `tenant_id` is derived from the authenticated principal — NEVER trusted from the request body. |
| **CR-T-03** | Postgres Row-Level Security is enforced on every business table as defence in depth: `CREATE POLICY … USING (tenant_id = current_setting('app.current_tenant')::uuid)`. |
| **CR-T-04** | Cross-tenant ID lookups return **404 Not Found** (never 403 — do not leak existence). |
| **CR-T-05** | Every mutating endpoint emits exactly one `audit_logs` row AFTER the business transaction commits, including actor, role, action, resource, before/after snapshots, IP, UA, request-id. |
| **CR-T-06** | Audit rows are append-only. DB role used by the app has `REVOKE UPDATE, DELETE ON audit_logs`. |
| **CR-T-07** | All timestamps stored as `TIMESTAMPTZ` in UTC; all calendar dates (`issue_date`, `due_date`, `payment_date`, `valid_until`) stored as `DATE` interpreted in **Asia/Ho_Chi_Minh**. |
| **CR-T-08** | Server-side "today" is `(now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date`. The frontend MUST use the value returned by the API for "today" — never `new Date()` locally for business decisions. |

---

## 2. Invoice numbering — atomic allocation

| ID | Rule |
|---|---|
| **CR-NUM-01** | Invoice numbers are unique per tenant: `UNIQUE(tenant_id, invoice_number)`. |
| **CR-NUM-02** | Numbering format = **`{prefix}{YYYY}-{NNN}`** where: `prefix` from `tenant_settings.invoice_prefix` (default `HD-`); `YYYY` = year of `issue_date`; `NNN` = zero-padded sequence, **minimum 3 digits, expands as needed** (e.g. `HD-2026-009` → `HD-2026-010` → … → `HD-2026-1000`). |
| **CR-NUM-03** | Sequence is **per-tenant-per-year**, reset at the first invoice of each calendar year. Implemented via row `(tenant_id, year, next_number)` in `tenant_invoice_sequences` OR via `tenant_settings.next_invoice_number` if single-counter is preferred. **Recommendation: per-year sequence**, because year is embedded in the displayed number and accountants expect 001 on January 1. |
| **CR-NUM-04** | Allocation is **atomic** inside the create-invoice transaction: `UPDATE tenant_invoice_sequences SET next_number = next_number + 1 WHERE tenant_id=:t AND year=:y RETURNING next_number`. Concurrent inserts cannot share a number. |
| **CR-NUM-05** | Numbers are **never reused**. Voided/deleted invoices keep their number. Gaps are acceptable and audit-trail-correct. |
| **CR-NUM-06** | Numbers are allocated only on **finalize** (status transition from draft → unpaid), NOT on draft creation. Drafts carry `invoice_number = NULL` until finalized. This matches Vietnam practice where a draft is not yet a legal document. |
| **CR-NUM-07** | The frontend MUST display "Chưa cấp số" for drafts and the real number after finalize. |
| **CR-NUM-08** | Settings `invoice_prefix` change does NOT renumber existing invoices. The change only applies to invoices finalized after the change. |
| **CR-NUM-09** | Admin can override the next number forward (`>= max(used)+1`) but never backward. Validation `V-SET-03` enforces this. |
| **CR-NUM-10** | **Resolves prior conflict:** the hard-coded `'INV' + zeroPad(8)` logic in `pages/CreateInvoice.tsx` is **WRONG** and MUST be removed. The server is authoritative. |

---

## 3. Customer model & debt derivation

| ID | Rule |
|---|---|
| **CR-C-01** | `customers.tax_code` is **optional** in schema but **REQUIRED on the invoice header** when the invoice has any `tax > 0`. Server validation rejects (`V-CI-VAT-MST`) tax-bearing invoice for a customer without `taxCode` — unless an override flag `Invoice.skipMstCheck` set by ADMIN. |
| **CR-C-02** | A customer is identified for duplicate detection by `(tenant_id, lower(name), phone)`. Server warns on duplicate but allows (some shops legitimately have two divisions with the same name + phone). |
| **CR-C-03** | `Customer.status` is an enum `active|inactive`. Inactive customers do NOT appear in the picker for new invoices/quotations (server filters; FE picker uses `?status=active`). |
| **CR-C-04** | `currentDebt` is **derived** at read time from `Σ remainingBalance of non-draft, non-void open invoices`. It is NEVER stored on the customer row. |
| **CR-C-05** | **Resolves prior conflict:** the field `Customer.totalDebt` present in the prototype fixture is REMOVED from the canonical schema. All UI/services compute via the view `v_customer_debt`. |
| **CR-C-06** | Hard-delete of customer is forbidden if any invoice references them. Soft-deactivation via `status='inactive'` only. |
| **CR-C-07** | Customer fields (`name`, `phone`, `address`, `taxCode`) are **snapshotted onto every invoice and quotation at create-time**. Subsequent customer edits do NOT alter historical documents. |

---

## 4. Product model & stock semantics

| ID | Rule |
|---|---|
| **CR-P-01** | `products.price ≥ 0`, `products.stock ≥ 0` (DB CHECK). |
| **CR-P-02** | `products.unit` is free-text but constrained at the UI level to the curated list: `bao | m³ | viên | kg | thùng | cái | tấn | lít`. Adding new units is a tenant admin action. |
| **CR-P-03** | At invoice line creation, `product_name`, `unit`, and `unit_price` are **snapshotted** to the line. Subsequent product edits do NOT alter historic lines. |
| **CR-P-04** | **Stock is NOT decremented when an invoice is issued in the canonical model.** Inventory tracking is OUT OF SCOPE for v1. The `products.stock` field is informational only; the `<100` low-stock cue is a UI hint, not a business rule. A future inventory module MAY add movements; until then, stock is operator-maintained. |
| **CR-P-05** | Hard-delete of product is forbidden if any non-soft-deleted invoice line references it. Soft-deactivate via `status='inactive'`. Deactivated products do NOT appear in pickers. |
| **CR-P-06** | `products.code` is unique per tenant; auto-generated as `PROD{seq:5}` if not provided. |

---

## 5. Invoice line model

| ID | Rule |
|---|---|
| **CR-L-01** | A line has: `productId` (nullable for ad-hoc), `productName` (snapshot, required), `quantity > 0`, `unitPrice ≥ 0`, `discount ≥ 0`. |
| **CR-L-02** | **Line discount is ABSOLUTE VND**, not a percentage. (UI shall expose a "% calculator" widget that writes back the absolute value, but the stored field is absolute.) |
| **CR-L-03** | **Canonical line-total formula:** `lineTotal = quantity × unitPrice − discount`. See `financial-formulas.md` F-1. |
| **CR-L-04** | `lineTotal MUST be ≥ 0`. The constraint `discount ≤ quantity × unitPrice` (V-CI-08 / V-DISC-01) is enforced both client-side and as DB CHECK. Negative line totals are forbidden. |
| **CR-L-05** | `quantity` is decimal (some products sold by m³, kg, lít accept decimal qty). Server accepts up to 3 decimal places. |
| **CR-L-06** | Lines have a `position` integer for display order (`UNIQUE(invoice_id, position)`). |
| **CR-L-07** | Removing or editing a line is allowed only when invoice `status = 'draft'`. Otherwise 422 `DOMAIN-LINES-LOCKED`. |

---

## 6. Invoice totals

| ID | Rule |
|---|---|
| **CR-INV-01** | `subtotal = Σ lineTotal`. Recomputed server-side; client value ignored. |
| **CR-INV-02** | `invoice.discount` is ABSOLUTE VND and applies to the whole invoice. `0 ≤ discount ≤ subtotal`. |
| **CR-INV-03** | `invoice.shipping ≥ 0`. |
| **CR-INV-04** | `invoice.tax ≥ 0`. See §7 for how it is computed. |
| **CR-INV-05** | **Canonical total formula:** `total = subtotal − discount + tax + shipping`. See `financial-formulas.md` F-2. |
| **CR-INV-06** | `paidAmount` = Σ of non-reversed payments on this invoice (DB invariant + recomputed on each payment). `paidAmount ≥ 0` and `paidAmount ≤ total`. |
| **CR-INV-07** | `remainingBalance = total − paidAmount`. Stored and CHECK-constrained: `remaining_balance = total - paid_amount`. |
| **CR-INV-08** | All money fields use `NUMERIC(18, 2)`; arithmetic via decimal library; rounding **HALF_EVEN** ("banker's rounding") at the final step of any aggregation that produces a displayed value. |

---

## 7. Tax calculation

| ID | Rule |
|---|---|
| **CR-TAX-01** | Default tax base is the **discounted subtotal**: `taxBase = subtotal − discount`. (Vietnamese VAT practice for standard 10% VAT on a discounted sale.) |
| **CR-TAX-02** | **Canonical tax formula when `autoTax = true`:** `tax = round_half_even(taxBase × taxRate / 100, 0)`. `taxRate` from `tenant_settings.default_tax_rate` (typically 8 or 10). |
| **CR-TAX-03** | When `autoTax = false`, `tax` is operator-entered absolute VND amount. `0 ≤ tax`. No upper bound enforced (some shops apply zero VAT for export). |
| **CR-TAX-04** | Per-invoice override of `taxRate` is allowed via `Invoice.taxRateOverride` (decimal 0–100). If present, used instead of tenant default for auto-tax. Audited on every change. |
| **CR-TAX-05** | Per-line tax (different products at different rates) is **OUT OF SCOPE for v1**. All lines on one invoice share the same tax rate. A future enhancement may introduce `InvoiceItem.taxRate`. |
| **CR-TAX-06** | Tax change after invoice creation is allowed only when `status = 'draft'`. |
| **CR-TAX-07** | Currency rounding: per-invoice tax is rounded to the nearest VND (no decimals). |
| **CR-TAX-08** | **Resolves prior conflict:** the Settings page exposes `taxRate` and `autoTax`. The CreateInvoice screen MUST honour them (currently does not — see ISSUE-010). Backend MUST enforce: if `autoTax` is on for the tenant AND the request omits `tax`, compute via F-3. |

---

## 8. Payment model & payment allocation

| ID | Rule |
|---|---|
| **CR-PAY-01** | A payment has: `amount > 0`, `paymentDate ≤ today + 1 day`, `method ∈ {cash, bank_transfer, check, other}`, `reference` (string), `note` (string). |
| **CR-PAY-02** | Payments are **append-only**. There is no edit. To correct a mistake, ADMIN issues a **reversal payment** (`amount` negative is NOT allowed; instead use `type='reversal'` field on the payment row referencing the original payment by `reverses_payment_id`). |
| **CR-PAY-03** | **Reversal payment rule (canonical):** a reversal payment has `amount > 0` (same magnitude as the original) AND `reverses_payment_id` set. Its NET effect on `paidAmount` is **negative**: `paidAmount += sum(non-reversal) − sum(reversal where reverses != null)`. |
| **CR-PAY-04** | `Idempotency-Key` is REQUIRED on `POST /invoices/:id/payments`. Server stores `(tenant_id, key) → response` in Redis 24 h. Replays return the cached response. |
| **CR-PAY-05** | Payment IDs are server-generated UUIDs. The prototype's `'PAY' + Date.now()` pattern is FORBIDDEN. |
| **CR-PAY-06** | `reference` is REQUIRED when `method = 'bank_transfer'` or `'check'` (CR-PAY-06.a). Validation `V-PAY-06` enforces. |
| **CR-PAY-07** | Cannot add payment when invoice `status = 'draft'` (422 `DOMAIN-DRAFT-PAYMENT`) or `status = 'void'` (422) or `remainingBalance = 0` (422 `DOMAIN-PAID-PAYMENT`). |
| **CR-PAY-08** | A single payment cannot exceed `remainingBalance`. Over-payment is forbidden — operator must split or take customer deposit via a separate "credit balance" feature (out of scope v1). |
| **CR-PAY-09** | **Payment allocation rule (canonical):** the system uses a **single-invoice allocation** model. A payment ALWAYS belongs to exactly one invoice. There is no "payment-on-account" or multi-invoice allocation in v1. (Future: customer credit balance + auto-allocation FIFO.) |
| **CR-PAY-10** | `paymentDate` may be in the past (recording cash received yesterday). Future-dating beyond +1 day is forbidden (V-PAY-03). |
| **CR-PAY-11** | After a payment commits, the server MUST recompute `paid_amount`, `remaining_balance`, and `status` atomically and emit `payment.create` + (if status changed) `invoice.status_change` audit entries. |
| **CR-PAY-12** | The recomputation of `status` uses the canonical function in §9 / `status-lifecycle.md`. |

---

## 9. Invoice status lifecycle (canonical)

> Full state diagram and transition matrix: see `status-lifecycle.md`. The summary below is normative.

| ID | Rule |
|---|---|
| **CR-S-01** | The invoice status field `status` carries one **payment-state** value: `draft | unpaid | partial | paid | void`. The values `overdue` is **NO LONGER a status value in the canonical model** — see CR-S-02. |
| **CR-S-02** | **Resolves prior conflict (RULE-004):** "overdue" is modelled as a separate **derived flag** `isOverdue : boolean`, NOT as a status. This lets the system express "partial + overdue" without losing the "partial" payment-state. |
| **CR-S-03** | `isOverdue = (status IN {unpaid, partial} AND remaining_balance > 0 AND due_date < today_tenant_tz)`. Recomputed at read time (cheap) AND nightly cron updates `invoices.is_overdue_cached` for filter/sort efficiency. |
| **CR-S-04** | **Canonical status function:** `calculateStatus(total, paidAmount, isDraft, isVoid)`: <br>• `isVoid` → `'void'`<br>• `isDraft` → `'draft'`<br>• `paidAmount = 0` → `'unpaid'`<br>• `0 < paidAmount < total` → `'partial'`<br>• `paidAmount ≥ total` → `'paid'`. Past-due-ness is OUTSIDE this function. |
| **CR-S-05** | Allowed transitions: `(none) → draft`, `(none) → unpaid` (when finalized directly), `draft → unpaid` (finalize), `unpaid → partial` (first partial payment), `unpaid → paid` (single full payment), `partial → paid`, `* → void` (ADMIN). No backwards transitions. `paid → *` is forbidden. |
| **CR-S-06** | Frontend StatusBadge displays the combined label: e.g. `partial` invoice past-due renders **"Thanh toán một phần · Quá hạn"** (two pills or a single pill + small overdue dot). |
| **CR-S-07** | All status changes are auditable as `invoice.status_change` with `before/after` and a `cause_json` reference (which payment, which finalize action, which void). |

---

## 10. Overdue rule (date math, time zone)

| ID | Rule |
|---|---|
| **CR-OVR-01** | "Today" for overdue evaluation = `(now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date`. Server is the single source of truth. |
| **CR-OVR-02** | `isOverdue = (status IN {unpaid, partial}) AND (remaining_balance > 0) AND (due_date < today_tenant_tz)`. Note **strict `<`** — an invoice due **today is NOT overdue**. |
| **CR-OVR-03** | A draft invoice is NEVER overdue, even if its `due_date < today`. Drafts are not receivables. |
| **CR-OVR-04** | A void invoice is NEVER overdue. |
| **CR-OVR-05** | A paid invoice is NEVER overdue (even if it was paid late — that information is in the `paid_at` derived value vs. `due_date`). |
| **CR-OVR-06** | A daily cron at **00:05 Asia/Ho_Chi_Minh** refreshes `invoices.is_overdue_cached` and emits `invoice.status_change` audit row for each row that flips. |
| **CR-OVR-07** | On every list/detail read, the server recomputes the live `is_overdue` boolean for the returned rows (cheap). |
| **CR-OVR-08** | **Resolves prior conflicts:** the prototype's `store.updateOverdueStatuses` partially conflated overdue with status (RULE-004, ISSUE-007). It is REPLACED by the cron + on-read evaluation above. |

---

## 11. Receivables aggregation (canonical view)

| ID | Rule |
|---|---|
| **CR-DEBT-01** | An invoice is "open" if `status IN {unpaid, partial} AND remaining_balance > 0 AND deleted_at IS NULL`. Drafts and voids are excluded everywhere. |
| **CR-DEBT-02** | `currentDebt(customer) = Σ remaining_balance over open invoices of that customer`. |
| **CR-DEBT-03** | `unpaidInvoicesCount(customer) = COUNT(*) of open invoices`. |
| **CR-DEBT-04** | `overdueInvoicesCount(customer) = COUNT(*) of open invoices where is_overdue = true`. |
| **CR-DEBT-05** | **Single canonical view** `v_customer_debt` (Postgres) returns `(tenant_id, customer_id, customer_name, total_debt, unpaid_count, overdue_count, bucket_0_30, bucket_31_60, bucket_61_90, bucket_90_plus)`. Defined in `database/database-dictionary.md` and reproduced in `financial-formulas.md` F-8. |
| **CR-DEBT-06** | All screens (Dashboard, Debts page, Reports aging, Customer detail) MUST query this same view. No client-side bucketing is allowed. |
| **CR-DEBT-07** | **Resolves prior conflicts:** RULE-001 (3 vs 4 buckets) and RULE-002 (drafts in totalDebt) are resolved here in favour of the canonical view. |

---

## 12. Aging buckets — 4 canonical buckets

| ID | Rule |
|---|---|
| **CR-AGE-01** | The CANONICAL aging is **4 buckets**: `0-30`, `31-60`, `61-90`, `90+` days past due. |
| **CR-AGE-02** | Bucket function (applied per open invoice): `daysPastDue = (today_tenant_tz - due_date)::int`. <br>• `daysPastDue ≤ 30` → `0-30` (includes not-yet-due — but those are filtered before bucketing? See CR-AGE-03).<br>• `31 ≤ daysPastDue ≤ 60` → `31-60`<br>• `61 ≤ daysPastDue ≤ 90` → `61-90`<br>• `daysPastDue > 90` → `90+` |
| **CR-AGE-03** | **Not-yet-due invoices ARE included in the `0-30` bucket** (they have `daysPastDue ≤ 0 ≤ 30`). This matches industry-standard accounts-receivable aging where `current` and `1–30` are conventionally merged into a single column. (If finance team wants a separate "not yet due" column, add bucket `not_due` for `daysPastDue ≤ 0`.) |
| **CR-AGE-04** | Bucket "as-of" date is parameterizable via `?asOf=YYYY-MM-DD` (default today, must be ≤ today). |
| **CR-AGE-05** | Reports module, Debts module, and Dashboard pie chart ALL render the same 4 buckets. The Dashboard pie may visually collapse `0-30` and `not_due` to 3 segments if real estate is constrained, but the underlying data is always 4 (or 5 if `not_due` is split). |
| **CR-AGE-06** | The grand total of aging amounts = `Σ remaining_balance over open invoices` = `currentDebt(tenant)`. Verified by an integration test. |

---

## 13. Quotation model & lifecycle

| ID | Rule |
|---|---|
| **CR-Q-01** | A quotation has the **same line model and same totals breakdown as an invoice** (resolves RULE-011): `items[]`, `subtotal`, `discount`, `tax`, `shipping`, `total`. Allows lossless conversion. |
| **CR-Q-02** | Quotation status: `draft | sent | accepted | rejected | expired`. |
| **CR-Q-03** | Quotation number format = `BG-{YYYY}-{NNN}`, same allocation pattern as invoices (per-tenant-per-year sequence), allocated on the `send` action (NOT on draft creation). |
| **CR-Q-04** | `validUntil ≥ issueDate` (V-Q-02). |
| **CR-Q-05** | Lifecycle transitions: `(none) → draft`, `draft → sent`, `sent → accepted`, `sent → rejected`, `sent → expired` (auto), `* → cloned (new draft)`. No backwards. `accepted → converted` (terminal, see §14). |
| **CR-Q-06** | A quotation in `sent` AND `validUntil < today_tenant_tz` is **auto-expired** by the same nightly cron + on-read evaluation. |
| **CR-Q-07** | A quotation in `expired` cannot be accepted. Customer must request a new quote (clone → edit → send). |
| **CR-Q-08** | Edits to a quotation are allowed only when `status = 'draft'`. |

---

## 14. Quotation conversion to invoice

| ID | Rule |
|---|---|
| **CR-CONV-01** | Eligibility: `status = 'accepted' AND converted_invoice_id IS NULL`. |
| **CR-CONV-02** | Idempotent: the conversion endpoint requires `Idempotency-Key`; concurrent calls return the same invoice. |
| **CR-CONV-03** | Atomic transaction: INSERT invoice (status='unpaid', number allocated per §2) + INSERT invoice_items (copied verbatim, NEW IDs, new `position`) + UPDATE quotations SET converted_invoice_id = invoice.id + INSERT audit_log. |
| **CR-CONV-04** | Snapshots: customer_name/phone/address/tax_code copied from current customer record at conversion time (NOT from the quotation snapshot — customer may have updated their address). |
| **CR-CONV-05** | Default invoice dates at conversion: `issue_date = today`, `due_date = today + tenant_settings.default_due_days`. |
| **CR-CONV-06** | Default `notes` prefix: `"Từ báo giá {quotationNumber}"` then the quotation's notes. |
| **CR-CONV-07** | Once converted, the quotation is locked (PATCH 422 `DOMAIN-QUOTE-LOCKED`). Status stays `accepted`. |
| **CR-CONV-08** | Conversion audit: `quotation.convert` + `invoice.create` with `cause_json = {type:'quotation.convert', quotation_id}`. |

---

## 15. Dashboard aggregations

| ID | Rule |
|---|---|
| **CR-DASH-01** | "Doanh thu tháng này" KPI = **Σ payments.amount where payment_date in current calendar month (tenant TZ) AND payment is NOT a reversal**. This is **cash-basis collection** and the label MUST say `"Đã thu tháng này"` (clarity over the prototype's ambiguous `"Tổng doanh thu"`). |
| **CR-DASH-02** | "Tổng công nợ phải thu" KPI = `currentDebt(tenant)` from `v_customer_debt`. Excludes drafts and voids by definition (resolves RULE-002 / ISSUE-003). |
| **CR-DASH-03** | "Hóa đơn chưa thanh toán" KPI = `COUNT(open invoices)` where `status IN {unpaid, partial}`. |
| **CR-DASH-04** | "Hóa đơn quá hạn" KPI = `COUNT(open invoices WHERE is_overdue = true)`. Note: an invoice is counted here regardless of whether it's `unpaid` or `partial`. |
| **CR-DASH-05** | MoM trend = `(thisMonthPaid − lastMonthPaid) / lastMonthPaid`. If `lastMonthPaid = 0`, render `—` (not infinity). Formula `F-9`. |
| **CR-DASH-06** | 6-month revenue series = 6 rows `(month_label, invoiced, paid)` for the trailing 6 calendar months including current. `invoiced = Σ invoice.total WHERE issue_date IN month AND status ≠ 'void' AND status ≠ 'draft'`; `paid = Σ payment.amount WHERE payment_date IN month AND reverses_payment_id IS NULL`. Formula `F-10`. |
| **CR-DASH-07** | Aging pie segments = the 4 canonical buckets from `v_customer_debt`, summed across customers. |
| **CR-DASH-08** | Recent invoices list = top 5 by `issue_date DESC, created_at DESC` filtered by `status ≠ 'void'`. Drafts ARE included so the operator sees their work-in-progress. |
| **CR-DASH-09** | Dashboard endpoint is `GET /api/v1/dashboard/summary` and returns the entire bundle (one round trip). Cached in Redis 60s per tenant; invalidated on `invoice.create | finalize | void`, `payment.create`. |

---

## 16. Reporting formulas

| ID | Rule |
|---|---|
| **CR-RPT-01** | "Top N customers" metric is configurable via `?basis=paid|invoiced` (default `paid` — matches dashboard label). Both bases are formally defined in `financial-formulas.md` F-11 / F-12. |
| **CR-RPT-02** | Monthly revenue report MUST show BOTH `invoiced` and `paid` series side-by-side, so the operator can see the gap (= `outstanding`). |
| **CR-RPT-03** | Aging report MUST use the canonical 4 buckets (CR-AGE-01). |
| **CR-RPT-04** | Aging report grand total MUST equal `currentDebt(tenant)`. An integration test verifies this every CI run. |
| **CR-RPT-05** | All report endpoints support `?from=YYYY-MM-DD&to=YYYY-MM-DD`; default = last 6 months. Server enforces `to ≤ today AND from ≤ to AND (to − from) ≤ 5 years`. |
| **CR-RPT-06** | Report cache TTL 5 min per `(tenant, reportCode, paramHash)`. Invalidated on the same events as the dashboard. |
| **CR-RPT-07** | Export jobs (`xlsx | pdf`) are async via BullMQ; signed URL TTL 15 min; audited as `report.export`. |
| **CR-RPT-08** | All money columns in exports use the same `Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'})` formatting as the UI for readability; raw numbers are NOT used in the printable report. |

---

## 17. Idempotency & concurrency

| ID | Rule |
|---|---|
| **CR-IDP-01** | All financial-mutation POSTs require `Idempotency-Key: <uuid v4>`. Server stores `(tenant_id, key, request_hash) → response` for 24 h in Redis. Replays with same key + same body → cached response. Replays with same key + different body → 422 `DUPLICATE-KEY-MISMATCH`. |
| **CR-IDP-02** | All PATCH / PUT endpoints require `If-Match: <ISO updated_at>`. Mismatch → 409 `CONFLICT-VERSION`. |
| **CR-IDP-03** | Optimistic concurrency on `invoices` covers paid_amount/remaining_balance/status. Concurrent payments to the same invoice are serialized via a row-level lock (`SELECT … FOR UPDATE`) in the payment service. |
| **CR-IDP-04** | Quotation `convert` is idempotent via `Idempotency-Key` AND a unique constraint on `quotations.converted_invoice_id IS NOT NULL` enforced via a unique partial index. |
| **CR-IDP-05** | Template `set-default` uses a transactional swap (unset all, set one) under serializable isolation OR a partial unique index `WHERE is_default`. |

---

## 18. Default values from Settings (consumption rules)

| ID | Rule |
|---|---|
| **CR-SET-01** | `tenant_settings.invoice_prefix` is consumed by invoice numbering (§2). |
| **CR-SET-02** | `tenant_settings.default_due_days` is consumed by `CreateInvoice` to compute default `dueDate = issueDate + N days`. Also consumed at quotation conversion (CR-CONV-05). |
| **CR-SET-03** | `tenant_settings.default_tax_rate` + `auto_tax` are consumed by tax calculation (§7). |
| **CR-SET-04** | `tenant_settings.auto_email`: on `invoice.finalize`, if true AND `customer.email` exists, enqueue an email-send job with the PDF attached. |
| **CR-SET-05** | `tenant_settings.payment_reminder`: on `invoice.finalize`, schedule a reminder email for `due_date − 3 days` (skip if past). On `invoice.status_change → overdue`, enqueue an escalation email. Both subject to the customer not having unsubscribed. |
| **CR-SET-06** | `user_notification_prefs.*`: consumed by the notifications producer when deciding whether to write an in-app notification row for each event. |
| **CR-SET-07** | Settings save endpoints use `If-Match` optimistic concurrency (CR-IDP-02). |

---

## 19. Soft-delete / void / retention

| ID | Rule |
|---|---|
| **CR-DEL-01** | All business tables (`invoices`, `customers`, `products`, `quotations`, `templates`) carry `deleted_at TIMESTAMPTZ NULL`. Soft delete only. |
| **CR-DEL-02** | `payments` and `audit_logs` are append-only. No `deleted_at`. To "delete" a payment, ADMIN issues a reversal (CR-PAY-03). |
| **CR-DEL-03** | Hard-delete is forbidden for any row referenced by another row. UI surfaces this as 409 `CONFLICT-DELETE` with a friendly explanation. |
| **CR-DEL-04** | Invoice retention = **10 years** (Vietnam tax record requirement). The retention worker NEVER hard-deletes invoice or payment rows within this window. |
| **CR-DEL-05** | PII anonymization (PDPL right-to-erasure) is performed by replacing `customer_name/phone/email/address` with hashed placeholders while preserving the financial integrity. Only allowed AFTER the 10-year retention has elapsed for all of that customer's invoices. |
| **CR-DEL-06** | `invoice.void` (ADMIN) preserves the invoice row and number; sets `status='void'`, `remaining_balance = 0`; inserts reversal payments cancelling out any prior payments; emits a `cause_json = {reason}`. The voided number is NEVER reused. |

---

## 20. Cross-rule invariants (server CHECK + integration tests)

These invariants MUST hold at all times. Each is enforced by a DB CHECK constraint AND an integration test in CI:

| ID | Invariant |
|---|---|
| **INV-1** | `subtotal = Σ invoice_items.line_total` for each invoice |
| **INV-2** | `line_total = quantity × unit_price − discount` for each line; `line_total ≥ 0` |
| **INV-3** | `total = subtotal − discount + tax + shipping` |
| **INV-4** | `paid_amount = Σ payments.amount where payment.invoice_id = invoice.id AND reverses_payment_id IS NULL − Σ payments.amount where reverses_payment_id IS NOT NULL` |
| **INV-5** | `0 ≤ paid_amount ≤ total` |
| **INV-6** | `remaining_balance = total − paid_amount` |
| **INV-7** | `status` consistent with `calculateStatus(total, paid_amount, isDraft, isVoid)` |
| **INV-8** | At most one `templates` row per tenant has `is_default = true` |
| **INV-9** | `quotations.valid_until ≥ quotations.issue_date` |
| **INV-10** | `quotations.converted_invoice_id` is unique (a quotation converts at most once) |
| **INV-11** | A `payments` row with `reverses_payment_id` references a payment of the same invoice and same amount |
| **INV-12** | `invoices.invoice_number` is unique per tenant; format matches `{prefix}{YYYY}-\d{3,}` |
| **INV-13** | A draft invoice has `invoice_number IS NULL`; a non-draft invoice has `invoice_number IS NOT NULL` |
| **INV-14** | `Σ aging buckets per tenant = currentDebt(tenant)` |
| **INV-15** | An invoice whose customer has `taxCode IS NULL` AND `invoice.tax > 0` is rejected unless `Invoice.skip_mst_check = true` AND the caller is ADMIN |

---

## 21. Conflict resolutions (overrides from prior docs)

This section explicitly resolves every conflict identified in `gap-analysis/inconsistent-business-rules.md`. Where this file conflicts with a prior doc, **this file wins** and the prior doc is to be updated.

| Conflict | Prior docs | Canonical resolution |
|---|---|---|
| Invoice numbering literal vs Settings | ISSUE-001, RULE-005 | **CR-NUM-02..10**: per-tenant-per-year sequence, format `{prefix}{YYYY}-{NNN}`, allocated on finalize, server-atomic. |
| 3 vs 4 aging buckets | RULE-001 | **CR-AGE-01**: 4 buckets `0-30 | 31-60 | 61-90 | 90+`. Single view `v_customer_debt` used everywhere. |
| Drafts in totalDebt | RULE-002, ISSUE-003 | **CR-DEBT-01**: drafts excluded from "open invoices" everywhere. |
| Status `overdue` conflated with `partial` | RULE-004, ISSUE-007 | **CR-S-01..03**: `overdue` is a derived boolean flag, not a status value. Status enum reduced to `draft | unpaid | partial | paid | void`. |
| Mixed revenue basis (cash vs accrual) | RULE-003 | **CR-DASH-01, CR-DASH-06, CR-RPT-01..02**: explicit `paid` vs `invoiced` series; KPI label is `"Đã thu tháng này"`. |
| Hard-coded `+12.5%` trend | ISSUE-004 | **CR-DASH-05**: computed MoM via formula F-9. |
| `defaultDueDays` setting ignored | RULE-006 | **CR-SET-02**: consumed by CreateInvoice and quotation conversion. |
| `autoTax / taxRate` settings ignored | RULE-007, ISSUE-010 | **CR-TAX-01..08**: explicit tax base, formula, override. |
| `Customer.totalDebt` duplicated as stored field | RULE-008, ISSUE-027 | **CR-C-04..05**: field removed; always derived. |
| `reference` not required for bank_transfer | RULE-009 | **CR-PAY-06**: required for bank_transfer and check. |
| Discount semantics percentage vs absolute | RULE-010 | **CR-L-02 / CR-INV-02**: absolute VND, with optional UI % calculator. |
| Quotation lacks tax/shipping breakdown | RULE-011 | **CR-Q-01**: full breakdown mirrors invoice. |
| Server lacks cron for overdue / quotation expiry | RULE-012 | **CR-OVR-06 / CR-Q-06**: nightly cron + on-read evaluation. |
| Overdue KPI definition ambiguity | RULE-013 | **CR-DASH-04**: counts open invoices with `is_overdue = true`. |
| `/menu` route inconsistency | RULE-014 | (FE-only; not in this canonical file; tracked in `gap-analysis/known-issues.md` ISSUE-005.) |
| "Còn lại" display inconsistency | RULE-015 | (FE-only.) |
| Status pill colour drift between modules | RULE-016 | (FE-only; design-system task.) |
| Glossary "Ngày đến hạn" vs "Hiệu lực đến" | RULE-017 | (Documentation task — both labels are correct in context.) |
| KPI cards juxtaposition confusion (unpaid vs overdue) | RULE-018 | **CR-DASH-04** clarifies; FE tooltip recommended. |
| Settings `nextNumber` disconnected from real numbering | RULE-020 | **CR-NUM-09**: admin override allowed only forward; server enforces V-SET-03. |

---

## 22. Document governance

- **Owner:** Solution architect (initial), then Tech lead.
- **Change process:** any change to a CR-* rule requires a numbered ADR in `docs/adr/`.
- **Versioning:** semantic — major bump if a CR-* changes meaning; minor bump for additions; patch for wording clarifications.
- **Distribution:** linked from every module SRS in `docs/modules/*.md`, every API contract in `docs/api-contracts/*.md`, and every workflow in `docs/workflows/*.md`.
- **Compliance:** the CI integration suite covers every INV-* invariant; PRs that break an invariant are blocked.

---

## 23. Cross-references

- `domain-reconciliation/financial-formulas.md` — F-1..F-12 referenced above.
- `domain-reconciliation/status-lifecycle.md` — formal state machine + transition matrix for invoice and quotation.
- `database/database-dictionary.md` — DB schema with CHECK constraints implementing INV-1..INV-15.
- `api-contracts/*.md` — endpoints whose validation/audit/computation MUST conform to this file.
- `qa/validation-rules.md` — validation codes (V-CI-*, V-PAY-*) tied to specific CR-* rules.
- `gap-analysis/inconsistent-business-rules.md` — historical record of conflicts; superseded by this file.
