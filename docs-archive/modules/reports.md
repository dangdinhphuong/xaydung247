# Module — Reports (Báo cáo)

**Source:** `src/app/pages/Reports.tsx`, `src/app/data/store.ts`.

---

## 1. Purpose
Provide management-grade summaries: monthly revenue trend, top customers, and aged-debt analysis.

## 2. Business description
Three independent reports rendered on a single page. Each report has a "Xuất PDF" / "Xuất Excel" button (UI present, **no handlers wired** — gap).

## 3. Actors
ADMIN, ACCOUNTANT (full + export).
MANAGER / VIEWER (read + export).

---

## 4. Submodules (reports)

### 4.1 Báo cáo doanh thu theo tháng (Monthly revenue report)
- **Chart:** stacked BarChart, X = month label (`T9/2025` … `T2/2026`), Y = VND in millions.
- **Series:**
  - `revenue` (blue `#1E88E5`) — total invoiced amount.
  - `paid` (green `#4CAF50`) — collected (paid) amount.
- **KPIs below chart:**
  - Tổng doanh thu 6 tháng = Σ revenue.
  - Đã thu = Σ paid.
  - Chưa thu = Σ (revenue − paid).
- **Current data source:** hard-coded `monthlyData` array (production: derive from invoices/payments).

### 4.2 Top 5 khách hàng
- Per customer, aggregate `totalRevenue = Σ paidAmount across that customer's invoices`, `totalInvoices = count`.
- Sort desc by revenue, take top 5.
- Columns: Xếp hạng (1–5 in a blue circle), Khách hàng, Số hóa đơn, Tổng doanh thu (green).

### 4.3 Báo cáo phân tích công nợ theo thời gian (Aging analysis)
- **Buckets:** `0-30`, `31-60`, `61-90`, `90+` days.  
  ⚠ **DIFFERENT from `/debts` screen which uses 3 buckets (0-30/31-60/61+).** Reconcile in production.
- Per bucket: count, total VND, percentage of grand total.
- Trailing total row "Tổng cộng".

---

## 5. Business rules

| ID | Rule | Source |
|---|---|---|
| BR-RPT-01 | Top-customer revenue = Σ `paidAmount` (NOT `total`). | `Reports.tsx` line 32 |
| BR-RPT-02 | Top 5 are sorted desc by `revenue`. | line 40 |
| BR-RPT-03 | Aging report uses 4 buckets; Debts page uses 3. Inconsistency — recommend standardising to 4. | line 43 vs `DebtManagement.tsx` |
| BR-RPT-04 | Percentage = `amount / totalOfBuckets`, fixed to 1 decimal. | line 177 |
| BR-RPT-05 | All currency display uses `formatCurrency`. | global |
| BR-RPT-06 | Charts are non-animated and responsive. | recharts `ResponsiveContainer` |

---

## 6. Recommended additional reports

| Report | Description |
|---|---|
| Revenue by product / category | Pivot of `lineTotal` summed per `productName` or `category`. |
| Salesperson performance | Requires `salesperson` field on invoices (template already has `showSalesperson`). |
| Payment method mix | Σ payment.amount grouped by method. |
| Cash collection forecast | Sum of future-due `remainingBalance` per week. |
| Customer profitability | Revenue per customer over time window. |

---

## 7. API contract (recommended)

| Verb | Path | Query | Response |
|---|---|---|---|
| GET | `/api/reports/revenue` | `from, to, groupBy=month` | `{months: [{label, revenue, paid}]}` |
| GET | `/api/reports/top-customers` | `from, to, limit=5` | `Customer[]` with `revenue, invoices` |
| GET | `/api/reports/aging` | `asOf` | `{buckets: [{label, count, amount}], total}` |
| GET | `/api/reports/export?type=excel\|pdf&report=…` | … | binary stream |

---

## 8. UI behaviors
- BarChart tooltip formats values via `formatCurrency`.
- Y-axis tick formatter: `${value/1_000_000}M`.
- Each card has an export button (currently dummy).

## 9. Permission rules
- VIEWER may read; SALES cannot (per `roles/roles-and-permissions.md`).
- Export action emits audit event `report.export {type, report, filters}`.

## 10. Edge cases
- Zero data → divide-by-zero in percentage; guard required.
- Future date filters or empty ranges → return empty arrays; UI must show empty state.
- Time zone — always use `Asia/Ho_Chi_Minh`.

## 11. Production-readiness gaps
1. `monthlyData` and `agingData` are hard-coded. Wire to real aggregations.
2. Export buttons have no handler.
3. No date-range filter (`from`, `to`) on UI.
4. Bucket inconsistency between `/debts` and `/reports`.
