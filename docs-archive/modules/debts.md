# Module — Debt / Receivables Management (Quản lý công nợ)

**Source:** `src/app/pages/DebtManagement.tsx`, `src/app/utils/formatters.ts:getDaysBetween/isOverdue`, `src/app/data/store.ts`.

---

## 1. Purpose
Give the merchant a single screen that aggregates **all unpaid balances per customer**, broken into **aging buckets**, so collection effort can be prioritised.

## 2. Business description
The page rolls up every non-draft invoice with `remainingBalance > 0`, groups by customer, and computes:
- **Total debt** (Σ remaining).
- **Count of unpaid invoices**.
- **Count of overdue invoices** (subset whose status is already `overdue`).
- **Aging buckets** (0–30, 31–60, 61+ days from `dueDate` to today).

A drilldown dialog lists the actual unpaid invoices per customer with payment status.

## 3. Actors
ADMIN, ACCOUNTANT (full). MANAGER / VIEWER (read).

## 4. Preconditions
At least one customer has at least one non-draft invoice with `remainingBalance > 0`.

## 5. Trigger conditions
Navigate to `/debts`.

---

## 6. Main workflow
1. Load `invoices = store.getInvoices()` (which auto-recomputes overdue).
2. For each customer in master:
   - Filter their invoices where `customerId == customer.id && remainingBalance > 0 && status != 'draft'`.
   - Sum `totalDebt = Σ remainingBalance`.
   - Count `overdueInvoicesCount` = those with `status == 'overdue'`.
   - For each open invoice, compute `daysOverdue = getDaysBetween(dueDate, today)` and bucket (BR-DEBT-01).
3. Drop customers with `totalDebt === 0`.
4. Render:
   - Summary cards: total debt, customers-with-debt, overdue count.
   - Per-customer table.
5. Eye-icon opens a Radix `Dialog`:
   - 4 metric cards: tổng nợ / HĐ chưa TT / HĐ quá hạn / tổng HĐ.
   - Table: each unpaid invoice (link to detail).

---

## 7. Columns — main table

| Column | Meaning | Sortable | Filterable | Searchable | Visibility |
|---|---|---|---|---|---|
| Khách hàng | Customer name | (rec.) | — | (rec.) | always |
| Tổng nợ | `totalDebt` (orange) | (rec.) | — | — | always |
| Số HĐ chưa TT | Count unpaid | (rec.) | — | — | always |
| HĐ quá hạn | Count overdue (red number when > 0; `-` when 0) | (rec.) | — | — | always |
| 0-30 ngày | `aging.current` (VND or `-`) | (rec.) | — | — | always |
| 31-60 ngày | `aging.thirtyDays` | (rec.) | — | — | always |
| 61+ ngày | `aging.sixtyDaysPlus` | (rec.) | — | — | always |
| Thao tác | Eye → drilldown dialog | — | — | — | always |

Empty state: "Không có công nợ nào".

---

## 8. Drilldown dialog columns

| Column | Meaning |
|---|---|
| Mã hóa đơn | Link → `/invoices/:id` (closes the dialog) |
| Ngày tạo | `formatDate(issueDate)` |
| Ngày đến hạn | `formatDate(dueDate)` |
| Tổng tiền | `total` |
| Đã thanh toán | `paidAmount` |
| Còn lại | `remainingBalance` (orange) |
| Trạng thái | `StatusBadge` |

---

## 9. Business rules

| ID | Rule | Source |
|---|---|---|
| BR-DEBT-01 | Aging bucketing uses `daysOverdue = getDaysBetween(dueDate, today)`. `≤30 → current`; `31–60 → thirtyDays`; `>60 → sixtyDaysPlus`. Not-yet-due also bucketed as `current`. | `DebtManagement.tsx` lines 52–64 |
| BR-DEBT-02 | Draft invoices are excluded from receivables. | line 35 |
| BR-DEBT-03 | Customers with `totalDebt = 0` are hidden. | line 74 |
| BR-DEBT-04 | "HĐ quá hạn" count uses the `overdue` *status*, not pure date math — which means partial payments past due are counted (status moves `partial → overdue` in `calculateStatus`). | lines 43, store.ts |
| BR-DEBT-05 | Top-level summary cards reduce per-customer numbers (total debt, debtor count, overdue count). | lines 76–80 |
| BR-DEBT-06 | Aging buckets in Reports module (Reports.tsx) use 0-30 / 31-60 / 61-90 / 90+ — DIFFERENT from this screen. Reconcile in production. | `Reports.tsx` lines 43–48 |

---

## 10. UI behaviors
- Total debt cell coloured `text-orange-600` and bold.
- Overdue count red when > 0; renders `-` otherwise.
- Drilldown dialog max-width `4xl` and includes a DialogDescription for accessibility.

## 11. API contract (recommended)

| Verb | Path | Response |
|---|---|---|
| GET  | `/api/debts/summary` | `{ totalDebt, debtorCount, overdueCount, perCustomer: DebtInfo[] }` |
| GET  | `/api/debts/customers/:id/invoices` | `Invoice[]` (open only) |

## 12. Permission rules
See `roles/roles-and-permissions.md`.

## 13. Notifications (recommended)
- Daily digest to `ACCOUNTANT`: customers crossing into `31–60` or `61+` buckets.
- Send reminder email to customer X days before / after due date.

## 14. Edge cases
- A customer with multiple open invoices spanning all 3 buckets: all three columns will show values; total = sum of all buckets.
- `dueDate == today` → bucket `current` (because `isOverdue` is strict `<`).
- A partially paid invoice with `dueDate < today` shows `status='overdue'` and feeds the bucket that matches its days-overdue.
