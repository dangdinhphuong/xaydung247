# Technical Debt — Invoice Pro

> Register of code-level debt that does not yet break functionality but increases future maintenance cost, regression risk, or onboarding friction.

---

## TD-001

## Title
Class-based singleton `DataStore` replicates an API surface that will be obsolete once the backend exists.

## Category
Technical Debt / Architecture Limitation

## Severity
High

## Description
`store.ts` exports a class instance with synchronous methods. Pages bind to it directly. Replacing it with HTTP fetches will require touching every page.

## Current Behavior
Coupling.

## Expected Behavior
Pages call a typed API client (`api.invoices.list()`); the implementation may be in-memory today and HTTP tomorrow.

## Recommended Fix
Introduce an `api/` interface and provide an `inMemory.ts` adapter today; swap to `http.ts` adapter once backend exists.

## Risk If Unresolved
Large refactor cost; bug surface during the swap.

## Affected Modules
All.

---

## TD-002

## Title
React-Hook-Form is installed but unused; forms are hand-rolled.

## Category
Technical Debt

## Severity
Medium

## Description
`react-hook-form 7.55.0` in deps; not imported. Forms use ad-hoc `useState` + manual validation.

## Recommended Fix
Either remove the dep or migrate forms (CreateInvoice, PaymentModal, Settings, future User/Customer/Product/Quotation forms) to RHF + Zod for consistent validation, error rendering, dirty-state, and disabled-submit semantics.

## Risk If Unresolved
Inconsistent form UX across modules.

---

## TD-003

## Title
Dual mobile/desktop JSX duplicated in every list/detail page.

## Category
Technical Debt

## Severity
Medium

## Description
Each page contains both a `<Table>` and a `<Card>` rendering of the same data, plus parallel filter UIs. Changes drift.

## Recommended Fix
Extract `ResponsiveDataView`, `ResponsiveFilterControl`, `MobileBottomActionBar` shared components.

## Risk If Unresolved
Mobile/desktop drift; missing columns on one side; double the maintenance.

## Related
ARCH-007.

---

## TD-004

## Title
Brand colours and shadows hard-coded as hex literals (`#1E88E5`, `#1976D2`, `#4CAF50`, `#FF9800`, `#F44336`).

## Category
Technical Debt

## Severity
Low

## Description
No Tailwind theme tokens; rebranding requires a global search-replace.

## Recommended Fix
Define `theme.colors.brand.{primary, secondary, success, warning, danger}` in `tailwind.config` and replace literals.

## Risk If Unresolved
Branding drift; cannot white-label.

## Related
ARCH-015.

---

## TD-005

## Title
`console.log` statements in production code paths.

## Category
Technical Debt

## Severity
Low

## Description
`pages/TemplateList.tsx:handleSetDefault` calls `console.log`. Future modules likely to inherit this pattern.

## Recommended Fix
Introduce a `log` helper that is a no-op in production; ESLint rule `no-console: error` (allow `warn`/`error` only).

## Risk If Unresolved
PII leakage in browser logs.

## Related
SECR-012.

---

## TD-006

## Title
`src/imports/` directory contains 9 large Figma-generated TSX files plus SVG modules — unused by routes.

## Category
Technical Debt

## Severity
Low

## Description
~thousands of lines of generated mock UI files alongside production code; risk of accidental import.

## Recommended Fix
Move to `design/figma-exports/` outside the build (or delete after confirming non-use).

## Risk If Unresolved
Bundle bloat if accidentally imported.

## Related
ARCH-016.

---

## TD-007

## Title
No TypeScript strict checks documented; `package.json` has no `typecheck` script.

## Category
Technical Debt

## Severity
Medium

## Description
Vite compiles even when types are wrong (esbuild does not type-check). No CI enforcement.

## Recommended Fix
Add `"typecheck": "tsc -p tsconfig.json --noEmit"` and run it in CI. Set `tsconfig` `strict: true`.

## Risk If Unresolved
Type errors slip into production.

## Related
ARCH-014.

---

## TD-008

## Title
No ESLint / Prettier configuration files in repo.

## Category
Technical Debt

## Severity
Medium

## Description
Code style is implicit. New contributors will diverge.

## Recommended Fix
Add `.eslintrc.cjs`, `prettier.config.js`, `lint-staged` + Husky pre-commit hook.

## Risk If Unresolved
Style drift; nitpicky reviews.

## Related
ARCH-014.

---

## TD-009

## Title
No tests of any kind.

## Category
Technical Debt

## Severity
High

## Description
`package.json` has no `test` script. No `*.test.ts`, no Playwright, no Vitest config.

## Recommended Fix
Adopt Vitest + Testing Library; cover business rules first (BR-CI, BR-PAY, BR-DEBT, BR-SET); add Playwright E2E for the invoice lifecycle.

## Risk If Unresolved
All refactors are blind.

## Related
MISS-025.

---

## TD-010

## Title
Magic numbers in business logic: low-stock threshold `100`, default due-days `30`, aging buckets `30/60`, payment-ID generation collision risk.

## Category
Technical Debt

## Severity
Medium

## Description
Hard-coded constants scattered across files.

## Recommended Fix
Centralise in `src/app/constants/business.ts` with documented justifications; surface in Settings where appropriate.

## Risk If Unresolved
Inconsistency when the same number drifts in different places.

---

## TD-011

## Title
Mock data file (`mockData.ts`) imported by both pages and the seed store — entangles fixtures with runtime.

## Category
Technical Debt

## Severity
Medium

## Description
`CustomerManagement`, `DebtManagement`, `Reports` import `customers` directly from `mockData.ts` instead of via `store.getCustomers()`. When the store is migrated to HTTP, these pages will silently still read mocks.

## Recommended Fix
Refactor every page to read through the store API.

## Risk If Unresolved
Half-migrated state when backend ships.

---

## TD-012

## Title
Dead state `selectedInvoiceForPayment` in `InvoiceList`.

## Category
Technical Debt

## Severity
Low

## Description
See ISSUE-025.

## Recommended Fix
Either wire it to the dollar icon OR remove the dead variable + the unreachable `PaymentModal` mount.

---

## TD-013

## Title
`InvoiceDetail` keeps two sources of truth: `invoice` (local state) and `store.getInvoice(id)`.

## Category
State Management Issue / Technical Debt

## Severity
Medium

## Description
After `addPayment`, both the store and the local `setInvoice` are updated manually. Other consumers (Dashboard counts, sidebar badges, MobileNav) won't reflect changes.

## Recommended Fix
Adopt TanStack Query — single source of truth + automatic invalidation.

## Related
ARCH-002, ISSUE-026.

---

## TD-014

## Title
`InvoiceItem.id` and `Payment.id` generated client-side with `Date.now()` — duplication / collision risk.

## Category
Technical Debt / Data Integrity Risk

## Severity
High

## Description
See ISSUE-006.

## Recommended Fix
Server-generated UUIDs; client supplies idempotency-key.

---

## TD-015

## Title
Inline JSX repeats `formatCurrency` / `formatDate` calls instead of a `<Money/>` and `<Date/>` formatting components.

## Category
Technical Debt

## Severity
Low

## Description
Future localisation, RTL, or accessibility (e.g. `aria-label` on numbers) requires changing every call site.

## Recommended Fix
Wrap in tiny formatting components.

## Risk If Unresolved
Refactor cost for any future format change.

---

## TD-016

## Title
Numerous "TODO-shaped" placeholder JSX (buttons with no handlers, comments like `{/* Print action */}`).

## Category
Technical Debt

## Severity
Medium

## Description
`InvoiceDetail.tsx` line 487 has `onClick={() => {/* Print action */}}`. This pattern is repeated across the codebase.

## Recommended Fix
Replace placeholders with `throw new Error('TODO: …')` so unfinished features fail loudly in dev; track in a backlog.

## Risk If Unresolved
Silent unfinished features ship to production.

---

## TD-017

## Title
React Router 7 features (loaders, actions, errorElement) unused.

## Category
Technical Debt

## Severity
Medium

## Description
The project uses only `Component:` per route — leaving on the table the v7 loader/action/errorElement pattern which would centralise data-fetching and error UX.

## Recommended Fix
Migrate new pages to loader pattern; gradually convert old pages.

## Related
ARCH-006.

---

## TD-018

## Title
`Tailwind v4` used but no design tokens / theme.css customisation visible; styles inline.

## Category
Technical Debt

## Severity
Low

## Description
Tailwind 4 supports `@theme` blocks for tokens; not used. Custom CSS lives in `src/styles/index.css` only.

## Recommended Fix
Adopt `@theme` tokens, especially for brand colours (TD-004).

---

## TD-019

## Title
No bundle size monitoring; charts (recharts), Monaco, react-dnd, embla-carousel etc. all eagerly imported.

## Category
Technical Debt

## Severity
Medium

## Description
A first paint loads Recharts + Monaco even if the user only opens `/invoices`.

## Recommended Fix
Code-split via `React.lazy` + `Suspense` per route. Lazy-load Monaco only on Template editor routes.

## Risk If Unresolved
Slow first paint; mobile-data cost.

## Related
NFR-1.

---

## TD-020

## Title
No accessibility tokens / focus-ring conventions documented.

## Category
Technical Debt

## Severity
Low

## Description
Radix gives baseline accessibility; custom components (`StatusBadge`, `SummaryCard`, `InvoiceCard`) lack explicit `aria-label` / `role` annotations.

## Recommended Fix
A11y review pass; add ARIA where needed.

## Related
MISS-024.

---

## TD-021

## Title
README is one-line; no developer onboarding doc.

## Category
Technical Debt / Documentation Gap

## Severity
Medium

## Description
The repo `README.md` says only "Run `npm i` and `npm run dev`". No info about architecture, conventions, or this `docs/` folder.

## Recommended Fix
Replace README with a real onboarding doc that:
- Explains the project's current state (prototype, in-memory).
- Links to `/docs`.
- Lists scripts, conventions, prerequisites.

## Risk If Unresolved
Long onboarding for new contributors.

---

## TD-022

## Title
`CLAUDE.md` contains team-specific AI agent rules irrelevant to a normal developer reading the repo.

## Category
Technical Debt / Documentation Gap

## Severity
Low

## Description
The file documents agent workflow conventions. Not necessarily a problem, but should be clearly labelled as "AI tooling rules, not production conventions".

## Recommended Fix
Add a header banner clarifying scope.

---

## TD-023

## Title
Numerous `useState` calls for transient UI flags duplicated across pages (drawer open, dialog open, search query).

## Category
Technical Debt

## Severity
Low

## Description
No shared `useDisclosure` hook (Radix has `Dialog.Root` controlled, but the boilerplate repeats).

## Recommended Fix
Extract `useDisclosure()` similar to Chakra/Ark UI.

## Risk If Unresolved
Boilerplate accumulates.

---

## TD-024

## Title
JSON deep-clone via `JSON.parse(JSON.stringify(...))` for seeding store.

## Category
Technical Debt

## Severity
Low

## Description
`store.ts` constructor uses `JSON.parse(JSON.stringify(initialInvoices))` etc. Slow for large datasets; would die on Date or function fields.

## Recommended Fix
Use `structuredClone()` (modern, faster, supports more types). Or eliminate when backend lands.

## Risk If Unresolved
Performance issue at scale (not now).

---

## TD-025

## Title
Date arithmetic uses naive `new Date(...)` + millisecond math (see ISSUE-021, ISSUE-022).

## Category
Technical Debt / Data Integrity Risk

## Severity
Medium

## Description
`date-fns` is in deps and unused.

## Recommended Fix
Use `date-fns` (or `date-fns-tz` for TZ awareness): `addDays`, `isBefore`, `differenceInCalendarDays`.

## Related
ISSUE-021, ISSUE-022.

---

## Debt-payoff prioritisation

| Phase | Goal | Items |
|---|---|---|
| Phase 0 — pre-backend | Reduce future swap cost | TD-001, TD-011, TD-019, TD-013, TD-014 |
| Phase 1 — quality | Make refactors safe | TD-007, TD-008, TD-009, TD-017, TD-005 |
| Phase 2 — consistency | Reduce UI drift | TD-002, TD-003, TD-004, TD-010, TD-018 |
| Phase 3 — polish | Onboarding & a11y | TD-006, TD-015, TD-020, TD-021, TD-022, TD-023, TD-024, TD-025 |

---

## Summary by severity

| Severity | Count | IDs |
|---|---|---|
| High | 3 | TD-001, TD-009, TD-014 |
| Medium | 11 | TD-002, TD-003, TD-007, TD-008, TD-010, TD-011, TD-013, TD-016, TD-017, TD-019, TD-021, TD-025 |
| Low | 11 | TD-004, TD-005, TD-006, TD-012, TD-015, TD-018, TD-020, TD-022, TD-023, TD-024 |
