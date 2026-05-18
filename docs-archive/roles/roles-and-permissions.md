# Roles and Permissions — Invoice Pro

## Purpose
Define the **current role model** (a single hard-coded administrator) and the **recommended target RBAC** that any production deployment should implement. Every action surface in the UI is mapped to a role.

---

## 1. Current state (as implemented)

- **No authentication.** No `/login` route, no session, no JWT.
- `components/Header.tsx` displays a constant user: **"Nguyễn Văn An — Quản trị viên"** with menu items *Hồ sơ / Cài đặt / Đăng xuất* (cosmetic only — no handlers).
- All routes are reachable without checks.
- No tenant isolation (single dataset for all visitors).

> **Implication:** the current build is a **demo / prototype**. Production MUST add auth + RBAC before going live.

---

## 2. Target role model (recommended)

| Code | Role | Vietnamese label | Description |
|---|---|---|---|
| `ADMIN` | Administrator | Quản trị viên | Owner / system administrator. Full access. |
| `ACCOUNTANT` | Accountant | Kế toán | Issue invoices, record payments, manage debts and reports. |
| `SALES` | Sales | Nhân viên kinh doanh | Issue quotations, draft invoices, manage customers. |
| `VIEWER` | Viewer / Manager | Người xem / Quản lý | Read-only oversight, reporting. |

Multi-role assignment per user is recommended (e.g. an owner is both `ADMIN` and `ACCOUNTANT`).

---

## 3. Per-role responsibilities

### 3.1 Administrator
- **Responsibilities:** company profile, invoice template, user management, system-wide settings, notification configuration.
- **Accessible modules:** all.
- **Allowed actions:** every CRUD + all settings + user lifecycle + delete invoices (soft-delete recommended) + override numbering.
- **Restricted actions:** none.

### 3.2 Accountant
- **Responsibilities:** invoicing, collections, debts, reporting.
- **Accessible modules:** Dashboard, Invoices, Quotations, Debts, Customers, Products (read), Reports.
- **Allowed actions:** create invoice (draft & finalize), record payment, view all invoices, view all customers/products, generate and export reports.
- **Restricted actions:** edit company info, edit templates, manage users, change numbering/VAT defaults.

### 3.3 Sales
- **Responsibilities:** pre-sales (quotations), order capture (drafts).
- **Accessible modules:** Quotations, Invoices (create + view own), Customers, Products (read).
- **Allowed actions:** create/edit/send quotation, draft invoice, add new customer, view product catalog.
- **Restricted actions:** record payments, delete invoices, see Debts module, see Reports, change Settings.

### 3.4 Viewer / Manager
- **Responsibilities:** oversight.
- **Accessible modules:** Dashboard, Reports, Debts (read).
- **Allowed actions:** view dashboards, view reports, export reports.
- **Restricted actions:** all write actions.

---

## 4. Permission matrix

Legend: **C** create · **R** read · **U** update · **D** delete · **X** restricted action (e.g. mark paid, send) · **—** no access.

| Resource / Action | ADMIN | ACCOUNTANT | SALES | VIEWER |
|---|:---:|:---:|:---:|:---:|
| Dashboard view | R | R | R | R |
| Invoice — list | R | R | R (own) | — |
| Invoice — create draft | C | C | C | — |
| Invoice — finalize (status=unpaid) | C | C | — | — |
| Invoice — view detail | R | R | R (own) | — |
| Invoice — edit (UI button exists, no handler) | U | U | U (own draft) | — |
| Invoice — delete | D | — | — | — |
| Invoice — print/PDF (UI present) | X | X | X (own) | X |
| Payment — add | C | C | — | — |
| Payment — view history | R | R | R (own) | — |
| Payment — edit/delete | — | — | — | — |
| Quotation — list | R | R | R | R |
| Quotation — create | C | C | C | — |
| Quotation — send | X | X | X | — |
| Quotation — accept/reject (mark) | U | U | U | — |
| Debts — view aging | R | R | — | R |
| Debts — drilldown | R | R | — | R |
| Customer — list & view | R | R | R | R |
| Customer — create | C | C | C | — |
| Customer — edit | U | U | U (own) | — |
| Customer — delete | D | — | — | — |
| Product — list & view | R | R | R | R |
| Product — create | C | — | — | — |
| Product — edit | U | — | — | — |
| Product — delete | D | — | — | — |
| Reports — view | R | R | — | R |
| Reports — export (Excel/PDF) | X | X | — | X |
| Settings — company info | C/U | — | — | — |
| Settings — invoice numbering / VAT / due-days | C/U | — | — | — |
| Settings — notifications | C/U | C/U (own) | C/U (own) | C/U (own) |
| Templates — list | R | R | — | — |
| Templates — create / edit / clone / set default | C/U/D | — | — | — |
| Users — manage | C/R/U/D | — | — | — |

---

## 5. Tenant isolation (recommended)

If the system is deployed multi-tenant (one DB, many shops):

- Every row of `invoices`, `payments`, `customers`, `products`, `quotations`, `templates`, `settings` MUST carry a `tenant_id`.
- Every API call MUST filter by the caller's `tenant_id` (derived from the session, **never** trusted from the request body).
- Cross-tenant reads MUST return 404 (not 403) to avoid disclosing existence of foreign IDs.
- The hard-coded user in `Header.tsx` MUST be replaced by an authenticated profile.

---

## 6. UI consequences of RBAC

| UI element | Show only when |
|---|---|
| "Tạo hóa đơn mới" CTA | role has `Invoice:create` |
| "Thêm thanh toán" button on InvoiceDetail | role has `Payment:create` AND `invoice.remainingBalance > 0` AND `invoice.status !== 'draft'` |
| "Xuất Excel" / "Xuất PDF" report buttons | role has `Reports:export` |
| Sidebar entries (Báo cáo, Cài đặt) | role has access to that module |
| Invoice row action menu (Edit / Delete) | role has the action on that resource (and ownership where relevant) |
| Settings page sections | only ADMIN sees Company info / Invoice numbering; everyone sees their own Notification toggles |

---

## 7. Audit logging (recommended)

Every write MUST emit an audit record:

```
{
  id, tenant_id, actor_user_id, actor_role,
  action: "invoice.create" | "invoice.update" | "payment.create" | "settings.update" | ...,
  resource_type, resource_id,
  before, after,        -- JSON snapshots
  ip, user_agent, occurred_at
}
```

Append-only; no UI for deletion.
