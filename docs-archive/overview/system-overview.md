# System Overview — Invoice Pro

## 1. Purpose

Describe the **architecture, tech stack, route map, screen inventory, and cross-cutting behaviors** of Invoice Pro as currently implemented.

---

## 2. Architecture (current)

```
┌────────────────────────────────────────────────────────────┐
│  Browser (SPA)                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ React 18 + Vite + React Router v7                  │   │
│  │ ┌────────────┐  ┌──────────────┐  ┌────────────┐   │   │
│  │ │ Pages      │→ │ Components   │→ │ ui/* (Radix)│  │   │
│  │ └────────────┘  └──────────────┘  └────────────┘   │   │
│  │        ↓                                            │   │
│  │ ┌────────────────────────────────┐                  │   │
│  │ │ DataStore singleton (in-memory)│                  │   │
│  │ │ src/app/data/store.ts          │                  │   │
│  │ └────────────────────────────────┘                  │   │
│  │        ↑ seeded from                                │   │
│  │ ┌────────────────────────────────┐                  │   │
│  │ │ mockData.ts (customers,        │                  │   │
│  │ │ products, invoices, payments,  │                  │   │
│  │ │ quotations)                    │                  │   │
│  │ └────────────────────────────────┘                  │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

- **Monolithic SPA**. No backend, no API, no database. All mutations live in `DataStore` and are lost on browser refresh (objects are deep-cloned at startup via `JSON.parse(JSON.stringify(initial...))`).
- The `DataStore` API surface (`getInvoices`, `getInvoice`, `addInvoice`, `updateInvoice`, `addPayment`, `getCustomers`, `getProducts`) is effectively **the REST contract** for a future backend.

---

## 3. Recommended target architecture (production)

```
React SPA ──HTTPS──▶ API Gateway ──▶ NestJS / Spring Boot service
                                       │
                                       ├─▶ PostgreSQL (transactional)
                                       ├─▶ Redis (cache, sessions)
                                       ├─▶ S3 / MinIO (PDF storage)
                                       └─▶ Mail/SMS provider (notifications)
```

---

## 4. Tech stack (as implemented)

| Concern | Library / Version |
|---|---|
| UI framework | React 18.3.1 |
| Build | Vite 6.3.5 (`npm run dev`, `npm run build`) |
| Language | TypeScript |
| Routing | react-router 7.13.0 (`createBrowserRouter`) |
| Styling | TailwindCSS 4.1.12, `tw-animate-css`, custom CSS in `src/styles/index.css` |
| UI primitives | Radix UI (@radix-ui/react-*), ShadCN-style wrappers under `src/app/components/ui/` |
| Forms | Native controlled components (`react-hook-form` is in dependencies but not used in core pages) |
| Icons | lucide-react 0.487 |
| Charts | recharts 2.15 (LineChart, BarChart, PieChart) |
| Notifications | sonner 2.0 (toaster mounted in `Layout.tsx`) |
| Dialog / Drawer | Radix dialog + Vaul for bottom sheets |
| Drag-and-drop | react-dnd 16 (for Template Builder) |
| Code editor | @monaco-editor/react 4.7 (for Template HTML editor) |
| Theming | next-themes (installed; system runs in light theme by default) |
| Date utilities | date-fns 3.6, native `Intl.NumberFormat`/`toLocaleDateString` for vi-VN |

---

## 5. Route map (from `src/app/routes.ts`)

| Path | Component | Purpose |
|---|---|---|
| `/` | `Dashboard` | KPIs + charts + recent invoices |
| `/invoices` | `InvoiceList` | List, search, filter invoices |
| `/invoices/create` | `CreateInvoice` | New-invoice form |
| `/invoices/:id` | `InvoiceDetail` | Invoice details + payment ops |
| `/quotations` | `QuotationManagement` | Quotation list |
| `/debts` | `DebtManagement` | Aged receivables by customer |
| `/customers` | `CustomerManagement` | Customer master |
| `/products` | `ProductManagement` | Product / SKU master |
| `/reports` | `Reports` | Revenue, top-customers, aging reports |
| `/settings` | `Settings` | Company / invoice / notification settings |
| `/settings/templates` | `TemplateList` | Printable-template catalog |
| `/settings/templates/new` | `TemplateBuilder` | Visual block editor |
| `/settings/templates/:id/edit` | `TemplateEditorVisual` | HTML editor with sample data |
| `/settings/templates/:id/preview` | `InvoicePreview` | Preview rendered template |
| `*` | `NotFound` | 404 page |

All routes are children of the single `Layout` route — `Layout` renders sidebar + header + mobile-nav + the `Outlet` for the active page + `<Toaster />`.

A pseudo-route `/menu` exists only as a tab on `MobileNav`; when the URL hits `/menu`, `Layout` opens the `MobileMenu` sheet via a `useEffect` (the path is not registered in the router, so it would 404 — *bug to fix*).

---

## 6. Screen inventory

| # | Screen | Mobile parallel | Empty state | Loading state |
|---|---|---|---|---|
| 1 | Dashboard | Yes (cards) | — | — |
| 2 | Invoice list | Yes (cards + bottom sheet filter + fixed bottom CTA) | "Không tìm thấy hóa đơn nào" | — |
| 3 | Invoice create | Limited mobile optimisation | "Chưa có sản phẩm nào" + "Thêm sản phẩm đầu tiên" | — |
| 4 | Invoice detail | Yes (cards + bottom action bar) | "Không tìm thấy hóa đơn" (full-page) + "Chưa có thanh toán nào" | — |
| 5 | Quotation list | Desktop only | "Không tìm thấy báo giá nào" | — |
| 6 | Debt management | Desktop only | "Không có công nợ nào" | — |
| 7 | Customer management | Desktop only | — | — |
| 8 | Product management | Yes (cards + bottom sheet + FAB) | "Không tìm thấy sản phẩm" | — |
| 9 | Reports | Desktop only | — | — |
| 10 | Settings | Yes (single column) | — | — |
| 11 | Template list | Yes | "Chưa có mẫu hóa đơn" + CTA | — |
| 12 | Template builder | Desktop | — | — |
| 13 | Template HTML editor | Desktop | — | — |
| 14 | Invoice preview | Desktop | — | — |
| 15 | 404 NotFound | Yes (centered) | — | — |

> **Gap:** No global loading / skeleton states; no error-boundary; no offline state.

---

## 7. Cross-cutting components

| Component | Responsibility |
|---|---|
| `Layout` | Frame: sidebar + header + main `Outlet` + mobile nav + Toaster. Closes mobile menu on route change. |
| `Sidebar` | Desktop left-nav (Dashboard, Hóa đơn, Báo giá, Công nợ, Khách hàng, Mặt hàng, Báo cáo, Cài đặt). Collapsible. |
| `Header` | Top bar: search box, notification bell (always shows red dot), user avatar dropdown (Hồ sơ / Cài đặt / Đăng xuất). |
| `MobileNav` | 5-tab bottom navigation: Tổng quan / Hóa đơn / Công nợ / Khách hàng / Menu. |
| `MobileMenu` | Bottom-sheet drawer with all sidebar items (mobile only). |
| `StatusBadge` | Renders invoice status pill with colour mapping (see workflows). |
| `SummaryCard` | KPI card with title, value, icon, optional trend. |
| `InvoiceCard` | Mobile card representation of an invoice in lists. |
| `PaymentModal` | Add-payment dialog with validation. |
| `PaymentTimeline` | Visual timeline of payments. |
| `FilterDrawer` | Bottom-sheet status filter (mobile). |
| `FilteredLink` | Wrapper around `react-router` `Link` that strips Figma-inspector props before forwarding to the DOM. |

---

## 8. Cross-cutting business rules

| ID | Rule |
|---|---|
| X-01 | All currency rendered via `formatCurrency(amount)` → `Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'})`. |
| X-02 | All dates rendered via `formatDate(date)` → `vi-VN` `dd/mm/yyyy`. |
| X-03 | `isOverdue(dueDate)` compares date-only (hours zeroed) — a payment due **today** is NOT overdue. |
| X-04 | `getDaysBetween(start, end)` returns `Math.ceil((end − start)/day)`. |
| X-05 | Brand primary colour `#1E88E5` (used in buttons, links, charts, badges) and its hover shade `#1976D2`. |
| X-06 | Toast feedback (sonner) is the only user feedback mechanism for create/update actions. |

---

## 9. Build & run

```bash
npm install
npm run dev      # Vite dev server
npm run build    # production bundle
```

No environment variables, no `.env`, no API base URL.
