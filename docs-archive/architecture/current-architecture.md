# Current Architecture — Invoice Pro

> Description of the architecture **as it actually exists today**, derived strictly from the source code. Markers: **[VERIFIED]** observed in code; **[INFERRED]** deduced from context; **[RECOMMENDED]** never appears in this file — see `future-architecture/` instead.

---

## 1. One-line summary

A **single-page React application built with Vite, persisted entirely in browser memory via a singleton class, seeded from TypeScript fixture files at module load.**

---

## 2. Layered view (current)

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser (the only runtime)                                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Presentation layer                                          │  │
│  │   src/app/pages/*.tsx          (15 page components)         │  │
│  │   src/app/components/*.tsx     (cards, modals, sidebar...)  │  │
│  │   src/app/components/ui/*.tsx  (ShadCN-style Radix wrappers)│  │
│  └─────────────────────────┬──────────────────────────────────┘  │
│                            │ direct function calls               │
│  ┌─────────────────────────▼──────────────────────────────────┐  │
│  │ Business-logic helpers (stateless)                          │  │
│  │   src/app/utils/invoiceCalculations.ts                      │  │
│  │   src/app/utils/formatters.ts                               │  │
│  │   src/app/utils/defaultTemplate.ts                          │  │
│  │   src/app/utils/templateConverter.ts                        │  │
│  └─────────────────────────┬──────────────────────────────────┘  │
│                            │ direct method calls                 │
│  ┌─────────────────────────▼──────────────────────────────────┐  │
│  │ "Data access" layer — singleton class                       │  │
│  │   src/app/data/store.ts  (class DataStore)                  │  │
│  │     ├─ getInvoices()    ├─ addInvoice(invoice)              │  │
│  │     ├─ getInvoice(id)   ├─ updateInvoice(id, partial)       │  │
│  │     ├─ getCustomers()   ├─ addPayment(payment)              │  │
│  │     ├─ getProducts()    ├─ calculateStatus(...) [private]   │  │
│  │     └─ updateOverdueStatuses() [private]                    │  │
│  └─────────────────────────┬──────────────────────────────────┘  │
│                            │ JSON deep clone at startup          │
│  ┌─────────────────────────▼──────────────────────────────────┐  │
│  │ Seed-data layer (fixture)                                   │  │
│  │   src/app/data/mockData.ts                                  │  │
│  │     ├─ customers   (5 rows)                                 │  │
│  │     ├─ products    (10 rows)                                │  │
│  │     ├─ invoices    (8 rows, statuses across the lifecycle)  │  │
│  │     ├─ payments    (5 rows)                                 │  │
│  │     └─ quotations  (2 rows)                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**[VERIFIED]** All four layers run in the same browser tab. There is no network call in the entire codebase — every state mutation is synchronous and local.

---

## 3. Runtime entry point

**[VERIFIED]** `src/main.tsx`:

```tsx
createRoot(document.getElementById("root")!).render(<App />);
```

**[VERIFIED]** `src/app/App.tsx`:

```tsx
export default function App() {
  return <RouterProvider router={router} />;
}
```

**[VERIFIED]** `src/app/routes.ts` declares one parent route `Layout` with 15 children (see `overview/system-overview.md` §5 for the full list).

---

## 4. Module composition

### 4.1 Pages (`src/app/pages/`)

**[VERIFIED]** 16 files:

`CreateInvoice.tsx`, `CustomerManagement.tsx`, `Dashboard.tsx`, `DebtManagement.tsx`, `InvoiceDetail.tsx`, `InvoiceList.tsx`, `InvoicePreview.tsx`, `NotFound.tsx`, `ProductManagement.tsx`, `QuotationManagement.tsx`, `Reports.tsx`, `Settings.tsx`, `TemplateBuilder.tsx`, `TemplateEditor.tsx`, `TemplateEditorVisual.tsx`, `TemplateList.tsx`.

Each page is a default-exported React component that imports `store` directly and renders synchronously.

### 4.2 Components (`src/app/components/`)

**[VERIFIED]** Shared composites + ShadCN-style primitives under `ui/`.

Composites:
- `Layout.tsx` — composes Sidebar + Header + MobileNav + MobileMenu + Outlet + Sonner Toaster.
- `Sidebar.tsx`, `Header.tsx`, `MobileNav.tsx`, `MobileMenu.tsx`.
- `StatusBadge.tsx`, `SummaryCard.tsx`, `InvoiceCard.tsx`, `InvoiceItemCard.tsx`, `InvoicePreview.tsx`, `TemplatePreview.tsx`.
- `FilterDrawer.tsx`, `PaymentModal.tsx`, `PaymentTimeline.tsx`.
- `BlockLibrary.tsx`, `BlockSettings.tsx`, `VisualBlock.tsx` (template editor).
- `FilteredLink.tsx` (wraps React Router `<Link>` to strip Figma inspector props before forwarding to DOM).
- `figma/` and `ui/` subdirectories (primitives).

### 4.3 Data layer (`src/app/data/`)

**[VERIFIED]** 2 files: `store.ts` (singleton class, ~96 LOC), `mockData.ts` (~565 LOC of TypeScript literal arrays).

### 4.4 Utilities (`src/app/utils/`)

**[VERIFIED]** 4 files:
- `formatters.ts` — `formatCurrency`, `formatDate`, `formatDateTime`, `getDaysBetween`, `isOverdue`.
- `invoiceCalculations.ts` — `calculateInvoiceStatus`, `calculateLineTotal`, `calculateInvoiceSubtotal`, `calculateInvoiceTotal`, `calculateRemainingBalance`, `canAddPayment`.
- `defaultTemplate.ts` — `defaultTemplateSchema` + `sampleData`.
- `templateConverter.ts` — block schema ↔ HTML conversion (used by editor preview).

### 4.5 Type definitions

**[VERIFIED]** `src/app/types.ts` (Invoice / Customer / Product / Payment / Quotation / DebtInfo / InvoiceStatus / PaymentMethod) and `src/app/types/template.ts` (block model).

### 4.6 Imports (design artifacts)

**[VERIFIED]** `src/imports/` contains 9 generated `WebBasedInvoiceManagementSystem-*.tsx` files + `svg-*.ts` assets — Figma export bundle. **[INFERRED]** Not imported by `routes.ts` or any page; unused at runtime. They inflate bundle only if imported.

---

## 5. Data flow examples

### 5.1 Create invoice (Simulated Workflow)

**[VERIFIED]** sequence:

1. User on `/invoices/create` fills form. State held in `CreateInvoice.tsx` via `useState`.
2. On submit, `handleSubmit('unpaid')`:
   - Validates 4 client-side rules (V-CI-01..04) and shows `toast.error` on failure.
   - Calls `store.getInvoices()` to read the head invoice for numbering.
   - Constructs an `Invoice` object literal with `paidAmount=0`, `remainingBalance=total`, `payments=[]`.
   - Calls `store.addInvoice(newInvoice)` → `invoices.unshift(newInvoice)`.
3. `toast.success` and `navigate('/invoices/:id')`.

**[VERIFIED]** No HTTP, no DB, no audit — the entire workflow is in-memory.

### 5.2 Add payment (Simulated Workflow + Auto-status)

**[VERIFIED]** sequence:

1. `InvoiceDetail.tsx` opens `PaymentModal`.
2. Modal validates (V-PAY-01/02) and calls `onSubmit(payment)`.
3. `InvoiceDetail.handleAddPayment` synthesises `{id: 'PAY'+Date.now(), invoiceId, ...payment}` and calls `store.addPayment(payment)`.
4. `store.addPayment`:
   - Pushes to `payments[]`.
   - Recomputes `paidAmount`, `remainingBalance`, `status` via `calculateStatus(...)`.
   - Calls `updateInvoice(...)` to mutate the array in place.
5. The detail page re-reads `store.getInvoice(id)` and calls `setInvoice(updated)`. Other mounted pages (Dashboard, Sidebar counters) are NOT notified — they refresh only on remount.

### 5.3 Overdue auto-evaluation (Simulated Workflow)

**[VERIFIED]** Every call to `store.getInvoices()` or `store.getInvoice(id)` invokes `updateOverdueStatuses()`:

- Iterates invoices where `remainingBalance > 0 && status !== 'draft'`.
- Recomputes status via `calculateStatus(total, paidAmount, dueDate)`.
- Writes back in place if changed.

**[VERIFIED]** Time comparison uses local-time zero-hour normalisation (`date.setHours(0,0,0,0)`). Strict `<` — due **today** is NOT overdue.

---

## 6. Tooling & build

**[VERIFIED]** `package.json`:
- Scripts: `dev` (Vite dev server), `build` (Vite build). **No** `test`, `lint`, `typecheck`, `format`.
- Runtime deps (selected): `react@18.3.1`, `react-dom@18.3.1`, `react-router@7.13.0`, `@radix-ui/*`, `tailwindcss@4.1.12`, `recharts@2.15`, `lucide-react`, `sonner@2.0.3`, `date-fns@3.6`, `react-hook-form@7.55.0` *(installed but unused)*, `react-dnd@16`, `@monaco-editor/react@4.7`.
- Dev deps: `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite@6.3.5`.

**[VERIFIED]** Build output: a static SPA bundle (HTML + JS + CSS). **[INFERRED]** Intended deployment: any static host (Vercel, Netlify, S3+CloudFront, nginx) — but until a backend exists, deploying this artifact publicly is equivalent to publishing a single-tenant prototype with no auth.

**[VERIFIED]** No `Dockerfile`, no GitHub Actions workflows, no CI/CD configuration files (`.github/`, `.gitlab-ci.yml`, `Jenkinsfile`, `buildspec.yml` all absent).

**[VERIFIED]** No environment configuration (`.env`, `.env.example`, `import.meta.env.VITE_*` references absent from source).

---

## 7. Cross-cutting behaviors

| Behavior | Where it lives [VERIFIED] |
|---|---|
| Currency formatting | `utils/formatters.ts:formatCurrency` (`Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'})`) |
| Date formatting | `utils/formatters.ts:formatDate` (`toLocaleDateString('vi-VN', …)`) |
| Status colours | `components/StatusBadge.tsx:statusConfig` (invoices), `pages/QuotationManagement.tsx:statusConfig` (quotations) |
| Brand colour | Inline hex `#1E88E5` (primary), `#1976D2` (hover) repeated across many files |
| Toast feedback | `sonner` `<Toaster />` mounted in `Layout.tsx`; `toast.success` / `toast.error` called from pages |
| Routing | `react-router 7` `createBrowserRouter` in `routes.ts` |
| Form validation | Inline `if` statements in submit handlers; no schema library |
| Drag-and-drop (template) | `react-dnd` + `react-dnd-html5-backend` |
| Code editor (template HTML) | `@monaco-editor/react` |

---

## 8. What this architecture supports today

- Stakeholder demo on a laptop or in a meeting room.
- BA / UX validation of screen flows and copy.
- Click-through of the seeded scenarios (8 invoices spanning all statuses, 2 quotations, 5 customers, 10 products).
- Local manipulation: a session of creating invoices and recording payments — all lost on refresh.

## 9. What this architecture does NOT support

- Multi-user usage (no auth, no real-time sync).
- Multi-device usage (state is per-tab).
- Long-term storage (refresh = reset).
- Concurrency (a future backend will need transaction handling).
- Auditing (no event sourcing or change log).
- Reporting on more than a few seeded rows.
- Print / PDF (button handlers absent).
- Email / notifications (no service).
- Tenant separation (one shared dataset).

---

## 10. Diagram — request lifecycle (current)

```
User click
   │
   ▼
React component (page)
   │
   ▼
Local useState   ←─ event handler
   │
   ▼  (synchronous)
store.method(...)
   │
   ▼  (mutates in-memory array)
Array re-read on next render
   │
   ▼
JSX re-renders only in the component that called setState
   │
   ▼
Sonner toast shown (if applicable)
```

**[VERIFIED]** No `fetch`, no `axios`, no WebSocket, no Service Worker, no IndexedDB, no `localStorage`, no `sessionStorage` writes are present in the source. State is exclusively held in JavaScript object references on the heap.

---

## 11. Verification commands the user can run

```bash
# Confirm no backend dependency
grep -E "@nestjs|mongoose|mongodb|prisma|typeorm|express|fastify" package.json

# Confirm no HTTP call in source
grep -rE "fetch\(|axios|XMLHttpRequest|WebSocket" src/

# Confirm no persistence API usage
grep -rE "localStorage|sessionStorage|indexedDB" src/

# Confirm no environment variables
grep -rE "import\.meta\.env\.VITE_" src/

# Confirm no backend boot file
find . -name "main.ts" -not -path "./node_modules/*"
find . -name "nest-cli.json"
```

All commands return zero matches at the time of writing.
