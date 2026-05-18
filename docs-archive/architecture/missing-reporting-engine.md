# Missing Reporting Engine — Invoice Pro

> The reporting module's charts use **hard-coded mock data** (**[VERIFIED]** in `src/app/pages/Reports.tsx` and `src/app/pages/Dashboard.tsx`). Only the Top-5-customers table and `Dashboard.tsx` KPIs derive from real data. This document is the **[RECOMMENDED]** target reporting engine.

---

## 1. Current state (verified)

**[VERIFIED]** in `src/app/pages/Reports.tsx`:

| Report | Data source today |
|---|---|
| Monthly revenue bar chart (6 months) | Hard-coded `monthlyData` literal — `T9/2025`..`T2/2026`, fixed `revenue` and `paid` numbers |
| Top-5 customers table | Computed from real `store.getInvoices()` — `Σ paidAmount` per customer, sorted desc |
| Aging analysis table (4 buckets: 0-30, 31-60, 61-90, 90+) | Hard-coded `agingData` literal — fixed counts and amounts |

**[VERIFIED]** in `src/app/pages/Dashboard.tsx`:

| Widget | Data source today |
|---|---|
| Monthly revenue KPI | Σ `paidAmount` for invoices issued this calendar month — real data |
| Total receivables KPI | Σ `remainingBalance` across all invoices — real data (but inflates with drafts; see RULE-002) |
| Unpaid / overdue counts | Real, derived from invoice status |
| Trend `+12.5%` chip | Hard-coded literal |
| 6-month revenue line chart | Hard-coded `revenueData` |
| Aging distribution pie | Hard-coded `debtDistributionData` (3 segments) |
| Recent invoices table | Real, top 5 by issueDate desc |

Consequences:
- The reports module is decorative — opening a new tenant in production with zero data still shows the same charts.
- Aging-bucket inconsistency between `/debts` (3 buckets) and `/reports` (4 buckets) — see RULE-001.
- Different "Tổng doanh thu" definitions across widgets (cash vs accrual) — see RULE-003.

---

## 2. Target reporting catalog

**[RECOMMENDED]** reports (Phase 1 = required for parity; Phase 2 = post-MVP):

### 2.1 Phase 1 (required parity)

| Code | Report | Inputs | Aggregation |
|---|---|---|---|
| RPT-REV-MONTH | Doanh thu theo tháng | Date range | Σ invoice.total by month (accrual) AND Σ payment.amount by month (cash) |
| RPT-TOP-CUST | Top N khách hàng | Date range, N, basis (paid|invoiced) | GROUP BY customer, ORDER BY metric DESC |
| RPT-AGING | Phân tích công nợ theo thời gian | As-of date | 4 buckets: 0-30, 31-60, 61-90, 90+ |
| RPT-DASH-SUMMARY | Dashboard summary bundle | — | Monthly revenue, total debt (excl. drafts), unpaid count, overdue count, MoM trend, 6-mo trend series, 3-segment aging |

### 2.2 Phase 2 (recommended)

| Code | Report | Purpose |
|---|---|---|
| RPT-PRODUCT | Doanh thu theo sản phẩm / danh mục | Pivot of `invoice_items.line_total` by product / category |
| RPT-SALES | Doanh thu theo nhân viên kinh doanh | Requires `salesperson_user_id` populated |
| RPT-METHOD | Phương thức thanh toán | Σ `payment.amount` by method |
| RPT-FORECAST | Dự báo thu tiền | Σ `remaining_balance` by week of `due_date` |
| RPT-CUST-PROF | Lợi nhuận / khách hàng | Per-customer P&L over time (if cost data exists) |
| RPT-LATE-FEE | Tổng phạt chậm thanh toán | (future, if late-fee feature is built) |
| RPT-INVOICE-AGE | Tuổi hóa đơn trung bình đến khi thanh toán | `Σ (paid_at − issue_date) / N` per customer |

---

## 3. Recommended computation strategy

### 3.1 Compute server-side, cache aggressively
- All reports computed via DB queries (Postgres views + on-demand SQL).
- Response cached in Redis with key `report:<tenant>:<reportCode>:<paramHash>` for 5 min (override `Cache-Control: no-store` for fresh-required cases).
- Invalidation: on `invoice.create | payment.create | …`, the relevant cache keys are evicted (pattern delete `report:<tenant>:*`).

### 3.2 Two bases for revenue
Document explicitly:
- **Accrual** ("Tổng doanh thu" = invoiced): Σ `invoice.total` where `issue_date IN [from, to)`.
- **Cash** ("Đã thu" = collected): Σ `payment.amount` where `payment_date IN [from, to)`.

Both bases shown side-by-side on chart series.

### 3.3 Single canonical aging definition
**[RECOMMENDED]** 4 buckets: `0-30`, `31-60`, `61-90`, `90+`, computed by:
```sql
CASE
  WHEN CURRENT_DATE - due_date <= 30 THEN '0-30'
  WHEN CURRENT_DATE - due_date <= 60 THEN '31-60'
  WHEN CURRENT_DATE - due_date <= 90 THEN '61-90'
  ELSE '90+'
END
```
All screens (Dashboard pie, Debts table, Aging report) MUST use the same definition (resolves RULE-001).

### 3.4 MoM trend
Replace hard-coded "+12.5%" with:
```sql
WITH m AS (
  SELECT
    SUM(CASE WHEN payment_date >= date_trunc('month', CURRENT_DATE) THEN amount ELSE 0 END) AS cur,
    SUM(CASE WHEN payment_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
              AND payment_date <  date_trunc('month', CURRENT_DATE)              THEN amount ELSE 0 END) AS prev
  FROM payments WHERE tenant_id = :tenant
)
SELECT CASE WHEN prev = 0 THEN NULL ELSE (cur - prev) * 100.0 / prev END AS mom_pct FROM m;
```
UI shows `+x.x%` (green) / `-x.x%` (red) / `—` (when prev = 0).

---

## 4. API surface (recommended)

| Verb | Path | Query | Response |
|---|---|---|---|
| GET | `/api/dashboard/summary` | — | Full bundle for `/` |
| GET | `/api/reports/revenue` | `from, to, groupBy=month\|week\|day` | `{ series: [{label, invoiced, paid}], totals: {invoiced, paid, outstanding} }` |
| GET | `/api/reports/top-customers` | `from, to, limit=5, basis=paid\|invoiced` | `Customer[]` with metrics |
| GET | `/api/reports/aging` | `asOf` | `{ buckets: [{label, count, amount}], total }` |
| GET | `/api/reports/product-revenue` | `from, to, dimension=product\|category` | `[{label, qty, revenue}]` |
| GET | `/api/reports/payment-methods` | `from, to` | `[{method, amount, count}]` |
| GET | `/api/reports/forecast` | `weeks=8` | `[{weekStart, dueAmount, customers}]` |
| POST | `/api/reports/export` | `{report, format: xlsx\|pdf, params}` | `{jobId}` (async); poll `GET /api/jobs/:id` |

All endpoints respect tenant isolation + `Report:read` permission + `Report:export` permission.

---

## 5. Async export pipeline

**[RECOMMENDED]**:

```
Client → POST /api/reports/export {report, format, params}
        ← 202 Accepted {jobId}
            │
            ▼
        BullMQ queue 'reports'
            │
            ▼
       Export worker
            ├─ load aggregated data via report service
            ├─ render XLSX via exceljs / PDF via Puppeteer
            ├─ upload to S3 (key: tenants/<tenantId>/exports/<userId>/<jobId>.xlsx)
            └─ update job status
            │
            ▼
        Client polls GET /api/jobs/:id
            ← 200 {status: 'done', signedUrl, expiresAt}
        Client downloads
```

Notes:
- Signed URLs TTL 15 min.
- Audit-log every export (`report.export`).
- Per-user rate limit: 5 exports / min.
- Large exports (>10k rows) chunk-streamed.

---

## 6. UI changes required in the existing SPA

1. **Replace hard-coded series** in `Reports.tsx` and `Dashboard.tsx` with calls to `/api/reports/*` and `/api/dashboard/summary`.
2. **Add a date-range filter** (presets: this month / last month / YTD / last 12 months / custom).
3. **Unify aging buckets** — share a `<AgingChart buckets={...}/>` component between Dashboard, Debts, and Reports.
4. **Wire export buttons** to `POST /api/reports/export` and show progress / download link.
5. **Empty state** — when the tenant has no data, show "Chưa có dữ liệu báo cáo" + CTA "Tạo hóa đơn đầu tiên".
6. **Loading skeleton** — chart placeholder while fetching.

---

## 7. Performance considerations

- Reports query against indexes on `(tenant_id, issue_date)`, `(tenant_id, payment_date)`, `(tenant_id, due_date)`.
- For multi-million-row tenants, pre-aggregate into materialised views refreshed nightly:
  ```sql
  CREATE MATERIALIZED VIEW mv_daily_revenue AS
    SELECT tenant_id, date_trunc('day', issue_date) AS d, SUM(total) AS invoiced FROM invoices GROUP BY 1, 2;
  ```
- TanStack Query `staleTime: 60_000` on the FE to avoid spammy refetches.

---

## 8. Reporting accuracy guarantees

| Guarantee | How |
|---|---|
| Numbers reconcile across screens | Single SQL source per metric; same view used by Dashboard, Debts, Reports. |
| Drafts excluded from receivables everywhere | `v_open_invoices` view enforces `status != 'draft'`. |
| Money types are decimal, not float | DB `NUMERIC(18,2)`, wire JSON as string, FE `Intl.NumberFormat`. |
| Time-zone correctness | All dates evaluated in Asia/Ho_Chi_Minh; stored TIMESTAMPTZ in UTC. |
| MoM and YoY exact | Computed from canonical view; no hand-rolled rolling averages. |

---

## 9. Pre-launch checklist for reporting

- [ ] Replace `monthlyData`, `agingData`, `debtDistributionData` literals with real API calls.
- [ ] Fix MoM trend (no more `+12.5%`).
- [ ] Resolve aging-bucket inconsistency (RULE-001) by adopting 4 buckets everywhere.
- [ ] Resolve `totalDebt` drafts inclusion (RULE-002).
- [ ] Document revenue basis on each widget (RULE-003).
- [ ] Wire export endpoints.
- [ ] Build empty-state, loading-state, error-state.
- [ ] Confirm performance under 10⁵ invoices.
- [ ] Audit `report.export` events.

---

## 10. Related documents

- `modules/reports.md` — module SRS.
- `modules/dashboard.md` — module SRS.
- `gap-analysis/inconsistent-business-rules.md` — RULE-001, RULE-002, RULE-003.
- `gap-analysis/known-issues.md` — ISSUE-003, ISSUE-004.
- `architecture/missing-backend-components.md` — async worker for exports.
- `architecture/missing-persistence-layer.md` — views and materialised views.
