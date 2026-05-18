# Future Architecture — Index

> Per-module **build briefs** for the future backend + frontend integration work. Each file follows a uniform 8-section template so the same reader experience repeats across modules.

---

## File template

Every per-module file contains:

1. **Current Frontend Implementation** **[VERIFIED]** — what the SPA already does.
2. **Missing Backend Requirements** **[RECOMMENDED]** — gaps to close.
3. **Recommended API Design** **[RECOMMENDED]** — endpoints, payloads, permissions.
4. **Recommended Database Tables / Views** **[RECOMMENDED]** — references `database/database-dictionary.md`.
5. **Recommended Auth Flow** **[RECOMMENDED]** — guards & permissions to apply.
6. **Recommended Validation Strategy** **[RECOMMENDED]** — references `qa/validation-rules.md`.
7. **Recommended Audit Logging** **[RECOMMENDED]** — events to record.
8. **Recommended State Persistence** **[RECOMMENDED]** — TanStack Query keys + invalidation.

---

## Files

| File | Module |
|---|---|
| [dashboard.md](./dashboard.md) | Dashboard (`/`) |
| [invoices.md](./invoices.md) | Invoice Management (list / create / detail / payment) |
| [quotations.md](./quotations.md) | Quotation Management |
| [debts.md](./debts.md) | Debt / Receivables |
| [customers.md](./customers.md) | Customer Management |
| [products.md](./products.md) | Product Management |
| [reports.md](./reports.md) | Reports (defers to `architecture/missing-reporting-engine.md`) |
| [settings.md](./settings.md) | Settings (company, invoice, notifications) |
| [templates.md](./templates.md) | Invoice Templates (visual builder + HTML editor) |
| [authentication.md](./authentication.md) | Authentication (defers to `architecture/missing-authentication.md`) |
| [users.md](./users.md) | User Management & RBAC |
| [notifications.md](./notifications.md) | In-app notifications |

---

## Cross-references

- Verification convention & system classification: `architecture/system-classification.md`.
- Cross-module architecture documents: `architecture/missing-*.md`.
- Database schema: `database/database-dictionary.md`, `database/entity-relationships.md`.
- Permission matrix: `roles/roles-and-permissions.md`.
- Validation rule codes: `qa/validation-rules.md`.
- Test scenarios: `qa/qa-test-scenarios.md`, `qa/security-test-cases.md`.
- Status board: `gap-analysis/implementation-status.md`.

---

## How to use a per-module file as a build brief

1. Pick the module (e.g. `invoices.md`).
2. Read §1 to understand what already exists in the SPA.
3. Read §2 to understand the gap.
4. Implement §3 (API) backed by §4 (DB) under §5 (auth) with §6 (validation) and §7 (audit).
5. Update the SPA's data layer per §8 (TanStack Query keys & invalidations).
6. Update `gap-analysis/implementation-status.md` to flip the relevant rows from prototype flags to "Fully Implemented" once UI + API + DB + validation are all in place.
