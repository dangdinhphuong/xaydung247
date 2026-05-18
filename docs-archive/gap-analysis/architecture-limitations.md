# Architecture Limitations — Invoice Pro

> Structural constraints in the current codebase that block production readiness or constrain future scaling. Each item is documented with severity, root cause, blast radius and a recommended remediation path.

---

## ARCH-001

## Title
Frontend-only SPA with no backend or persistent storage.

## Category
Architecture Limitation

## Severity
**Critical**

## Description
The entire system runs in the browser. Mutations live in a singleton `DataStore` (`src/app/data/store.ts`) seeded from `mockData.ts`. There is no API, no database, no server.

## Current Behavior
- `npm run dev` serves a static SPA.
- A browser refresh re-seeds all data.
- Multiple tabs each have their own private dataset.

## Expected Behavior
- Backend service (NestJS or Spring Boot) exposing REST/GraphQL endpoints.
- Persistent RDBMS (Postgres) for transactional data.
- File/object storage for PDFs and attachments.
- Cache (Redis) for session + rate-limit.

## Business Impact
- Cannot deploy; product is a prototype.
- No data, no audit, no compliance.

## Technical Impact
- The `DataStore` API surface must be replicated as HTTP endpoints.
- Every page must adopt a data-fetching layer (TanStack Query recommended).

## Root Cause Analysis
The project originated as a Figma-Make code bundle (see README) — UI prototype only.

## Affected Modules
All.

## Reproduction Flow
Create any record → refresh → record vanishes.

## Recommended Fix
1. Build a NestJS service implementing the contract in `database/database-dictionary.md`.
2. Replace `store` calls with a `client/api.ts` thin layer.
3. Wrap pages in TanStack Query providers; convert mutations to `useMutation` with `invalidateQueries`.

## Risk If Unresolved
Total data loss; cannot ship.

## Related Business Rules
NFR-7; affects every module.

---

## ARCH-002

## Title
Singleton `DataStore` not reactive — UI subscribers are not notified of mutations.

## Category
State Management Issue

## Severity
High

## Description
`DataStore` is a plain class with private arrays. Pages read via direct method calls (e.g. `store.getInvoices()`). When one page mutates (`addPayment`), other pages already mounted in memory will not re-render until they remount or re-fetch.

## Current Behavior
After paying an invoice, returning to Dashboard still shows stale KPIs unless the page remounts.

## Expected Behavior
A reactive state layer (Zustand, Redux Toolkit, or TanStack Query) where mutations trigger query invalidation and subscriber re-render.

## Business Impact
Stale figures shown to user; trust erosion.

## Technical Impact
Need to refactor data layer.

## Root Cause Analysis
Class-based singleton lacks pub/sub.

## Affected Modules
All pages using `store`.

## Reproduction Flow
1. Open Dashboard in tab.
2. Add a payment in InvoiceDetail (same tab) by navigating.
3. Navigate back to Dashboard via back button — KPIs may be stale.

## Recommended Fix
Adopt TanStack Query + a Zustand "ui store" for ephemeral state.

## Risk If Unresolved
Persistent staleness; bug magnet.

## Related Business Rules
ISSUE-026.

---

## ARCH-003

## Title
No multi-tenant model.

## Category
Architecture Limitation

## Severity
**Critical** (for SaaS) / N/A (for single-tenant on-prem)

## Description
Data model has no `tenant_id`. A SaaS deployment would expose all tenants' data to anyone.

## Current Behavior
Single shared dataset.

## Expected Behavior
- `tenant_id UUID NOT NULL` on every business table.
- Composite UNIQUE constraints scoped by tenant (`UNIQUE(tenant_id, invoice_number)`).
- Postgres Row-Level Security policies derived from `current_setting('app.current_tenant')`.
- Backend middleware injects `tenant_id` into the DB session from the validated JWT.

## Business Impact
Cannot run as SaaS without rewrite.

## Technical Impact
Schema migration + every query review.

## Root Cause Analysis
Single-shop model in prototype.

## Affected Modules
All.

## Recommended Fix
Apply tenant model from day-1 of backend build.

## Risk If Unresolved
Catastrophic data leak.

## Related Business Rules
BO-12, SEC-TEN-*.

---

## ARCH-004

## Title
No authentication / authorisation layer.

## Category
Security Risk / Architecture Limitation

## Severity
**Critical**

## Description
See ISSUE-017 and MISS-001.

## Expected Behavior
Per `modules/authentication.md` and `roles/roles-and-permissions.md`.

## Recommended Fix
Add cookie-session or JWT auth; wrap routes in `<AuthGuard>`; backend middleware enforces RBAC.

---

## ARCH-005

## Title
No API contract / typed client layer; pages talk directly to a class instance.

## Category
Technical Debt / Architecture Limitation

## Severity
High

## Description
There is no `api/` module, no OpenAPI spec, no auto-generated client types. Each page imports the singleton directly.

## Current Behavior
Coupling pages to `store.ts` makes backend swap-in invasive.

## Expected Behavior
- OpenAPI spec checked into repo.
- Auto-generated typed client (e.g. `openapi-typescript-codegen`).
- Pages use the client.

## Business Impact
Future backend integration is high-effort.

## Technical Impact
Refactor across all pages.

## Recommended Fix
Define OpenAPI now (mirroring `database-dictionary.md` and the existing store API), generate types, refactor `store.ts` into the same interface as the generated client so the swap is trivial.

## Risk If Unresolved
Large refactor cost later.

---

## ARCH-006

## Title
Routing has no nested guards or layouts beyond a single `Layout` parent.

## Category
Architecture Limitation

## Severity
Medium

## Description
`routes.ts` flat-lists all pages under one `Layout`. No nested layouts for `/settings/*` or `/invoices/*`. No route-level loaders/actions (React Router 7 supports these).

## Current Behavior
Each page implements its own data fetching at component-mount.

## Expected Behavior
- Route loaders (React Router 7) — prefetch data before render.
- Route-level error boundaries.
- Nested layouts (e.g. `SettingsLayout` with sub-nav).

## Recommended Fix
Migrate to loader/action pattern for new features.

## Risk If Unresolved
Each page must duplicate loading/error logic.

---

## ARCH-007

## Title
Mobile/desktop dual-rendering is duplicated in every page (no shared abstraction).

## Category
Technical Debt

## Severity
Medium

## Description
Every page contains parallel JSX blocks: a desktop `<Table>` and a mobile card list. Filter UIs are duplicated in `Select` + `Sheet` bottom drawer. There is no shared `ResponsiveTable` component.

## Current Behavior
~50% of page JSX is repeated for the alternate layout.

## Expected Behavior
A `<ResponsiveDataView columns rows>` component picks card vs. table based on viewport.

## Business Impact
Bug risk: changes drift between desktop and mobile (e.g. column added on desktop but not mobile).

## Technical Impact
Maintenance burden.

## Recommended Fix
Extract `ResponsiveDataView`, `ResponsiveFilterControl`, `MobileBottomActionBar` shared components.

## Risk If Unresolved
Increasing UI inconsistency.

---

## ARCH-008

## Title
No error boundaries, no loading skeletons, no offline awareness.

## Category
Architecture Limitation

## Severity
Medium

## Description
React `ErrorBoundary` and `Suspense` are not used. The app assumes synchronous in-memory data.

## Current Behavior
Any future API error will produce a blank page.

## Expected Behavior
- Root error boundary with friendly "Đã có lỗi xảy ra" + retry.
- Per-page suspense fallback (skeleton).
- Network-status indicator.

## Recommended Fix
Add error boundary in `Layout.tsx`; use `<Suspense>` around outlet.

---

## ARCH-009

## Title
No environment configuration (`.env`, runtime config).

## Category
Architecture Limitation

## Severity
Medium

## Description
There is no API base URL, no feature-flag mechanism, no per-environment config (dev / staging / prod).

## Current Behavior
Everything hard-coded.

## Expected Behavior
- `VITE_API_BASE_URL`, `VITE_SENTRY_DSN`, `VITE_FEATURE_*` flags.
- Runtime `/config.json` for env-specific values not baked into the bundle.

## Recommended Fix
Introduce `import.meta.env.VITE_*` + a `config.ts` typed adapter.

## Risk If Unresolved
Cannot promote a single artifact across environments.

---

## ARCH-010

## Title
No observability — no logging, no error tracking, no metrics.

## Category
Architecture Limitation

## Severity
Medium

## Description
No Sentry/Datadog/OpenTelemetry. `console.log` is the only logger and is present in production code (`TemplateList.tsx`).

## Current Behavior
Failures invisible.

## Expected Behavior
- Sentry on frontend (with PII scrubbing).
- Backend traces (OTel).
- Business-event metrics (invoices created/day, payments/day).

## Recommended Fix
Integrate Sentry first; metrics later.

## Risk If Unresolved
Cannot operate the system.

---

## ARCH-011

## Title
Template rendering is client-only; no server pipeline for PDF/print.

## Category
Architecture Limitation

## Severity
High

## Description
The visual builder & HTML editor produce a schema/HTML rendered only in-browser. There is no headless renderer producing a deterministic PDF/print artifact.

## Current Behavior
Cannot guarantee what the customer receives.

## Expected Behavior
- Headless Chromium service renders template + invoice data into PDF.
- Resulting PDF stored and signed-URL provided to user.
- Same renderer used for "Tải PDF" and emailed attachments.

## Recommended Fix
Add `pdf-service` (Node + Puppeteer or Gotenberg) as a microservice.

## Risk If Unresolved
"It looks fine on screen" ≠ "looks fine to customer".

## Related Business Rules
BO-14, BR-TPL-02.

---

## ARCH-012

## Title
No job/queue infrastructure for async work (emails, PDF, reminders, overdue scan).

## Category
Architecture Limitation

## Severity
High

## Description
The recommended features (email send, reminders, nightly overdue scan, exports) require background processing. None planned in the SPA.

## Expected Behavior
- BullMQ on Redis (Node) or equivalent.
- Cron job at 00:05 Asia/Ho_Chi_Minh for overdue / quotation-expiry sweeps.
- Idempotent job handlers.

## Recommended Fix
Build alongside backend.

## Risk If Unresolved
Critical automations impossible.

---

## ARCH-013

## Title
No CI/CD pipeline detected (no `.github/`, no workflow files).

## Category
Technical Debt

## Severity
Medium

## Description
There are no CI configurations, no lint runners, no test runners, no build verification.

## Current Behavior
Manual builds.

## Expected Behavior
- GitHub Actions: lint → typecheck → test → build → docker → deploy (staging).
- Required-status-check on main.

## Recommended Fix
Add a minimal pipeline: `pnpm install --frozen-lockfile && pnpm typecheck && pnpm build`.

## Risk If Unresolved
Broken commits reach trunk.

---

## ARCH-014

## Title
No linting / formatting / typecheck scripts in `package.json`.

## Category
Technical Debt

## Severity
Medium

## Description
Only `dev` and `build` scripts exist. No `tsc --noEmit`, no `eslint`, no `prettier`.

## Recommended Fix
Add scripts:
```json
"typecheck": "tsc -p tsconfig.json --noEmit",
"lint": "eslint . --max-warnings 0",
"format": "prettier --write ."
```
Enforce in CI.

## Risk If Unresolved
Bug rot.

---

## ARCH-015

## Title
No design-system / token system; colors hardcoded as Tailwind classes & hex literals (`#1E88E5`, `#1976D2`, `#4CAF50`, `#FF9800`, `#F44336`).

## Category
Technical Debt

## Severity
Low

## Description
Brand colors are scattered. Changing the primary blue requires search & replace across the repo.

## Recommended Fix
Define Tailwind theme tokens (`brand.primary`, `brand.success`, `brand.warning`, `brand.danger`) and reference everywhere.

## Risk If Unresolved
Branding drift; no white-label readiness.

---

## ARCH-016

## Title
`src/imports/` directory contains generated Figma artifacts not separated from app code.

## Category
Technical Debt

## Severity
Low

## Description
9 large `WebBasedInvoiceManagementSystem-*.tsx` files and `svg-*.ts` exist under `src/imports/`. They are Figma-generated mockups, unused by routes. They inflate the bundle if imported.

## Recommended Fix
- Move to `design/` (outside the build) or delete after confirming no runtime import.
- Add a comment block at top of any remaining file: "Generated artifact — not part of runtime."

## Risk If Unresolved
Future devs may import these by accident.

---

## ARCH-017

## Title
No service worker / PWA; mobile use requires online connectivity.

## Category
Architecture Limitation

## Severity
Low

## Description
Field salespeople using mobile may lose connection.

## Recommended Fix
Add Vite PWA plugin; cache shell; queue mutations while offline.

## Risk If Unresolved
Unusable in low-coverage areas.

---

## ARCH-018

## Title
No analytics / usage telemetry.

## Category
Architecture Limitation

## Severity
Low

## Description
Product team has no insight into which features are used.

## Recommended Fix
Add a privacy-friendly analytics (Plausible, PostHog) after auth.

---

## ARCH-019

## Title
No internationalization layer; copy is inline Vietnamese.

## Category
Architecture Limitation

## Severity
Low

## Description
All UI strings are JSX text in Vietnamese.

## Recommended Fix
Adopt `i18next` if other locales become a target.

## Risk If Unresolved
Refactor cost grows with each new screen.

---

## Architectural roadmap (recommended phasing)

| Phase | Scope | Items |
|---|---|---|
| Phase 0 — foundation | Make it real | ARCH-001, ARCH-004, ARCH-005, ARCH-009, ARCH-013, ARCH-014 |
| Phase 1 — production readiness | Make it safe | ARCH-003, ARCH-010, ARCH-011, ARCH-012, ARCH-008 |
| Phase 2 — quality | Make it maintainable | ARCH-002, ARCH-006, ARCH-007, ARCH-015 |
| Phase 3 — polish & growth | Make it delightful | ARCH-017, ARCH-018, ARCH-019, ARCH-016 |

---

## Summary by severity

| Severity | Count | IDs |
|---|---|---|
| Critical | 3 | ARCH-001, ARCH-003, ARCH-004 |
| High | 4 | ARCH-002, ARCH-005, ARCH-011, ARCH-012 |
| Medium | 7 | ARCH-006, ARCH-007, ARCH-008, ARCH-009, ARCH-010, ARCH-013, ARCH-014 |
| Low | 5 | ARCH-015, ARCH-016, ARCH-017, ARCH-018, ARCH-019 |
