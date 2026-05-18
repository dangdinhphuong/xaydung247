# Future Architecture — Debt / Receivables (Công nợ)

---

## 1. Current Frontend Implementation [VERIFIED]

- Route `/debts` → `pages/DebtManagement.tsx`.
- Computes per-customer rollup in the browser: `Σ remainingBalance` of non-draft invoices, overdue count, **3 aging buckets** (`0-30`, `31-60`, `61+`).
- Drilldown dialog lists open invoices for the chosen customer with status badges and invoice links.
- Reads `customers` directly from `mockData.ts` and `invoices` from `store`.

## 2. Missing Backend Requirements [RECOMMENDED]

- Server-side computation via `v_customer_debt` view (resolve performance + correctness).
- Unify aging buckets to **4 buckets** (`0-30`, `31-60`, `61-90`, `90+`) — resolve RULE-001 / LIM-BR-04.
- Tenant-scoped, role-gated read endpoint.
- Optional drilldown endpoint returning per-customer open invoices.

## 3. Recommended API Design [RECOMMENDED]

| Verb | Path | Query | Response |
|---|---|---|---|
| GET | `/api/debts/summary` | `asOf?` | `{ totalDebt, debtorCount, overdueCount, perCustomer: DebtInfo[] }` |
| GET | `/api/debts/customers/:id/invoices` | — | `Invoice[]` (open only) |

Permission: `Debt:read`.

## 4. Recommended Database Tables [RECOMMENDED]

No new tables. Uses:
- View `v_open_invoices` (`status != 'draft' AND remaining_balance > 0`).
- View `v_customer_debt` (canonical aging with 4 buckets, per `architecture/missing-persistence-layer.md` §3).

## 5. Recommended Auth Flow [RECOMMENDED]

- `JwtAuthGuard` + `@RequirePermission('Debt:read')`.
- SALES role excluded by default (sensitive financial overview).

## 6. Recommended Validation Strategy [RECOMMENDED]

- Read-only; `asOf` validated as ISO date in `tenant_tz`.

## 7. Recommended Audit Logging [RECOMMENDED]

- Reads not audited (high volume).
- Exports audited (`debt.export`).

## 8. Recommended State Persistence [RECOMMENDED]

- FE: `useQuery(['debts','summary', asOf])`, `useQuery(['debts','customer', id])`.
- Invalidate on `payment.create`, `invoice.create`, `invoice.status_change`.
- Cache TTL 60 s; `staleTime: 60_000`.
