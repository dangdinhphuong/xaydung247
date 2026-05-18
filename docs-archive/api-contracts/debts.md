# API Contract — Debts / Receivables

> **[RECOMMENDED]** — see `future-architecture/debts.md`.

---

## `DebtInfo` shape
```json
{
  "customerId": "uuid",
  "customerName": "...",
  "totalDebt": "111000000",
  "unpaidInvoicesCount": 2,
  "overdueInvoicesCount": 1,
  "aging": {
    "bucket0_30":  "0",
    "bucket31_60": "30000000",
    "bucket61_90": "0",
    "bucket90":    "81000000"
  }
}
```

> Note: 4-bucket canonical aging (resolves RULE-001 inconsistency between current `/debts` 3-bucket and `/reports` 4-bucket).

---

## GET `/debts/summary`
- **Permission:** `Debt:read`.
- **Query:** `?asOf=YYYY-MM-DD` (default = today, tenant TZ).
- **Response 200:**
```json
{
  "totalDebt": "...",
  "debtorCount": 4,
  "overdueCount": 2,
  "perCustomer": [ DebtInfo, ... ]
}
```

Backed by view `v_customer_debt` (see `database/database-dictionary.md`).

---

## GET `/debts/customers/:id/invoices`
- **Permission:** `Debt:read`.
- **Response 200:** `{ data: Invoice[] }` — non-draft invoices with `remainingBalance > 0`, sorted by `dueDate` ascending.

---

## Caching
- Server: Redis 60 s per `(tenant, asOf)`.
- Frontend: `useQuery(['debts','summary', asOf], { staleTime: 60_000 })`.
- Invalidation: on `payment.create`, `invoice.create`, `invoice.void`, `invoice.status_change`.

---

## Permission notes

| Role | `Debt:read` |
|---|---|
| ADMIN | ✓ |
| ACCOUNTANT | ✓ |
| MANAGER/VIEWER | ✓ (recommended) |
| SALES | — (sensitive financial overview) |

---

## Audit
Reads not audited (high volume). Exports audited as `debt.export`.

---

## Related
- `modules/debts.md`
- `future-architecture/debts.md`
- `database/database-dictionary.md` → view `v_customer_debt`
