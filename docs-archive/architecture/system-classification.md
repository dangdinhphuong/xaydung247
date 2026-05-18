# System Classification — Invoice Pro

> Authoritative classification of what this codebase **is** and what it **is not**, so that every other document in the BRD/SRS set can be read with the correct mental model.

---

## 1. Verification level convention used in this document set

Every claim in the architecture/future-architecture folders is marked with one of:

- **[VERIFIED]** — Directly observable in the source code (file path + line numbers). The author has read the code and confirmed the behavior.
- **[INFERRED]** — Not explicitly coded, but deduced from naming, comments, UI affordances, or seed-data shape. May be wrong; flagged for stakeholder validation.
- **[RECOMMENDED]** — Not present in the current code. Proposed for the future backend / production rollout. The author is asserting what *should* exist, not what *does* exist.

When a paragraph or list omits the marker, the surrounding section's default marker applies.

---

## 2. Headline classification

The codebase at `d:/Codes/Web-based Invoice Management System` is classified as a:

> **Frontend Prototype — UI-driven MVP with Mock-data Architecture (Frontend Simulation System).**

This classification is based on the following **[VERIFIED]** facts:

| Aspect | Evidence | Implication |
|---|---|---|
| No backend server | No `nest-cli.json`; no `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.dto.ts`, `*.schema.ts`, `*.entity.ts`, `main.ts` anywhere in the repo. No HTTP framework (`@nestjs/*`, `express`, `fastify`, `koa`) in `package.json`. | Every workflow that the UI appears to perform is executed entirely in the user's browser. |
| No database | No `mongoose`, `mongodb`, `pg`, `mysql2`, `prisma`, `typeorm`, `sequelize`, `drizzle-orm` in dependencies. No connection strings, no `.env`, no migration files. | Nothing the user enters is durably stored. |
| No authentication | No `jsonwebtoken`, `@nestjs/jwt`, `passport`, `bcrypt`, `next-auth`. No `/login` route in `src/app/routes.ts`. `Header.tsx` renders a hard-coded "Nguyễn Văn An — Quản trị viên". | Anyone with the URL has full app powers (in this local prototype context). |
| In-memory data layer | `src/app/data/store.ts` exports a singleton `DataStore` class whose private arrays are seeded by deep-cloning fixtures from `src/app/data/mockData.ts`. | Refreshing the browser resets the dataset to seed data. |
| Vite SPA build target | `package.json` scripts: `"build": "vite build"`, `"dev": "vite"`. `vite.config.ts` present. | Output is a static SPA bundle. |
| Workspace is single-package | `pnpm-workspace.yaml` contains only build-permission config; no `packages:` declared. | No sibling backend package in this repo. |

---

## 3. What the system **is**

### 3.1 Frontend Prototype
A working, responsive **user interface** demonstrating the intended look and behavior of the production system. Suitable for:
- Stakeholder demos and acceptance walkthroughs.
- UX research and usability testing on seeded scenarios.
- BA validation of screen flows, copy, and visual hierarchy.
- Reference implementation for the future production frontend.

### 3.2 UI-driven MVP
The architecture is **screen-first**: pages directly read/write the in-memory store. There is no separation between presentation and business logic except where utility functions live in `src/app/utils/`. Business rules are expressed as inline JSX conditions, JavaScript predicates, and TypeScript types.

### 3.3 Mock-data Architecture
All state originates from `mockData.ts` at module load. Mutations are local to the running browser tab. There is no remote synchronization, no shared state across tabs, no offline-online reconciliation.

### 3.4 Frontend Simulation System
The product *simulates* business behaviors that would, in production, require a backend:
- Invoice status transitions (`unpaid → partial → paid`, auto-`overdue` evaluation) — **simulated in `store.ts:calculateStatus / updateOverdueStatuses`**.
- Receivables aging — **simulated in `DebtManagement.tsx`**.
- Customer debt rollup — **simulated in `CustomerManagement.tsx`**.
- KPI aggregation — **simulated in `Dashboard.tsx`**.

These simulations are *functionally correct on small seed data* but cannot replace a real backend.

---

## 4. What the system **is NOT**

- **NOT** a production system.
- **NOT** an MVP that can be deployed to paying customers.
- **NOT** a multi-tenant SaaS — there is no concept of tenant.
- **NOT** a secure system — every visitor is implicitly an admin.
- **NOT** an audit-compliant system — no logs are written.
- **NOT** a reporting engine — all charts above the "Recent invoices" table use hard-coded mock data series.
- **NOT** a print/PDF-generating system — the In and Tải PDF buttons have no handlers.
- **NOT** an email/notification system — the Settings toggles have no consumers.
- **NOT** a backend-integration project — there are no HTTP calls in the entire codebase.

---

## 5. Per-area classification

| Area | Classification | Notes |
|---|---|---|
| Routing & layout | **UI Prototype Only** — works locally | React Router 7 `createBrowserRouter`; flat children under `Layout`. |
| Invoice list / detail | **UI Prototype Only + Simulated Workflow** | Reads/writes go through `store.ts`. |
| Create invoice | **Simulated Workflow + Local State Persistence (volatile)** | Created invoice survives until page reload. |
| Add payment | **Simulated Workflow** | Real status recompute happens client-side. |
| Quotation list | **UI Prototype Only (read-only)** | Create/Edit not built. |
| Quotation create / send / convert | **UI Not Implemented** | No screen exists. |
| Debt management | **Simulated Workflow** | Aging computed at render time. |
| Customer management | **UI Prototype Only (read-only)** | Add/Edit/View not implemented. |
| Product management | **UI Prototype Only (read-only)** | Add/Edit not implemented. |
| Reports | **Mock Business Logic** | Monthly chart + aging table hard-coded; only Top-5 reads real data. |
| Settings | **UI Prototype Only** | All save buttons inert; inputs uncontrolled. |
| Templates — visual builder | **UI Prototype Only** | Schema editor renders; persistence missing. |
| Templates — HTML editor | **UI Prototype Only** | Monaco mounted; save missing. |
| Authentication | **Auth Not Implemented** | Hard-coded user in `Header.tsx`. |
| Authorization (RBAC) | **Auth Not Implemented** | No guards. |
| Tenant isolation | **Backend Not Implemented** | No tenant model. |
| Audit logging | **Backend Not Implemented** | No log writer. |
| Notification center | **UI Prototype Only** | Always-red bell with no list. |
| Global search (header) | **UI Prototype Only** | Input unwired. |
| Print / PDF | **UI Prototype Only** | Buttons have no handlers. |
| Export Excel | **UI Prototype Only** | Buttons have no handlers. |
| Email / reminders | **Backend Not Implemented** | No delivery channel. |
| Persistence | **Local State Persistence (volatile, in-memory)** | Lost on refresh. |

Status flag glossary (per the new brief):
- **UI Prototype Only** — JSX renders, no behavior.
- **Simulated Workflow** — Client-side logic mimics what the backend would do.
- **Local State Persistence** — Lives only in the current tab's memory.
- **Mock Business Logic** — Hard-coded values, not derived from real data.
- **Backend Not Implemented** — No service exists.
- **Database Not Implemented** — No collection / table / connection exists.
- **Auth Not Implemented** — No identity / session / RBAC.

---

## 6. Document set, by audience

| Audience | Read first |
|---|---|
| **Future backend developer** | `architecture/missing-backend-components.md` → `architecture/missing-persistence-layer.md` → `future-architecture/<module>.md` |
| **Architect** | `architecture/current-architecture.md` → `architecture/current-technical-limitations.md` → `architecture/missing-*.md` |
| **Business Analyst** | `overview/executive-summary.md` → `overview/business-objectives.md` → `modules/<module>.md` |
| **QA** | `qa/qa-test-scenarios.md` → `qa/validation-rules.md` → `gap-analysis/known-issues.md` |
| **New product team** | This file → `architecture/current-architecture.md` → `architecture/system-classification.md` |
| **Security reviewer** | `architecture/missing-authentication.md` → `architecture/missing-authorization.md` → `gap-analysis/security-risks.md` |

---

## 7. Reading rules — do not confuse layers

When reading any module SRS file (`docs/modules/*.md`):

- The "Main Workflow" section describes **what the UI does today** (Simulated Workflow).
- The "API contract (recommended)" section describes **what the future backend MUST provide** (RECOMMENDED — not a description of existing code).
- The "Business Rules" section is a mix: rules with a `Source` column pointing to a `.tsx` line number are [VERIFIED] from code; rules without such a pointer are [INFERRED] or [RECOMMENDED].

When reading any gap-analysis file (`docs/gap-analysis/*.md`):

- Issue IDs prefixed `ISSUE-` are defects in the current prototype.
- Issue IDs prefixed `MISS-` are features absent from the current prototype.
- Issue IDs prefixed `ARCH-`, `SECR-`, `RULE-`, `TD-` are forward-looking findings about the gap between the prototype and a production system.

The reader MUST NOT assume that any module is "done" merely because it has a detailed SRS — the SRS describes intended behavior; the implementation status matrix is the source of truth for completeness.
