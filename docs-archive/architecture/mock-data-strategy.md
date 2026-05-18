# Mock Data Strategy — Invoice Pro

> Description of how the prototype simulates a populated system, and how the mock data layer should evolve as real persistence is introduced.

---

## 1. Purpose of mock data in this prototype

The fixtures in `src/app/data/mockData.ts` exist to:

1. **[VERIFIED]** Provide a believable, realistic dataset for stakeholder demos in the Vietnamese construction-materials domain (xi măng, cát, đá, gạch, sắt thép, sơn).
2. **[VERIFIED]** Exercise every invoice status (`draft`, `unpaid`, `partial`, `paid`, `overdue`) so the StatusBadge component is visible across the lifecycle.
3. **[VERIFIED]** Cross-reference customers, products, invoices, and payments so derived views (debt aging, top customers, recent invoices) compute meaningful values.
4. **[INFERRED]** Document the intended schema by example — the literal arrays double as a fixture and a typed sample.

---

## 2. Inventory of mock data

**[VERIFIED]** Exported from `src/app/data/mockData.ts`:

| Export | Shape | Count | Notes |
|---|---|---|---|
| `customers` | `Customer[]` | 5 | All `status='active'`. Total debts: 0–120,000,000 VND. |
| `products` | `Product[]` | 10 | 5 categories (Xi măng, Cát, Đá, Gạch, Sắt thép, Sơn). Two with stock <100 (low-stock cue). |
| `payments` | `Payment[]` | 5 | Across methods: cash (2), bank_transfer (3). |
| `invoices` | `Invoice[]` | 8 | Statuses: 1 draft, 1 unpaid, 3 partial, 1 paid, 2 overdue. |
| `quotations` | `Quotation[]` | 2 | 1 sent, 1 accepted. |

---

## 3. How mock data feeds the runtime

**[VERIFIED]** `src/app/data/store.ts` constructor:

```ts
private invoices: Invoice[] = JSON.parse(JSON.stringify(initialInvoices));
private payments: Payment[] = JSON.parse(JSON.stringify(initialPayments));
private customers: Customer[] = JSON.parse(JSON.stringify(initialCustomers));
private products: Product[] = JSON.parse(JSON.stringify(initialProducts));
```

- Deep clone via JSON round-trip protects the seed module from mutation by the running app.
- The `store` instance is created once per module load → effectively once per browser tab session.

**[VERIFIED]** Quotations are NOT loaded into the store. `QuotationManagement.tsx` imports `quotations` directly from `mockData.ts`. Therefore quotations are read-only at runtime.

**[VERIFIED]** Some pages bypass the store and import `customers` directly from `mockData.ts`:

- `pages/DebtManagement.tsx` line 24.
- `pages/CustomerManagement.tsx` line 15.
- `pages/Reports.tsx` line 14.

This means **customer mutations would not be reflected on those pages** until they switch to `store.getCustomers()`. See `gap-analysis/technical-debt.md` TD-011.

---

## 4. Shape of each mock entity

**[VERIFIED]** from `src/app/types.ts`:

### Customer
```ts
{ id, name, phone, email, address, taxCode?, totalDebt, status: 'active'|'inactive', createdAt }
```
Note: `totalDebt` is stored on the fixture but the UI computes `currentDebt` separately — see LIM-DATA-03 / RULE-008.

### Product
```ts
{ id, name, category, unit, price, stock, description? }
```

### InvoiceItem
```ts
{ id, productId, productName, quantity, unitPrice, discount, lineTotal }
```
`productName` is a **snapshot** of the product at line-creation time.

### Payment
```ts
{ id, invoiceId, amount, paymentDate, method: 'cash'|'bank_transfer'|'check'|'other', reference?, note? }
```

### Invoice
```ts
{
  id, invoiceNumber,
  customerId, customerName, customerPhone, customerAddress,  // snapshots
  issueDate, dueDate,
  status: 'draft'|'unpaid'|'partial'|'paid'|'overdue',
  items: InvoiceItem[],
  subtotal, discount, tax, shipping, total,
  paidAmount, remainingBalance,
  notes?, payments: Payment[]
}
```

### Quotation
```ts
{
  id, quotationNumber, customerId, customerName,
  issueDate, validUntil,
  status: 'draft'|'sent'|'accepted'|'rejected'|'expired',
  items: InvoiceItem[],   // reuses the line shape
  total, notes?
}
```
Note: Quotation has only `total`, no subtotal/discount/tax/shipping breakdown — see RULE-011.

---

## 5. Snapshot patterns embedded in the mock data

**[VERIFIED]** The fixtures encode two important "snapshot at issue" patterns:

| Field | Pattern | Reason |
|---|---|---|
| `Invoice.customerName / customerPhone / customerAddress` | Copied from the customer at create time | Historic invoices remain stable when customer details later change. |
| `InvoiceItem.productName` | Copied from the product at line-create time | Historic lines remain stable when the product is renamed. |
| `Invoice.payments[]` | Embedded array of Payment objects | Convenient for the SPA; in a real DB this would be a separate table. |

The future backend MUST preserve these snapshot semantics — see `database/database-dictionary.md`.

---

## 6. Mock-data invariants (intended)

These should hold across the fixture set and across any future real data:

| Invariant | [VERIFIED] in fixture? | Code that asserts it |
|---|---|---|
| `subtotal = Σ items.lineTotal` | Yes for all 8 seeds | Recomputed in `CreateInvoice.tsx` |
| `total = subtotal − discount + tax + shipping` | Yes | Same |
| `paidAmount = Σ payments.amount where payment.invoiceId == invoice.id` | Yes | Recomputed in `store.addPayment` |
| `remainingBalance = total − paidAmount` | Yes | Same |
| `status` consistent with `calculateStatus(total, paidAmount, dueDate)` | Yes for current seed dates | `store.updateOverdueStatuses` |

If the seed is edited, these invariants must be re-verified manually (no test enforces them).

---

## 7. Operational tips for working with the mock data

| Need | How (current prototype) |
|---|---|
| Reset to seed | F5 to reload the tab. |
| Add a new customer durably | Edit `mockData.ts:customers` and reload. |
| Add a draft invoice for testing | `/invoices/create` → "Lưu nháp". Lasts until reload. |
| Simulate an overdue invoice | Edit a seed invoice's `dueDate` in `mockData.ts` to a past date. |
| Inspect store state at runtime | Open DevTools console; `import` the singleton is not exposed — recommend adding `window.store = store` for debugging in dev only. |

---

## 8. Evolution path — replacing mock data with real persistence

### Stage 1 — Today: Mock-data Architecture
- Fixtures in `mockData.ts`.
- Singleton `DataStore` mutates in-memory copies.
- No remote calls.

### Stage 2 — Local persistence (optional intermediate)
- Keep `DataStore` but persist its arrays to `localStorage` after every mutation.
- Useful for showing reviewers that "their" demo state survives a refresh.
- **NOT** a path to multi-user — `localStorage` is per-browser.

### Stage 3 — API-shimmed store
- Convert `DataStore` methods to return Promises.
- Implement two adapters:
  - `inMemoryAdapter` (current behavior, kept for tests / Storybook).
  - `httpAdapter` (calls a real backend).
- Pages do not change.

### Stage 4 — Reactive query layer
- Replace direct `store.method()` calls with TanStack Query hooks (`useInvoices()`, `useInvoice(id)`, `useAddPayment()`).
- Mutations invalidate relevant queries.
- See `architecture/state-management-strategy.md`.

### Stage 5 — Real backend with seeded environments
- Backend exposes `POST /api/dev/seed` to load the same fixture (suitably tenant-scoped) for staging / preview / demo environments.
- `mockData.ts` becomes the canonical demo seed shared by FE Storybook and BE seeding.

---

## 9. Cautions

- **Don't import `mockData.ts` from new pages.** Always go through the store; this keeps the migration path simple.
- **Don't add behavior to `mockData.ts`.** It must remain a pure data fixture.
- **Don't rely on mock IDs in tests.** Use the seed IDs only for documentation examples; real tests should create their own fixtures.
- **Don't ship `mockData.ts` to production tenants.** Seed data is for dev / demo only; production tenants start empty.

---

## 10. Related documents

- `architecture/current-architecture.md` — overall picture.
- `architecture/state-management-strategy.md` — how to evolve `DataStore` into a reactive query layer.
- `architecture/missing-persistence-layer.md` — backend persistence design.
- `database/database-dictionary.md` — target schema.
- `gap-analysis/technical-debt.md` — TD-001, TD-011, TD-024 (mock-data-related debts).
