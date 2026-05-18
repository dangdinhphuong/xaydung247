# State Management Strategy — Invoice Pro

> How state is managed today, what is wrong with the current approach, and the recommended migration path.

---

## 1. Current state-management model

**[VERIFIED]** The prototype uses **three layers** of state:

### Layer A — Local component state (`useState`)
Pages and components own ephemeral UI state: form inputs, modal open/closed, search query, filter values.

Examples [VERIFIED]:
- `InvoiceList.tsx` — `searchQuery`, `statusFilter`, `isFilterOpen`, `selectedInvoiceForPayment` (the last one is **dead state** — never assigned).
- `CreateInvoice.tsx` — `customerId`, `issueDate`, `dueDate`, `notes`, `items`, `discount`, `tax`, `shipping`.
- `PaymentModal.tsx` — `amount`, `paymentDate`, `method`, `reference`, `note`, `error`.

### Layer B — Singleton "global" state (`DataStore`)
**[VERIFIED]** `src/app/data/store.ts` is a TypeScript class instantiated once at module load. Holds four arrays (`invoices`, `payments`, `customers`, `products`). Exposes synchronous read methods and synchronous write methods that mutate the arrays in place.

### Layer C — Re-cached page state
**[VERIFIED]** Some pages copy the store state into `useState` for local convenience, then manually re-sync:
- `InvoiceDetail.tsx` line 28: `const [invoice, setInvoice] = useState(store.getInvoice(id!))`.
- After a payment is added, it manually calls `setInvoice(store.getInvoice(id!))` to refresh.

This pattern creates **two sources of truth** — see LIM-STATE-02.

---

## 2. Problems with the current model

**[VERIFIED]** issues observable in code:

| Problem | Mechanism | Symptom |
|---|---|---|
| Singleton is not reactive | No `subscribe()` / pub-sub | Other mounted pages (Dashboard sidebar counts) do not refresh after a mutation in another page |
| No query cache | Each page re-reads & re-computes on every render | Derived KPIs recompute on every keystroke in unrelated inputs |
| No mutation lifecycle | No `isLoading` / `error` returned by mutation | UI cannot disable submit while pending |
| Hand-rolled form state | Pages don't use `react-hook-form` (although installed) | Inconsistent validation, dirty-state, reset semantics |
| Dead state | `selectedInvoiceForPayment` declared but never written | Code smell; ISSUE-025 / TD-012 |
| Direct fixture import bypassing store | `DebtManagement`, `CustomerManagement`, `Reports` import `customers` from `mockData.ts` directly | Future mutations to customers won't be seen on those pages |

---

## 3. Recommended target model

### Tier 1 — Server state: **TanStack Query (React Query) v5**
For all data that originates from (or will originate from) the backend: invoices, customers, products, payments, quotations, templates, settings, notifications.

Why:
- Built-in caching, request de-duplication, background refetch, optimistic updates.
- `useQuery` / `useMutation` API maps cleanly onto the existing `store.method()` calls.
- Works with the in-memory adapter today and the HTTP adapter tomorrow without page changes.
- Mutation-side `invalidateQueries(['invoices'])` triggers re-render of all subscribers automatically — fixes the staleness problem.

### Tier 2 — UI / ephemeral state: **Zustand or React Context**
For state that does not need to be persisted and that crosses a few components: theme, sidebar collapsed/open, mobile menu open/closed, global toasts.

Why:
- Tiny footprint.
- Selector-based subscriptions avoid unnecessary re-renders.

### Tier 3 — Form state: **react-hook-form + Zod**
For every form (Create invoice, Add payment, Settings, future Customer/Product/Quotation forms).

Why:
- Already in deps (`react-hook-form 7.55.0`).
- Built-in `formState.isSubmitting`, `formState.isDirty`, `formState.errors`.
- Zod schemas double as runtime validators and TypeScript types — keeps client/server validation in sync.

---

## 4. Migration plan (incremental)

### Step 1 — Wrap the existing store in an adapter interface
Introduce `src/app/api/InvoicePort.ts`:
```ts
export interface InvoicePort {
  list(): Promise<Invoice[]>;
  get(id: string): Promise<Invoice | undefined>;
  create(input: CreateInvoiceInput): Promise<Invoice>;
  addPayment(input: AddPaymentInput): Promise<Invoice>;
}
```
Provide `inMemoryAdapter.ts` wrapping today's `store.ts`. Pages still import a façade `api`, not the store.

### Step 2 — Introduce TanStack Query
Wrap `App.tsx` in `<QueryClientProvider>`. Define hooks `useInvoices()`, `useInvoice(id)`, `useCreateInvoice()`, `useAddPayment()`. Replace direct `store.getInvoices()` calls with `useInvoices()`.

### Step 3 — Replace re-cached page state
In `InvoiceDetail.tsx`, drop `useState(store.getInvoice(id!))` and use `const { data: invoice } = useInvoice(id!)`. Remove `setInvoice` after mutations — `useAddPayment` will invalidate `['invoice', id]` and `['invoices']`.

### Step 4 — Adopt react-hook-form + Zod across forms
One form per PR. Replace ad-hoc validation with Zod schemas. The schemas become the source of truth for `qa/validation-rules.md`.

### Step 5 — Add the HTTP adapter
When the backend exists, write `httpAdapter.ts` implementing `InvoicePort` via `fetch`. Swap adapters via a config switch. No page changes.

### Step 6 — Remove direct `mockData.ts` imports from pages
The remaining direct imports in `DebtManagement`, `CustomerManagement`, `Reports` go away — they read via TanStack Query against the same adapter.

---

## 5. Mutation lifecycle (target)

```
User clicks "Tạo hóa đơn"
   │
   ▼
useCreateInvoice.mutate(input)
   │
   ├─► mutation.status = 'pending'    → submit button disabled, spinner shown
   │
   ├─► adapter.create(input)          → in-memory OR HTTP
   │
   ├─► on success:
   │     ├─► queryClient.invalidateQueries(['invoices'])
   │     ├─► queryClient.invalidateQueries(['debts'])
   │     ├─► queryClient.invalidateQueries(['dashboard'])
   │     ├─► toast.success('Tạo hóa đơn thành công!')
   │     └─► navigate(`/invoices/${createdInvoice.id}`)
   │
   └─► on error:
         ├─► toast.error(...)
         └─► mutation.status = 'error' → keep form state for retry
```

**[RECOMMENDED]** Every mutation hook MUST also include:
- An optional idempotency key (`crypto.randomUUID()`) sent to backend.
- Optimistic update for snappy UX where safe.
- Rollback on error.

---

## 6. Cache-invalidation matrix

Which mutations invalidate which queries:

| Mutation | Invalidates |
|---|---|
| `createInvoice` | `['invoices']`, `['dashboard']`, `['debts']`, `['reports','top-customers']` |
| `addPayment` | `['invoice', id]`, `['invoices']`, `['dashboard']`, `['debts']`, `['reports','revenue']`, `['reports','top-customers']` |
| `createCustomer / updateCustomer` | `['customers']`, `['debts']` (if affects open invoices) |
| `createProduct / updateProduct` | `['products']` |
| `createQuotation / convertQuotation` | `['quotations']`, `['invoices']` (on conversion), `['dashboard']` |
| `updateSettings` | `['settings']` |
| `setDefaultTemplate` | `['templates']` |

---

## 7. Subscription model for "background" features

| Feature | Mechanism (RECOMMENDED) |
|---|---|
| Sidebar overdue badge count | Subscribe to `['dashboard','overdueCount']` query |
| Notification bell unread count | WebSocket subscription OR poll every 60 s |
| "Hóa đơn quá hạn" KPI freshness | Automatic via `staleTime: 60_000` on `useInvoices` |
| Cross-tab synchronization | TanStack Query's `broadcastQueryClient` or `BroadcastChannel` integration |

---

## 8. Server-truth vs. client-computed values

Define explicitly which derived values are computed on the server vs. client:

| Value | Computed by | Rationale |
|---|---|---|
| `Invoice.status` | Server | Authoritative; nightly cron recomputes. Client may also recompute for instant feedback after a payment, but the next refetch is authoritative. |
| `Invoice.remainingBalance` | Server | Same. |
| `Customer.totalDebt` (current) | Server (or DB view) | Avoids client iterating all invoices. |
| Dashboard KPIs | Server | One `GET /api/dashboard/summary` endpoint returns the bundle. |
| Aging buckets per customer | Server (`v_customer_debt`) | Single source of truth. |
| Top-5 customers | Server | Sortable by columns the server understands. |
| Line `lineTotal` | Client preview + server validation | Client computes for UX; server is authoritative. |

---

## 9. Anti-patterns to avoid going forward

- ❌ Reading from `store.ts` AND `useQuery` for the same entity in different places.
- ❌ Copying server state into `useState` and mutating it locally without invalidating the query.
- ❌ Computing aging buckets in three different files with three different bucket definitions (RULE-001).
- ❌ Using `useEffect` to "fetch" data when `useQuery` exists.
- ❌ Coupling components to the singleton `store` directly — always go through hooks.

---

## 10. Related documents

- `architecture/mock-data-strategy.md` — how the fixtures feed into the store today.
- `architecture/missing-persistence-layer.md` — backend persistence.
- `architecture/missing-backend-components.md` — the HTTP service that the adapter will eventually talk to.
- `gap-analysis/technical-debt.md` — TD-001, TD-002, TD-013, TD-017.
- `qa/validation-rules.md` — Zod schemas should become the source of truth.
