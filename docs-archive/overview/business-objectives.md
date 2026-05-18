# Business Objectives — Invoice Pro

## Purpose
Enumerate the **measurable business objectives** the system is built to satisfy. Each objective is traced to source-file evidence and to the requirements / test cases that verify it.

---

## Numbered objectives

| # | Objective | Rationale | Evidence (file) | Verified by |
|---|---|---|---|---|
| BO-1 | Issue, track and close sales invoices from creation to full payment. | Core revenue cycle. | `pages/CreateInvoice.tsx`, `data/store.ts:addInvoice/addPayment` | `qa/qa-test-scenarios.md` §Invoice lifecycle |
| BO-2 | Provide a real-time aged-debt picture per customer (0–30 / 31–60 / 61+ days). | Lets the merchant chase debt before it ages further. | `pages/DebtManagement.tsx` (`aging.current / thirtyDays / sixtyDaysPlus`) | `qa/qa-test-scenarios.md` §Receivables |
| BO-3 | Auto-flag overdue invoices without manual intervention. | Prevents "forgotten" debts. | `data/store.ts:updateOverdueStatuses()` (runs on every read) | `qa/qa-test-scenarios.md` §Overdue auto-detection |
| BO-4 | Accept multiple, partial payments per invoice with multiple payment methods. | Common B2B credit-sales pattern (Vietnamese VLXD industry). | `types.ts:Payment[]`, `components/PaymentModal.tsx`, methods `cash | bank_transfer | check | other` | `qa/validation-rules.md` §V-PAY |
| BO-5 | Issue and manage sales quotations with validity windows. | Pre-sales workflow. | `pages/QuotationManagement.tsx`, `types.ts:Quotation`, statuses `draft|sent|accepted|rejected|expired` | `workflows/quotation-workflow.md` |
| BO-6 | Maintain a customer master with real-time debt visibility. | Single source of truth for "ai nợ bao nhiêu". | `pages/CustomerManagement.tsx` (`currentDebt` derived) | `qa/qa-test-scenarios.md` §Customers |
| BO-7 | Maintain a product master with stock thresholds. | Lets the cashier surface low-stock alerts. | `pages/ProductManagement.tsx` (`stock < 100` red highlight) | `qa/qa-test-scenarios.md` §Products |
| BO-8 | Produce monthly revenue, top-5 customer, and aging reports for management. | Tactical / strategic decision support. | `pages/Reports.tsx` (BarChart + tables) | `qa/qa-test-scenarios.md` §Reports |
| BO-9 | Let the merchant customise the printable invoice template (branding, columns, layout). | Each shop has its own header / signature / legal text. | `types/template.ts`, `pages/TemplateBuilder.tsx`, `pages/TemplateEditorVisual.tsx`, `utils/defaultTemplate.ts` | `modules/templates.md` |
| BO-10 | Operate end-to-end in Vietnamese with VND formatting. | The target market is Vietnam-only. | `utils/formatters.ts` (`vi-VN`/`VND`), all UI strings | Manual UI review |
| BO-11 | Operate equally on mobile (field) and desktop (back office). | Salesperson / delivery agent uses phone. | Parallel table/card layouts; `MobileNav`, `MobileMenu`, `FilterDrawer` bottom sheet, fixed-bottom action bars | Responsive QA |
| BO-12 | (Recommended, not implemented) Restrict access by role and tenant. | Multi-user shops, multi-branch chains. | Hard-coded admin in `Header.tsx` — gap to close. | `roles/roles-and-permissions.md` |
| BO-13 | (Recommended) Configurable invoice numbering, default due-days, default VAT. | Standardises issuance per shop policy. | UI present in `pages/Settings.tsx`; not wired to logic. | `modules/settings.md` |
| BO-14 | (Recommended) Print and PDF export. | Customer must receive a physical/PDF invoice. | Buttons present in `InvoiceDetail.tsx`; no handler. | `qa/qa-test-scenarios.md` §Production-readiness |
| BO-15 | (Recommended) Excel export for receivables / customers / reports. | Accountant workflows. | Buttons present; no handler. | `qa/qa-test-scenarios.md` §Production-readiness |

---

## Non-functional objectives

| # | Objective | Target |
|---|---|---|
| NFR-1 | Page load (Dashboard) on 3G mobile | < 3 s First Contentful Paint |
| NFR-2 | Time to issue an invoice with 8 line items | ≤ 60 s |
| NFR-3 | Aged-debt accuracy | Status re-evaluated on every read (BR-DB-01) |
| NFR-4 | Currency / date locale | Strictly `vi-VN` / VND |
| NFR-5 | Accessibility | Radix primitives provide ARIA; production must verify WCAG 2.1 AA |
| NFR-6 | Browser support | Evergreen Chromium, Safari iOS 14+, Android Chrome 90+ |
| NFR-7 | Data persistence | (Current) volatile in-memory; (Target) ACID DB with daily backups |

---

## Out-of-scope (explicit)

- Procurement / purchase orders.
- Inventory transactions beyond display of `stock` field.
- General-ledger accounting and tax filings.
- Loyalty / coupon / discount-rule engine (line discount is a flat VND amount).
- POS hardware integration.
- Multi-currency.
