# Architecture Documentation — Index

> Architectural documents describing **what the system is today** and **what it must become** to reach production. Reading order: top to bottom.

---

## Verified vs. recommended

All files in this folder distinguish:

- **[VERIFIED]** — observed in the source code (with file path + line numbers).
- **[INFERRED]** — deduced from naming or context.
- **[RECOMMENDED]** — proposed target; not present today.

A file's section may default-mark; read each section header carefully.

---

## Files

### Foundational (read first)

| File | Purpose |
|---|---|
| [system-classification.md](./system-classification.md) | Authoritative classification of what this codebase IS and IS NOT. Defines the verification convention used across all docs. |
| [current-architecture.md](./current-architecture.md) | Layered description of the prototype today: pages → utils → store → fixtures. Includes verification commands. |
| [current-technical-limitations.md](./current-technical-limitations.md) | Catalog of what the current prototype cannot do, organised by category (persistence, networking, auth, state, business rules, etc.). |

### Strategy

| File | Purpose |
|---|---|
| [mock-data-strategy.md](./mock-data-strategy.md) | How the fixtures simulate a populated system, and how to evolve them as real persistence arrives. |
| [state-management-strategy.md](./state-management-strategy.md) | Current `useState + singleton` model; recommended migration to TanStack Query + Zustand + RHF/Zod. |

### Missing infrastructure (target backend)

| File | Purpose |
|---|---|
| [missing-backend-components.md](./missing-backend-components.md) | Recommended NestJS service shape, queues, workers, observability. |
| [missing-persistence-layer.md](./missing-persistence-layer.md) | Postgres-first schema design with views, constraints, indexes, retention. MongoDB alternative sketch. |
| [missing-authentication.md](./missing-authentication.md) | Session-cookie or JWT design, endpoints, workflows, validation, security requirements. |
| [missing-authorization.md](./missing-authorization.md) | RBAC matrix per resource, tenant isolation, ownership predicates, server guards. |
| [missing-audit-system.md](./missing-audit-system.md) | Audit table, interceptor, retention, UI requirements. |
| [missing-reporting-engine.md](./missing-reporting-engine.md) | Report catalog, computation strategy, async export pipeline. |

---

## Recommended reading paths

### Future backend developer
1. `system-classification.md`
2. `current-architecture.md`
3. `missing-backend-components.md`
4. `missing-persistence-layer.md`
5. `missing-authentication.md` → `missing-authorization.md`
6. Per-module specs in `../future-architecture/*.md`
7. Build checklist in `../gap-analysis/implementation-status.md` §18

### Architect / Tech lead
1. `system-classification.md`
2. `current-technical-limitations.md`
3. `missing-backend-components.md`
4. `state-management-strategy.md`
5. `mock-data-strategy.md`

### BA / PM
1. `system-classification.md` (read §3 and §4 only)
2. `../overview/executive-summary.md`
3. `../gap-analysis/implementation-status.md`

### Security reviewer
1. `missing-authentication.md`
2. `missing-authorization.md`
3. `missing-audit-system.md`
4. `../gap-analysis/security-risks.md`
5. `../qa/security-test-cases.md`
