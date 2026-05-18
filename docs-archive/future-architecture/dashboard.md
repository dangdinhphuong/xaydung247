# Future Architecture — Dashboard

> Markers: **[VERIFIED]** current behavior; **[RECOMMENDED]** target.

---

## 1. Current Frontend Implementation [VERIFIED]

- Route `/` → `pages/Dashboard.tsx`.
- 4 KPI cards (monthly revenue, total receivables, unpaid count, overdue count).
- Line chart "Doanh thu 6 tháng qua" — **mock data**.
- Pie chart "Phân bổ công nợ theo thời gian" — **mock data** (3 segments).
- "Hóa đơn gần đây" — real data, last 5 invoices by `issueDate`.
- Trend chip on monthly-revenue KPI is hard-coded `+12.5%`.
- Data read synchronously from `store.getInvoices()`.

## 2. Missing Backend Requirements [RECOMMENDED]

- Single bundle endpoint that returns all dashboard data in one round trip.
- Tenant-scoped; cached in Redis 60 s.
- Drafts excluded from `totalDebt` (resolve RULE-002).
- MoM trend computed (resolve ISSUE-004).
- Aging segments unified to 4 buckets (resolve RULE-001).

## 3. Recommended API Design [RECOMMENDED]

```
GET /api/dashboard/summary  →
{
  monthlyRevenue:      { value: "12345000", basis: "paid",     periodLabel: "T5/2026" },
  monthlyRevenueTrend: { momPct: 12.5, isPositive: true },
  totalDebt:           { value: "98000000", excludesDrafts: true },
  unpaidCount:         42,
  overdueCount:        9,
  revenueSeries:       [{ month: "T12/2025", invoiced: "…", paid: "…" }, ...×6],
  agingSeries:         [{ label: "0-30", amount: "…" }, ...×4],
  recentInvoices:      Invoice[5]
}
```

Permission: `Dashboard:read` (all roles).

## 4. Recommended Database Collections / Tables [RECOMMENDED]

Reads from views:
- `v_open_invoices` (defined in `database/database-dictionary.md`).
- `v_monthly_revenue` (recommended in `architecture/missing-reporting-engine.md`).
- `v_customer_debt`.

No new write tables. Optional `dashboard_cache` materialised view per tenant if performance demands.

## 5. Recommended Auth Flow [RECOMMENDED]

- Behind `JwtAuthGuard` (or session).
- Permission `Dashboard:read`.
- `tenant_id` injected by `TenantInterceptor`.

## 6. Recommended Validation Strategy [RECOMMENDED]

- Read-only endpoint; no body validation.
- Query params (future date filter): Zod schema validating ISO dates.

## 7. Recommended Audit Logging [RECOMMENDED]

- Dashboard reads NOT audited (high volume, low value).
- Audit only `report.export` if the user exports the dashboard.

## 8. Recommended State Persistence [RECOMMENDED]

- FE: `useQuery(['dashboard'], …, { staleTime: 60_000 })`.
- Invalidate on: `invoice.create`, `payment.create`, `invoice.status_change`.
- Optimistic-update friendly: KPI numbers tolerate stale-while-revalidate.
