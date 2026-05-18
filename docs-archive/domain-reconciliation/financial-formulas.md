# Financial Formulas — Canonical Reference

> **SINGLE SOURCE OF TRUTH for every financial calculation in Invoice Pro.** Each formula is uniquely identified (`F-N`), referenced from `canonical-business-rules.md`, and MUST be implemented identically by the backend, the database views, the reports, and the frontend preview. Any deviation is a bug.

**Conventions** (apply to every formula below):

- **Money type:** decimal (`NUMERIC(18,2)`), arithmetic via decimal library (server: e.g. `decimal.js`, `BigDecimal`; DB: native numeric; FE: same library to stay consistent in previews).
- **Rounding:** **HALF_EVEN** ("banker's rounding") at the final step of any calculation that produces a displayed amount.
- **Currency:** VND has no minor unit; display rounds to whole VND.
- **Time zone:** `Asia/Ho_Chi_Minh` for every calendar comparison.
- **Today:** server-derived `(now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date`. Frontend never computes "today" for business logic.
- **Empty sums** = 0 (not `null`).

---

## F-1 · Line total

```
lineTotal = quantity × unitPrice − discount
```

- Inputs: `quantity ≥ 0` (decimal, ≤ 3 dp), `unitPrice ≥ 0`, `discount ≥ 0`.
- Invariant: `lineTotal ≥ 0`. Therefore `discount ≤ quantity × unitPrice` (enforced by `V-CI-08` / `V-DISC-01`).
- Stored in `invoice_items.line_total` and enforced by DB CHECK.
- Rounded: not rounded (intermediate); store exact decimal.

---

## F-2 · Invoice subtotal

```
subtotal = Σ invoice_items.line_total  for the invoice
```

- Recomputed server-side; client-supplied subtotal is ignored.
- Invariant `INV-1`.

---

## F-3 · Invoice tax (auto vs manual)

When `autoTax = true` (from `tenant_settings.auto_tax`, possibly overridden by `Invoice.taxRateOverride`):

```
taxBase = subtotal − invoiceDiscount
tax     = round_half_even( taxBase × taxRate / 100 , 0 )
```

- `taxRate` resolution: `Invoice.taxRateOverride` if present, else `tenant_settings.default_tax_rate`.
- `taxBase ≥ 0` (because `discount ≤ subtotal`).
- `tax ≥ 0`.

When `autoTax = false`:

```
tax = operator-entered value  (validated: 0 ≤ tax)
```

Per-line tax not supported in v1 (`CR-TAX-05`).

---

## F-4 · Invoice total

```
total = subtotal − invoiceDiscount + tax + shipping
```

- Inputs: `subtotal` (from F-2), `invoiceDiscount ≥ 0 AND ≤ subtotal`, `tax ≥ 0` (from F-3), `shipping ≥ 0`.
- Invariant `INV-3`.
- Rounded: not rounded (each input already integer VND).

---

## F-5 · Paid amount (after reversal model)

```
paidAmount = Σ p.amount  for payments p of this invoice where p.reverses_payment_id IS NULL
            − Σ p.amount  for payments p of this invoice where p.reverses_payment_id IS NOT NULL
```

- Equivalent recurrence: when a new payment commits, `paid_amount := paid_amount + amount` (forward) or `paid_amount := paid_amount − amount` (reversal).
- Invariant `INV-4`. Always recomputed inside the transaction that inserts a payment.
- Constraints: `0 ≤ paid_amount ≤ total` (INV-5).

---

## F-6 · Remaining balance

```
remainingBalance = total − paidAmount
```

- Invariant `INV-6`; DB CHECK `remaining_balance = total - paid_amount`.

---

## F-7 · Days past due

```
daysPastDue = (today_tenant_tz − dueDate)::int
```

- Strict integer days. Negative values mean "not yet due".
- Used by F-8 aging buckets and CR-OVR-02 overdue flag.

---

## F-8 · Aging bucket (per open invoice)

```
bucket(daysPastDue) =
    '0-30'   if daysPastDue ≤ 30        -- includes not-yet-due
    '31-60'  if 31 ≤ daysPastDue ≤ 60
    '61-90'  if 61 ≤ daysPastDue ≤ 90
    '90+'    if daysPastDue > 90
```

Per-customer aggregation (canonical view `v_customer_debt`):

```sql
CREATE OR REPLACE VIEW v_customer_debt AS
WITH today AS (
  SELECT (now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date AS d
),
open_inv AS (
  SELECT i.tenant_id,
         i.customer_id,
         i.id,
         i.remaining_balance,
         (SELECT d FROM today) - i.due_date AS days_past_due,
         (i.status IN ('unpaid','partial')
          AND i.remaining_balance > 0
          AND i.due_date < (SELECT d FROM today)) AS is_overdue
  FROM invoices i
  WHERE i.deleted_at IS NULL
    AND i.status IN ('unpaid','partial')
    AND i.remaining_balance > 0
)
SELECT
  c.tenant_id,
  c.id   AS customer_id,
  c.name AS customer_name,
  COALESCE(SUM(o.remaining_balance), 0)                                    AS total_debt,
  COUNT(o.id)                                                              AS unpaid_count,
  COUNT(*) FILTER (WHERE o.is_overdue)                                     AS overdue_count,
  COALESCE(SUM(o.remaining_balance) FILTER (WHERE o.days_past_due <= 30),  0) AS bucket_0_30,
  COALESCE(SUM(o.remaining_balance) FILTER (WHERE o.days_past_due BETWEEN 31 AND 60), 0) AS bucket_31_60,
  COALESCE(SUM(o.remaining_balance) FILTER (WHERE o.days_past_due BETWEEN 61 AND 90), 0) AS bucket_61_90,
  COALESCE(SUM(o.remaining_balance) FILTER (WHERE o.days_past_due > 90),   0) AS bucket_90_plus
FROM customers c
LEFT JOIN open_inv o ON o.customer_id = c.id AND o.tenant_id = c.tenant_id
WHERE c.deleted_at IS NULL
GROUP BY c.tenant_id, c.id, c.name;
```

**Invariant `INV-14`:** for any tenant, `Σ buckets = total_debt`.

---

## F-9 · Month-over-month trend (cash basis)

```
thisMonthPaid = Σ payment.amount  where date_trunc('month', payment_date AT TZ) = date_trunc('month', today_tenant_tz)
                AND p.reverses_payment_id IS NULL
                − Σ reversal payments same window
lastMonthPaid = same, for previous calendar month

momPct = (thisMonthPaid − lastMonthPaid) × 100 / lastMonthPaid    if lastMonthPaid > 0
       = NULL                                                       if lastMonthPaid = 0
```

- Frontend renders `+x.x%` (green) / `-x.x%` (red) / `—` (when NULL).
- Replaces hard-coded `+12.5%` (resolves ISSUE-004 / CR-DASH-05).

---

## F-10 · 6-month revenue series

For each of the trailing 6 calendar months (including current):

```
invoiced(month) = Σ invoice.total
                  where date_trunc('month', issue_date AT TZ) = month
                    AND status NOT IN ('void','draft')
                    AND deleted_at IS NULL

paid(month)     = Σ payment.amount
                  where date_trunc('month', payment_date AT TZ) = month
                    AND p.reverses_payment_id IS NULL
                  − Σ reversal payments same window

outstanding(month) = invoiced(month) − paid(month)
```

Note: `outstanding(month)` can be negative if a customer pre-paid an invoice issued in a prior month — that's expected and informational.

---

## F-11 · Top customers — basis = `paid` (cash)

```
revenue_paid(customer, [from, to]) =
    Σ payment.amount  for payments where p.invoice.customer_id = customer.id
                                   AND payment_date IN [from, to]
                                   AND p.reverses_payment_id IS NULL
  − Σ reversal payments same window
```

ORDER BY `revenue_paid` DESC, LIMIT N (default 5).

---

## F-12 · Top customers — basis = `invoiced` (accrual)

```
revenue_invoiced(customer, [from, to]) =
    Σ invoice.total  for invoices where invoice.customer_id = customer.id
                                   AND issue_date IN [from, to]
                                   AND status NOT IN ('void','draft')
                                   AND deleted_at IS NULL
```

ORDER BY `revenue_invoiced` DESC, LIMIT N (default 5).

---

## F-13 · Open invoice predicate

```
isOpen(invoice) =  (status IN ('unpaid','partial'))
               AND (remaining_balance > 0)
               AND (deleted_at IS NULL)
```

Used by `v_open_invoices`, `v_customer_debt`, the debts module, and the dashboard's `unpaidCount`.

---

## F-14 · Overdue predicate

```
isOverdue(invoice) =  isOpen(invoice)
                  AND (due_date < today_tenant_tz)
```

Strict `<` — invoices due today are NOT overdue.

---

## F-15 · Quotation expiry predicate

```
isQuotationExpired(quotation) = (status = 'sent') AND (valid_until < today_tenant_tz)
```

Nightly cron flips `status='expired'` and emits `quotation.expire` audit row. Same evaluation runs on-read for instant correctness.

---

## F-16 · Invoice average age to payment (per customer)

```
avgDaysToPaid(customer) =
   avg( first_full_payment_date(invoice) − issue_date )
   for invoices of this customer where status = 'paid'
```

`first_full_payment_date(invoice) = MIN(payment_date) such that running Σ payments ≥ invoice.total`.

(Used by recommended report RPT-INVOICE-AGE; out of scope for v1.)

---

## F-17 · Cash collection forecast (8-week)

For each of the next 8 ISO weeks:

```
forecast(week) = Σ remaining_balance  for open invoices where due_date IN week
```

(Used by recommended report RPT-FORECAST; out of scope for v1.)

---

## F-18 · Status from totals (canonical function)

```
calculateStatus(total, paidAmount, isDraft, isVoid):
    if isVoid:               return 'void'
    if isDraft:              return 'draft'
    if paidAmount == 0:      return 'unpaid'
    if paidAmount  < total:  return 'partial'
    if paidAmount >= total:  return 'paid'
```

`isOverdue` is derived separately by F-14 — NOT part of `status`. This resolves the prior conflation (RULE-004 / ISSUE-007 / CR-S-02).

---

## F-19 · Number allocation

Pseudocode (server, inside the same TX as the invoice insert):

```
function allocateInvoiceNumber(tenantId, year):
    UPDATE tenant_invoice_sequences
       SET next_number = next_number + 1
     WHERE tenant_id = :tenantId AND year = :year
    RETURNING next_number INTO :n

    if no row affected:
        INSERT INTO tenant_invoice_sequences (tenant_id, year, next_number)
        VALUES (:tenantId, :year, 1)
        RETURNING next_number INTO :n

    SELECT invoice_prefix INTO :prefix FROM tenant_settings WHERE tenant_id = :tenantId
    return  format('%s%s-%s', :prefix, :year, lpad(:n::text, 3, '0'))
```

Resolves ISSUE-001 / CR-NUM-02..10.

---

## F-20 · Aging grand-total integrity check (CI integration test)

```
for each tenant:
    sum_of_buckets = SELECT SUM(bucket_0_30 + bucket_31_60 + bucket_61_90 + bucket_90_plus)
                       FROM v_customer_debt WHERE tenant_id = :t
    direct_total   = SELECT COALESCE(SUM(remaining_balance), 0)
                       FROM invoices
                      WHERE tenant_id = :t
                        AND status IN ('unpaid','partial')
                        AND remaining_balance > 0
                        AND deleted_at IS NULL
    assert sum_of_buckets == direct_total
```

This is `INV-14` enforced at test time.

---

## 21. Rounding & precision notes

- **Multiplication of decimals** (e.g. taxBase × taxRate / 100) MUST use decimal library, NOT IEEE-754 float. Postgres native `NUMERIC` is exact.
- **Display** of any computed amount: final round to 0 decimals (VND).
- **Reports** use the same rounding as displayed totals so spreadsheet sums match the on-screen totals.
- **Currency conversion** (multi-currency) is **out of scope v1**. All amounts are VND.

---

## 22. Cross-reference

- All `F-N` are quoted by `canonical-business-rules.md` (the SSoT for *what*; this file is the SSoT for *how to compute*).
- DB CHECK constraints implementing the invariants are listed in `database/database-dictionary.md` and `canonical-business-rules.md` §20.
- The reporting endpoints that consume these formulas are spec'd in `api-contracts/reports.md` and `api-contracts/debts.md`.
- The status function `F-18` is the official implementation of `calculateStatus` referenced throughout `status-lifecycle.md`.
