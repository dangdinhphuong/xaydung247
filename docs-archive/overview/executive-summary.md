# Executive Summary — Invoice Pro (Web-based Invoice Management System)

**Document version:** 1.0
**Document date:** 2026-05-18
**Document type:** Reverse-engineered Business Requirement Document (BRD)
**Reconstructed from:** React + TypeScript implementation under `src/app/**`
**Language of product UI:** Vietnamese (vi-VN) — Currency VND.

---

## 1. Purpose

This document summarises the **business intent, scope, value proposition and high-level capabilities** of the Web-based Invoice Management System ("Invoice Pro"), reconstructed from the existing source code (no original spec was supplied). It is the entry-point for Product Managers, Business Analysts, Solution Architects, QA Leads, and onboarding developers.

---

## 2. Product summary

Invoice Pro is a **responsive, single-page web application** built for **small-to-medium Vietnamese merchants** — the seed catalog (xi măng, cát, đá, gạch, sắt thép, sơn) and the seed customer list (TNHH Xây Dựng Hoàng Long, Vật Liệu Xây Dựng Minh Tâm…) clearly target **construction-materials trading businesses (cửa hàng / công ty VLXD)**.

It supports the **entire receivables lifecycle**: issuing invoices, collecting payments in multiple instalments, aging outstanding debts, issuing quotations, maintaining customer and product masters, customising printable invoice templates (drag-and-drop visual builder + raw-HTML editor), and producing management reports.

---

## 3. Business problem solved

| Pain point at the merchant | How Invoice Pro addresses it |
|---|---|
| Manual invoice creation in Word/Excel — slow, error-prone, no audit trail | Structured invoice form with auto-calculated line totals, subtotal, tax, discount, shipping, grand total. |
| Hard to know "who owes us how much, for how long" | Aged-debt dashboard (0–30, 31–60, 61+ days), per-customer drilldown, real-time `remainingBalance`. |
| Partial payments tracked on paper, easy to lose | Payment history per invoice, append-only, with method (cash/bank-transfer/check/other) and reference code. |
| Overdue invoices forgotten until customer disappears | Automatic status re-evaluation: `unpaid → overdue`, `partial → overdue` based on `dueDate` vs. today (see `store.updateOverdueStatuses`). |
| Inconsistent branding on printed invoices | Customisable templates: paper size (A4/A5), orientation, primary colour, block visibility (header, customer info, items table, totals, signature, footer), and full HTML override. |
| No visibility for owner on monthly revenue and top customers | Reports module: monthly revenue bar chart (6-month rolling), Top-5 customers by revenue, aged-debt analysis with percentage share. |

---

## 4. Target users

| Persona | Sample title | Daily usage |
|---|---|---|
| **Owner / Manager** | Chủ cửa hàng, Quản lý | Glance Dashboard each morning, review Reports weekly. |
| **Accountant** | Kế toán | Create invoices, record customer payments, chase overdue customers in `/debts`. |
| **Sales person** | Nhân viên kinh doanh | Issue quotations, draft invoices for new orders. |
| **Field user** | Người giao hàng / cashier | Mobile: search invoice, mark payment received at delivery, look up customer debt. |

Single-handed mobile use is a first-class concern — every list/detail screen has a parallel mobile layout (card list + bottom-sheet filter + fixed bottom action bar).

---

## 5. High-level capabilities

1. **Dashboard** with 4 KPIs (monthly revenue, total receivables, unpaid count, overdue count), revenue trend, debt aging pie, recent invoices.
2. **Invoice management** — list, search, filter by status, create (Draft or Unpaid), view, add payments, print/PDF (UI present).
3. **Quotation management** — issue and track offers with validity dates and accept/reject states.
4. **Debt / Receivables management** — per-customer aging, overdue count, drilldown to unpaid invoices.
5. **Customer master** — name, contact, address, tax code, current debt, active/inactive status.
6. **Product master** — SKU, category, unit, price, stock (low-stock highlighting < 100).
7. **Reports** — monthly revenue (6 months), top 5 customers, aged-debt distribution; CSV/PDF export buttons (UI present).
8. **Settings** — company profile, invoice numbering, default due-days, default VAT, automation toggles (auto-VAT, auto-email, payment reminders), notification preferences.
9. **Template customisation** — visual block editor (header / invoice-title / customer-info / invoice-meta / items-table / totals / payment-info / signature / footer) plus raw HTML editor with sample-data preview.

---

## 6. Technology context

| Layer | Implementation |
|---|---|
| Frontend | React 18, Vite 6, TypeScript, React Router 7, TailwindCSS 4, Radix UI / ShadCN, Recharts, Lucide, Sonner toasts. |
| State | Singleton in-memory `DataStore` (`src/app/data/store.ts`) seeded from `mockData.ts`. **No backend or persistence exists in the current build.** |
| Template editor | Monaco editor + react-dnd for visual block layout. |
| Build | `vite dev` / `vite build`. |
| Backend (to be built) | Recommended NestJS or Spring Boot exposing the contract defined by `store.ts`. |
| Database (to be built) | Recommended PostgreSQL / MySQL. Schema is reverse-engineered in `/docs/database/`. |

---

## 7. Out of scope (current build)

- Authentication, authorisation, user management — header shows a hard-coded "Nguyễn Văn An — Quản trị viên".
- Multi-tenant / multi-company isolation.
- True PDF generation and print pipeline (buttons exist, no handlers).
- Excel export (button exists, no handler).
- Email sending, SMS, payment reminders (settings toggles exist, no service).
- Audit log, soft-delete, change history.
- File attachments on invoices.

These are recommended for the production roadmap (see `/docs/qa/qa-test-scenarios.md` §Security and §Production-readiness gaps).

---

## 8. Success criteria

| KPI | Target |
|---|---|
| Time to issue one invoice (8 line items) | ≤ 60 seconds |
| Time to record a payment | ≤ 15 seconds |
| Aged-debt dashboard freshness | Real-time (no manual refresh) |
| Mobile usability score (Lighthouse) | ≥ 90 |
| Overdue mis-classification incidents | 0 (status auto-evaluated on every read) |

---

## 9. Document set

| File | Purpose |
|---|---|
| `/docs/overview/executive-summary.md` | This file. |
| `/docs/overview/system-overview.md` | Architecture, tech stack, route map, screen inventory. |
| `/docs/overview/business-objectives.md` | Numbered business objectives traced to source files. |
| `/docs/roles/roles-and-permissions.md` | RBAC matrix (current + recommended). |
| `/docs/modules/*.md` | One BA/SRS file per functional module. |
| `/docs/database/database-dictionary.md` | Tables, columns, types, constraints. |
| `/docs/database/entity-relationships.md` | ER diagram (text) + cardinalities. |
| `/docs/workflows/*.md` | Lifecycle / state machines / decision flows. |
| `/docs/qa/*.md` | Test scenarios, validation rules, security tests. |
