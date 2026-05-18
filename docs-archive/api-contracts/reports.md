# API Contract — Reports & Exports

> **[RECOMMENDED]** — see `architecture/missing-reporting-engine.md`, `future-architecture/reports.md`.

---

## GET `/dashboard/summary`
- **Permission:** `Dashboard:read`.
- **Response 200:**
```json
{
  "monthlyRevenue":      { "value": "..", "basis": "paid", "periodLabel": "T5/2026" },
  "monthlyRevenueTrend": { "momPct": 12.5, "isPositive": true },
  "totalDebt":           { "value": "..", "excludesDrafts": true },
  "unpaidCount": 42,
  "overdueCount": 9,
  "revenueSeries":       [{ "month": "T12/2025", "invoiced": "..", "paid": ".." }, "...×6"],
  "agingSeries":         [{ "label": "0-30", "amount": ".." }, "...×4"],
  "recentInvoices":      [ Invoice, ... ×5 ]
}
```
- **Cache:** Redis 60 s per tenant.

---

## GET `/reports/revenue`
- **Permission:** `Report:read`.
- **Query:** `?from=YYYY-MM-DD&to=YYYY-MM-DD&groupBy=month|week|day`.
- **Response 200:**
```json
{
  "series": [ { "label":"T5/2026", "invoiced":"..", "paid":".." }, ... ],
  "totals": { "invoiced":"..", "paid":"..", "outstanding":".." }
}
```

## GET `/reports/top-customers`
- **Permission:** `Report:read`.
- **Query:** `?from=&to=&limit=5&basis=paid|invoiced`.
- **Response 200:** `{ data: [ { customerId, customerName, invoices, revenue } ] }`.

## GET `/reports/aging`
- **Permission:** `Report:read`.
- **Query:** `?asOf=YYYY-MM-DD`.
- **Response 200:**
```json
{
  "buckets": [
    { "label":"0-30",  "count":3, "amount":".." },
    { "label":"31-60", "count":2, "amount":".." },
    { "label":"61-90", "count":2, "amount":".." },
    { "label":"90+",   "count":1, "amount":".." }
  ],
  "total": ".."
}
```

## GET `/reports/product-revenue`
- **Query:** `?from=&to=&dimension=product|category`.

## GET `/reports/payment-methods`
- **Query:** `?from=&to=`.

## GET `/reports/forecast`
- **Query:** `?weeks=8`.

---

## POST `/reports/export`
- **Permission:** `Report:export`.
- **Rate-limit:** 5/min per user.
- **Request:** `{ report: "revenue|top-customers|aging|product-revenue|payment-methods|forecast", format: "xlsx|pdf", params: { ... } }`.
- **Response 202:** `{ jobId }`.
- **Audit:** `report.export`.

## GET `/jobs/:jobId`
- **Permission:** caller-owned.
- **Response 200:**
```json
{ "id":"...", "status":"queued|running|done|failed", "signedUrl":"...|null", "expiresAt":"...|null", "error":"...|null" }
```

---

## Validation
- `from` / `to` / `asOf` strict ISO; ≤ today + 1.
- `from ≤ to`; `to − from ≤ 5 years`.
- `groupBy`, `basis`, `format`, `dimension` strict enums.
- `limit` capped at 100.

---

## Cache invalidation
On `invoice.create / .void / .status_change` and `payment.create`, server purges Redis keys `report:<tenant>:*`.

---

## Related
- `architecture/missing-reporting-engine.md`
- `future-architecture/reports.md`
- `modules/reports.md`
