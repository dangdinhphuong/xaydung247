# Module — Dashboard (Tổng quan)

**Source:** `src/app/pages/Dashboard.tsx`.

---

## 1. Purpose
Single-screen daily overview: KPIs + 6-month revenue trend + debt-aging distribution + 5 most-recent invoices.

## 2. Business description
First page after login. Drives attention to overdue receivables and surfaces recent activity.

## 3. Actors
ADMIN, ACCOUNTANT, MANAGER (VIEWER recommended).

## 4. Trigger conditions
Navigate to `/`.

## 5. Main workflow
1. `store.getInvoices()` (auto-overdue evaluation).
2. Compute KPIs:
   - `monthlyRevenue` = Σ `paidAmount` for invoices whose `issueDate.getMonth()` and `getFullYear()` match current.
   - `totalDebt` = Σ `remainingBalance` across all invoices.
   - `unpaidCount` = count where `status ∉ {paid, draft}`.
   - `overdueCount` = count where `status === 'overdue'`.
3. Render:
   - 4 `SummaryCard`s.
   - 6-month revenue LineChart (currently hard-coded `revenueData`).
   - 3-segment aging PieChart (currently hard-coded `debtDistributionData`).
   - "Hóa đơn gần đây" = invoices sorted desc by `issueDate`, top 5.

---

## 6. KPI cards

| Card | Value | Icon | Colour | Trend |
|---|---|---|---|---|
| Tổng doanh thu tháng này | `formatCurrency(monthlyRevenue)` | DollarSign | green | hard-coded "+12.5%" — must compute MoM |
| Tổng công nợ phải thu | `formatCurrency(totalDebt)` | TrendingUp | orange | — |
| Hóa đơn chưa thanh toán | integer | FileText | blue | — |
| Hóa đơn quá hạn | integer | AlertCircle | red | — |

## 7. Recent invoices table columns
Mã hóa đơn (link), Khách hàng, Ngày tạo (`lg:` only), Tổng tiền, Còn lại, Trạng thái.

## 8. Business rules

| ID | Rule |
|---|---|
| BR-DASH-01 | `monthlyRevenue` uses **`paidAmount`** of invoices issued in the current calendar month (cash basis collected, not invoiced). |
| BR-DASH-02 | `totalDebt` includes ALL non-zero remaining balances regardless of status (incl. drafts — possible bug; drafts have `remainingBalance == total`). Recommend excluding drafts to match `/debts`. |
| BR-DASH-03 | `unpaidCount` excludes `paid` AND `draft`. |
| BR-DASH-04 | Recent invoices are the latest 5 by `issueDate` desc. |
| BR-DASH-05 | "+12.5%" trend on the first KPI card is hard-coded in JSX — replace with computed MoM in production. |

## 9. Edge cases
- New tenant with zero invoices → KPIs all 0; recent-invoices section empty (no empty-state UI). Recommend a "Welcome — issue your first invoice" panel.
- Drafts inflate `totalDebt` — see BR-DASH-02.

## 10. API contract (recommended)
`GET /api/dashboard/summary` → `{ monthlyRevenue, monthlyRevenueTrend, totalDebt, unpaidCount, overdueCount, revenueSeries[6], agingSeries[3], recentInvoices[5] }`.

## 11. Permission rules
All authenticated roles. Production: optionally restrict the KPI numbers by role (e.g. SALES sees only their own metrics).
