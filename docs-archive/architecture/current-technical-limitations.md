# Current Technical Limitations — Invoice Pro

> Constraints that the current prototype imposes on usage. All entries are **[VERIFIED]** unless noted.

---

## 1. Persistence limitations

| ID | Limitation | Consequence |
|---|---|---|
| LIM-PER-01 | All data lives in JavaScript object references in a single browser tab. | Refresh → reset to seed data. |
| LIM-PER-02 | No `localStorage`, `sessionStorage`, `IndexedDB`, or Service Worker writes. | Closing the tab loses all changes. |
| LIM-PER-03 | No cross-tab synchronization. | Each tab has its own dataset. |
| LIM-PER-04 | No backup, export, or import of working state. | Demo data cannot be saved between sessions. |
| LIM-PER-05 | Seed data deep-cloned at module load via `JSON.parse(JSON.stringify(...))`. | Any non-JSON-safe values (Date objects, functions) would be lost. Currently all seeds are plain objects, so no issue today. |

---

## 2. Networking limitations

| ID | Limitation | Consequence |
|---|---|---|
| LIM-NET-01 | No HTTP calls anywhere in the source. | No remote authentication, no external integrations. |
| LIM-NET-02 | No environment variables (`VITE_*` not used). | Cannot configure API endpoints per environment. |
| LIM-NET-03 | No WebSocket / EventSource / WebRTC. | No real-time updates. |

---

## 3. Authentication & authorization limitations

| ID | Limitation | Consequence |
|---|---|---|
| LIM-AUTH-01 | No `/login` route; visitor is implicitly an admin. | Any user with the URL has full powers. |
| LIM-AUTH-02 | Header shows hard-coded "Nguyễn Văn An — Quản trị viên". | Cannot differentiate users. |
| LIM-AUTH-03 | No `<AuthGuard>` on routes, no role checks in UI. | Cannot restrict modules by role. |
| LIM-AUTH-04 | No tenant model. | Single shared dataset; deploying multi-tenant impossible. |
| LIM-AUTH-05 | Avatar dropdown items "Hồ sơ / Cài đặt / Đăng xuất" have no handlers. | Decorative only. |

See also `architecture/missing-authentication.md` and `architecture/missing-authorization.md`.

---

## 4. State management limitations

| ID | Limitation | Consequence |
|---|---|---|
| LIM-STATE-01 | `DataStore` is not a reactive store. Mutations do not notify subscribers. | Other mounted pages do not re-render after a mutation in a sibling page. |
| LIM-STATE-02 | Pages locally cache via `useState(store.getInvoice(id))`, then manually re-call after mutations. | Risk of stale local copies if multiple sub-components mutate. |
| LIM-STATE-03 | No query cache, no de-duplication, no invalidation primitives. | Every page re-runs its derived calculations from scratch. |
| LIM-STATE-04 | `react-hook-form` declared in deps but never used. | Form state hand-rolled, inconsistent across pages. |

See also `architecture/state-management-strategy.md`.

---

## 5. UI / responsive limitations

| ID | Limitation | Consequence |
|---|---|---|
| LIM-UI-01 | Mobile vs. desktop renderings are duplicated in JSX. | Changes drift between layouts. |
| LIM-UI-02 | No global loading skeleton, no global error boundary. | Future API failures will produce blank pages. |
| LIM-UI-03 | No empty / welcome state for new tenants on Dashboard, Customers, Products. | Confusing first-use. |
| LIM-UI-04 | No accessibility audit performed; ARIA labels not exhaustive. | Likely fails WCAG 2.1 AA spot checks. |
| LIM-UI-05 | No print stylesheet; `@media print` rules absent. | "In" prints the whole UI, not just the invoice body. |

---

## 6. Business-rule simulation limitations

| ID | Limitation | Consequence |
|---|---|---|
| LIM-BR-01 | Invoice numbering uses hard-coded `'INV'` prefix (see `gap-analysis/known-issues.md` ISSUE-001). Settings prefix ignored. | All new invoices share the literal `INV20260001`. |
| LIM-BR-02 | `defaultDueDays` setting ignored — `dueDate` hard-coded to today + 30. | Cannot configure per shop. |
| LIM-BR-03 | `taxRate` and `autoTax` settings ignored. | VAT amount is manual. |
| LIM-BR-04 | Aging buckets differ between `/debts` (3) and `/reports` (4). | Reports disagree. |
| LIM-BR-05 | Dashboard `totalDebt` includes drafts (`/debts` excludes them). | KPI inflated. |
| LIM-BR-06 | `calculateStatus` cannot represent "partial + past due" — collapses into `overdue`. | Reporting blind spot. |
| LIM-BR-07 | `+12.5%` trend chip on Dashboard is hard-coded. | Misleading KPI. |
| LIM-BR-08 | `Reports.tsx` monthly chart series is hard-coded — does not reflect actual invoices/payments. | Chart is decorative. |
| LIM-BR-09 | `Reports.tsx` aging table series is hard-coded. | Aging report is decorative. |

---

## 7. Data integrity limitations

| ID | Limitation | Consequence |
|---|---|---|
| LIM-DATA-01 | Payment IDs generated client-side as `'PAY'+Date.now()`. | Collision risk under rapid double-click. |
| LIM-DATA-02 | No idempotency mechanism on add-payment. | Double-submit creates two payments. |
| LIM-DATA-03 | `Customer.totalDebt` stored AND derived (`currentDebt` recomputed in UI). | Two sources of truth; will diverge once data mutates. |
| LIM-DATA-04 | Quantity / price / discount inputs accept negative values via paste despite `min="0"`. | Negative line totals possible. |
| LIM-DATA-05 | Line discount can exceed line gross → negative `lineTotal`. | Wrong invoice totals. |
| LIM-DATA-06 | No validation of `dueDate ≥ issueDate`. | Past-due invoices on creation. |

---

## 8. Reporting limitations

| ID | Limitation | Consequence |
|---|---|---|
| LIM-RPT-01 | Monthly revenue chart uses 6 hard-coded months. | Not a real report. |
| LIM-RPT-02 | Top-5 customers computed from `paidAmount` (cash basis). | Definition not documented; differs from "Tổng doanh thu" elsewhere. |
| LIM-RPT-03 | Aging report data hard-coded. | Not a real report. |
| LIM-RPT-04 | No date-range filter. | Cannot answer "show me last quarter". |
| LIM-RPT-05 | Export buttons (PDF / Excel) inert. | No data extraction. |

See `architecture/missing-reporting-engine.md`.

---

## 9. Operational limitations

| ID | Limitation | Consequence |
|---|---|---|
| LIM-OPS-01 | No logging — only `console.log` calls (e.g. `TemplateList.tsx:handleSetDefault`). | No observability. |
| LIM-OPS-02 | No error tracker (Sentry etc.). | Crashes invisible. |
| LIM-OPS-03 | No metrics, no analytics. | Cannot measure usage. |
| LIM-OPS-04 | No CI/CD; no automated lint, typecheck, test. | Quality regressions undetected. |
| LIM-OPS-05 | No tests of any kind. | Refactors are blind. |

---

## 10. Security limitations (current prototype)

| ID | Limitation | Consequence |
|---|---|---|
| LIM-SEC-01 | No HTTPS / HSTS / CSP / CORS / rate-limit policy is enforced (irrelevant locally; critical once deployed). | Future deployment vulnerable. |
| LIM-SEC-02 | `Template.customHTML` rendered raw, no sanitisation. | Stored XSS risk once multi-user. |
| LIM-SEC-03 | All "PII" (customer phone, email, address, tax code) visible to any visitor. | Demo deployments must be access-restricted. |

See `gap-analysis/security-risks.md`.

---

## 11. Performance limitations

| ID | Limitation | Consequence |
|---|---|---|
| LIM-PERF-01 | All routes load all components eagerly — no `React.lazy` / route-level code splitting. | First paint loads Monaco, Recharts, react-dnd unnecessarily. |
| LIM-PERF-02 | `updateOverdueStatuses` runs on every `getInvoices` call (every render of list/detail). O(N) per render. | Negligible on 8 rows; problematic at 10⁴+. |
| LIM-PERF-03 | All KPI / aging / top-customer derivations recomputed each render — no `useMemo`. | Negligible today; problematic at scale. |

---

## 12. Implications for deployment

The current prototype **CAN** be deployed to:

- A laptop running `npm run dev` for stakeholder review.
- A private static host (Vercel preview, Netlify with password protection, intranet nginx behind SSO proxy).

The current prototype **CANNOT** be deployed to:

- The public Internet without an SSO / VPN / IP-restriction shield.
- Any environment where data must survive between sessions.
- Any environment where more than one user concurrently uses the system.
- Any environment with regulatory or compliance requirements (PDPL, tax audit, etc.).

---

## 13. Closing the gaps

Each limitation has a corresponding architecture or future-architecture document:

| Theme | See |
|---|---|
| Persistence | `architecture/missing-persistence-layer.md`, `architecture/mock-data-strategy.md` |
| Backend | `architecture/missing-backend-components.md` |
| Auth | `architecture/missing-authentication.md`, `architecture/missing-authorization.md` |
| Audit | `architecture/missing-audit-system.md` |
| Reporting | `architecture/missing-reporting-engine.md` |
| State | `architecture/state-management-strategy.md` |
| Per-module fixes | `future-architecture/*.md` |
