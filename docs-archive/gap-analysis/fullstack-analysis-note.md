# Fullstack Analysis — Findings Note

**Date of analysis:** 2026-05-18
**Analyst:** BA / reverse-engineering pass triggered by Fullstack Analysis Mode brief.

---

## 1. Purpose

The Fullstack Analysis brief instructs an exhaustive review of:

- NestJS modules / controllers / services / DTOs / guards / interceptors / filters / gateways / queues / events / cron / strategies
- MongoDB schemas / repositories / aggregation pipelines / indexes
- Authentication, authorisation, tenant isolation, ownership
- Correlation between UI actions and DB writes

This note records the result of executing that brief against the repository at `d:/Codes/Web-based Invoice Management System`.

---

## 2. Executive finding

**No backend exists in this repository.** The codebase is a **frontend-only Vite + React SPA**. There is no NestJS service, no Express/Fastify service, no MongoDB schemas, no API layer, no persistence beyond an in-memory JavaScript class.

This was already documented in the BRD as the single most important finding:

- `docs/gap-analysis/architecture-limitations.md` → **ARCH-001 (Critical)** — "Frontend-only SPA with no backend or persistent storage."
- `docs/gap-analysis/known-issues.md` → **ISSUE-016 (Critical)** — "DataStore is in-memory and re-seeded on every page reload."
- `docs/overview/system-overview.md` §2 — Architecture diagram showing only the browser tier.

The Fullstack Analysis brief presupposes a NestJS + MongoDB stack that does not exist; therefore there is nothing to discover on the backend / DB layers beyond what is already captured.

---

## 3. Verification evidence

The following checks were performed and **all returned zero matches** (other than the noted React/Vite frontend files):

| Check | Tool | Result |
|---|---|---|
| `package.json` contains `@nestjs/*` | Grep | **0 matches** — dep absent |
| `package.json` contains `mongoose` | Grep | **0 matches** — dep absent |
| `package.json` contains `mongodb` | Grep | **0 matches** — dep absent |
| Files named `nest-cli.json` | Glob | **0 files** |
| Files named `app.module.ts` | Glob | **0 files** |
| Files named `main.ts` (backend bootstrap) | Glob | **0 files** |
| Files matching `**/*.module.ts` | Glob | **0 files** |
| Files matching `**/*.controller.ts` | Glob | **0 files** |
| Files matching `**/*.service.ts` | Glob | **0 files** |
| Files matching `**/*.dto.ts` | Glob | **0 files** |
| Files matching `**/*.schema.ts` (mongoose) | Glob | **0 files** |
| Files matching `**/*.entity.ts` | Glob | **0 files** |
| Strings `@Injectable()` / `@Controller(` / `@nestjs` / `mongoose` in `src/` | Grep | **0 matches** |
| `pnpm-workspace.yaml` declares packages? | Read | No — file contains only pnpm `allowBuilds` config |
| Root subdirectories | `ls` | Only `src/` (SPA), `docs/`, `guidelines/`, `node_modules/`, `.vscode/` — no `backend/`, `server/`, `api/`, `services/`, `apps/` |

### `package.json` declared runtime dependencies (full list)

React, Vite, React Router 7, TailwindCSS 4, Radix UI primitives, ShadCN components, recharts, lucide-react, sonner, date-fns, react-hook-form, react-dnd, embla-carousel, monaco-editor, vaul, cmdk — **all client-side libraries**. No HTTP server framework, no ORM, no DB driver.

---

## 4. What the implementation actually contains

The single existing "data layer" is the in-memory singleton documented in §2 of `docs/overview/system-overview.md`:

- `src/app/data/store.ts` — class `DataStore` exposing `getInvoices`, `getInvoice`, `addInvoice`, `updateInvoice`, `addPayment`, `getCustomers`, `getProducts`. Data is held in instance-private JavaScript arrays.
- `src/app/data/mockData.ts` — fixture arrays for customers, products, invoices, payments, quotations seeding the store at module load.

Every "API behaviour" entry in the existing documentation is therefore a **recommended target contract** for the future backend, not an analysis of an existing one.

---

## 5. Why the prior BRD/SRS does NOT need to be rewritten

The "Implementation Status" classification rule from the new brief states:

> A feature is considered FULLY IMPLEMENTED only if: UI + API + DB persistence + validation exist.

Applying that rule to this repository yields exactly the classification already used throughout `/docs/gap-analysis/implementation-status.md`:

- **No** feature can be **🟢 Fully Implemented** in the strict sense, because no API and no DB persistence exist anywhere.
- The current status matrix already reflects this: nearly every entry is 🟡 Partial, 🟠 UI Only, 🔵 Mock Data Only, 🔴 Backend Missing, or ❌ Missing.
- The cross-cutting concerns row already enumerates: Authentication 🔴, RBAC 🔴, Tenant isolation 🔴, Backend / persistence 🔴, Audit log 🔴, Notifications 🔴, Email pipeline 🔴, PDF pipeline 🔴, Jobs / cron 🔴, Observability ❌, CI/CD ❌, Tests ❌.

Therefore the existing documentation is **already aligned** with the strict fullstack rule. Rebuilding it on the assumption of a non-existent backend would fabricate content.

---

## 6. Authentication & security analysis (re-confirmation)

Per the strict brief categories:

| Concern | Findings |
|---|---|
| JWT flow | **Not implemented.** No `jsonwebtoken`, no `@nestjs/jwt`, no token storage, no `Authorization` header handling. See `gap-analysis/security-risks.md` SECR-001. |
| Guards | **Not implemented.** No `<AuthGuard>` wrapper around routes; no NestJS `CanActivate`. See SECR-002. |
| RBAC | **Not implemented.** Hard-coded "Quản trị viên" label in `Header.tsx`. See SECR-002 / `roles/roles-and-permissions.md`. |
| Tenant isolation | **Not implemented.** No `tenant_id` anywhere. See SECR-003 / ARCH-003. |
| Request context | **Not implemented.** No request lifecycle (browser-only). |
| User ownership checks | **Not implemented.** |
| SQL/NoSQL injection risk | **N/A** — no DB. Will be in scope once backend exists. See `qa/security-test-cases.md` §4. |
| XSS risk | **Documented.** `Template.customHTML` rendered raw → SECR-004 / ISSUE-018. |
| Mongo injection risk | **N/A** — no MongoDB. Would apply once a backend with `$where` or unsanitised query operators is added. |
| Unsafe HTML rendering | **Documented.** Same as XSS above. |

---

## 7. Correlation analysis (UI action → backend) — not applicable

Because there is no backend, no correlation analysis is meaningful. The existing `/docs/modules/*.md` files document each UI action's intended API contract (the contract that any future backend MUST implement) under the *"API contract (recommended)"* section of each module file. That is the closest possible mapping given the absence of an actual backend.

---

## 8. What would change if a backend repository were provided

If the user is working with a **separate backend repository** that was not supplied in this analysis (e.g. a sibling git repo such as `invoice-pro-api/`), the following deliverables would be added in a follow-up pass:

1. **Per-module BACKEND-IMPL.md** — actual controllers, services, guards, validation pipes, observed permission decorators, observed mongoose schemas, observed aggregation pipelines.
2. **Re-classification of `implementation-status.md`** — features that have real persistence and validation in the backend would be re-flagged 🟢 / 🟡 instead of 🔴.
3. **Correlation matrix** — per UI action: HTTP verb, endpoint, controller method, service method, DB collection(s) touched, validations applied, guards passed, events emitted, queues used.
4. **Real database dictionary** — replacing the recommended PostgreSQL schema in `docs/database/database-dictionary.md` with the actual MongoDB collections, indexes, and aggregation usage.
5. **Real workflow trace** — replacing the inferred state machines with the controller / service code paths actually responsible for state transitions.

---

## 9. Recommendation

If you intended this BRD/SRS to cover a fullstack system:

- **Provide the backend repository path** (e.g. `d:/Codes/Web-based Invoice Management System-api/`).
- I will then run a sibling reverse-engineering pass and merge the findings into the existing `/docs/` structure (per-module `*.md` will get an "Actual Implementation" subsection; `implementation-status.md` will be re-graded).

If this is the entire codebase:

- The existing documentation under `/docs/` is the authoritative record; **the system is a frontend prototype** and the gap-analysis already documents this as the headline finding.
- The `qa/qa-test-scenarios.md`, `qa/validation-rules.md`, `qa/security-test-cases.md`, `database/*.md`, and `gap-analysis/*.md` files define the **target** for the backend that needs to be built; no rewrite is required.

---

## 10. Files referenced

- `/docs/overview/system-overview.md` — architecture (current vs. recommended).
- `/docs/gap-analysis/architecture-limitations.md` — ARCH-001..019.
- `/docs/gap-analysis/known-issues.md` — ISSUE-001..030.
- `/docs/gap-analysis/security-risks.md` — SECR-001..022.
- `/docs/gap-analysis/implementation-status.md` — per-feature status matrix.
- `/docs/database/database-dictionary.md` — target schema for the backend to implement (PostgreSQL; recommend MongoDB-equivalent translation only if a Mongo backend is mandated).
