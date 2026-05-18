# Future Architecture — Reports (Báo cáo)

> See also `architecture/missing-reporting-engine.md` for the full reporting design.

---

## 1. Current Frontend Implementation [VERIFIED]

- Route `/reports` → `pages/Reports.tsx`.
- Monthly revenue bar chart — hard-coded series (LIM-RPT-01).
- Top-5 customers table — computed from real `paidAmount` per customer.
- Aging analysis table — hard-coded series (LIM-RPT-03).
- Export buttons (PDF / Excel) — **no handlers**.
- No date-range controls.

## 2. Missing Backend Requirements [RECOMMENDED]

- Real aggregation against the DB.
- Date-range filter on every report.
- 4-bucket aging (unify with `/debts`, resolves RULE-001).
- Asynchronous export pipeline (BullMQ + S3 + signed URL).

## 3. Recommended API Design [RECOMMENDED]

| Verb | Path | Query | Permission |
|---|---|---|---|
| GET  | `/api/reports/revenue` | `from, to, groupBy=month\|week\|day` | `Report:read` |
| GET  | `/api/reports/top-customers` | `from, to, limit=5, basis=paid\|invoiced` | `Report:read` |
| GET  | `/api/reports/aging` | `asOf` | `Report:read` |
| GET  | `/api/reports/product-revenue` | `from, to, dimension=product\|category` | `Report:read` |
| GET  | `/api/reports/payment-methods` | `from, to` | `Report:read` |
| GET  | `/api/reports/forecast` | `weeks=8` | `Report:read` |
| POST | `/api/reports/export` | `{report, format, params}` → `{jobId}` | `Report:export` |
| GET  | `/api/jobs/:id` | — | (caller's job only) |

## 4. Recommended Database Tables / Views [RECOMMENDED]

- `v_monthly_revenue`, `v_customer_debt`, `v_top_customers`, `v_aging_buckets` — all per-tenant.
- For multi-million-row tenants, materialised views refreshed nightly.

## 5. Recommended Auth Flow [RECOMMENDED]

- `JwtAuthGuard` + `@RequirePermission('Report:read'|'Report:export')`.
- SALES denied; VIEWER allowed.

## 6. Recommended Validation Strategy [RECOMMENDED]

- All date params validated as ISO `YYYY-MM-DD` in `Asia/Ho_Chi_Minh`.
- `groupBy`, `basis`, `format` enum.
- `limit` capped at 100.

## 7. Recommended Audit Logging [RECOMMENDED]

- Reads not audited (volume).
- `report.export` audited with params.

## 8. Recommended State Persistence [RECOMMENDED]

- FE: `useQuery(['reports', code, params], { staleTime: 60_000 })`.
- Server cache in Redis 5 min per `(tenant, reportCode, paramHash)`.
- Cache invalidation on `payment.create`, `invoice.create`, `invoice.status_change`.
