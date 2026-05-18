# Database Dictionary — Invoice Pro

> **Status:** The current build has **no database**. The schema below is **reverse-engineered from the TypeScript types** in `src/app/types.ts`, `src/app/types/template.ts`, and the mock data in `src/app/data/mockData.ts`. It is intended as the authoritative target schema for the production backend.

Target RDBMS: **PostgreSQL 14+** (or MySQL 8+). Naming convention: snake_case tables and columns.

---

## Conventions
- Primary keys: `BIGSERIAL` / `UUID v4`. We use **UUID v4** below for portability and tenant-safe IDs.
- All monetary amounts: `NUMERIC(18, 2)` (sufficient for VND with no decimals, and headroom).
- Dates: `DATE` for business dates, `TIMESTAMPTZ` for system timestamps.
- All tables have `created_at TIMESTAMPTZ NOT NULL DEFAULT now()` and `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`.
- All tables (except `tenants`) have `tenant_id UUID NOT NULL` + FK to `tenants(id)` for multi-tenant isolation.
- All deletes are SOFT via `deleted_at TIMESTAMPTZ NULL` (except `payments`, which are append-only).

---

## Table: `tenants`
Single shop / company subscription.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Tenant ID |
| name | VARCHAR(200) | NOT NULL | Display name |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |

---

## Table: `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | — |
| tenant_id | UUID | NOT NULL, FK → tenants(id) | — |
| email | VARCHAR(120) | NOT NULL | Unique per tenant |
| password_hash | TEXT | NOT NULL | bcrypt |
| full_name | VARCHAR(120) | NOT NULL | Display |
| phone | VARCHAR(20) | NULL | VN phone |
| role | VARCHAR(20) | NOT NULL CHECK IN ('ADMIN','ACCOUNTANT','SALES','VIEWER') | RBAC |
| status | VARCHAR(10) | NOT NULL CHECK IN ('active','inactive') DEFAULT 'active' | Lifecycle |
| avatar_url | TEXT | NULL | — |
| last_login_at | TIMESTAMPTZ | NULL | — |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |

**Indexes / constraints**
- UNIQUE(tenant_id, lower(email))
- INDEX(tenant_id)

---

## Table: `customers`
Maps to `Customer` in `src/app/types.ts`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | — |
| tenant_id | UUID | NOT NULL, FK | — |
| code | VARCHAR(20) | NOT NULL | Business code (`CUST001`) |
| name | VARCHAR(200) | NOT NULL | Legal name |
| phone | VARCHAR(20) | NOT NULL | — |
| email | VARCHAR(120) | NOT NULL | — |
| address | VARCHAR(300) | NOT NULL | — |
| tax_code | VARCHAR(20) | NULL | VN MST |
| status | VARCHAR(10) | NOT NULL CHECK IN ('active','inactive') | — |
| created_at | TIMESTAMPTZ | NOT NULL | seed `createdAt` |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | soft-delete |

**Notes**
- `totalDebt` in the TS type is **derived** at read time (Σ open invoice `remaining_balance`). Do **not** store it.

**Indexes**
- UNIQUE(tenant_id, code)
- INDEX(tenant_id, name)
- INDEX(tenant_id, phone)

---

## Table: `products`
Maps to `Product`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | — |
| tenant_id | UUID | NOT NULL, FK | — |
| code | VARCHAR(20) | NOT NULL | `PROD001` |
| name | VARCHAR(200) | NOT NULL | — |
| category | VARCHAR(100) | NOT NULL | Free text; used for filtering |
| unit | VARCHAR(20) | NOT NULL | `bao`, `m³`, `viên`, … |
| price | NUMERIC(18,2) | NOT NULL CHECK (price ≥ 0) | Default unit price (VND) |
| stock | NUMERIC(18,2) | NOT NULL CHECK (stock ≥ 0) DEFAULT 0 | On-hand |
| description | TEXT | NULL | — |
| status | VARCHAR(10) | NOT NULL DEFAULT 'active' | Soft activate/deactivate |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | — |

**Indexes**
- UNIQUE(tenant_id, code)
- INDEX(tenant_id, category)

---

## Table: `invoices`
Maps to `Invoice`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | — |
| tenant_id | UUID | NOT NULL, FK | — |
| invoice_number | VARCHAR(30) | NOT NULL | e.g. `HD-2026-001` |
| customer_id | UUID | NOT NULL, FK → customers(id) | — |
| customer_name | VARCHAR(200) | NOT NULL | **Snapshot** at issue time |
| customer_phone | VARCHAR(20) | NOT NULL | Snapshot |
| customer_address | VARCHAR(300) | NOT NULL | Snapshot |
| issue_date | DATE | NOT NULL | — |
| due_date | DATE | NOT NULL | — |
| status | VARCHAR(10) | NOT NULL CHECK IN ('draft','unpaid','partial','paid','overdue') | — |
| subtotal | NUMERIC(18,2) | NOT NULL | Σ line totals |
| discount | NUMERIC(18,2) | NOT NULL DEFAULT 0 | Invoice-level (VND) |
| tax | NUMERIC(18,2) | NOT NULL DEFAULT 0 | VAT amount |
| shipping | NUMERIC(18,2) | NOT NULL DEFAULT 0 | — |
| total | NUMERIC(18,2) | NOT NULL | `subtotal − discount + tax + shipping` |
| paid_amount | NUMERIC(18,2) | NOT NULL DEFAULT 0 | Σ payments |
| remaining_balance | NUMERIC(18,2) | NOT NULL | `total − paid_amount` |
| notes | TEXT | NULL | — |
| template_id | UUID | NULL, FK → templates(id) | Template used / locked at issue |
| salesperson_user_id | UUID | NULL, FK → users(id) | — |
| created_by_user_id | UUID | NOT NULL, FK → users(id) | — |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | — |

**Constraints**
- UNIQUE(tenant_id, invoice_number)
- CHECK (paid_amount ≥ 0 AND paid_amount ≤ total)
- CHECK (remaining_balance = total − paid_amount)
- INDEX(tenant_id, status)
- INDEX(tenant_id, customer_id)
- INDEX(tenant_id, due_date) — for overdue scan

---

## Table: `invoice_items`
Maps to `InvoiceItem`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | — |
| tenant_id | UUID | NOT NULL | — |
| invoice_id | UUID | NOT NULL, FK → invoices(id) ON DELETE CASCADE | — |
| product_id | UUID | NULL, FK → products(id) | NULL allows ad-hoc items |
| product_name | VARCHAR(200) | NOT NULL | Snapshot |
| quantity | NUMERIC(18,2) | NOT NULL CHECK (quantity > 0) | — |
| unit_price | NUMERIC(18,2) | NOT NULL CHECK (unit_price ≥ 0) | — |
| discount | NUMERIC(18,2) | NOT NULL DEFAULT 0 CHECK (discount ≥ 0) | Absolute VND line discount |
| line_total | NUMERIC(18,2) | NOT NULL | `quantity × unit_price − discount` |
| position | INT | NOT NULL | Display order |

**Constraints**
- CHECK (line_total = quantity * unit_price - discount)
- INDEX(invoice_id, position)

---

## Table: `payments`
Maps to `Payment`. **Append-only.**

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | — |
| tenant_id | UUID | NOT NULL | — |
| invoice_id | UUID | NOT NULL, FK → invoices(id) | — |
| amount | NUMERIC(18,2) | NOT NULL CHECK (amount > 0) | — |
| payment_date | DATE | NOT NULL | — |
| method | VARCHAR(20) | NOT NULL CHECK IN ('cash','bank_transfer','check','other') | — |
| reference | VARCHAR(50) | NULL | Bank txn code |
| note | TEXT | NULL | — |
| created_by_user_id | UUID | NOT NULL, FK → users(id) | — |
| created_at | TIMESTAMPTZ | NOT NULL | — |

**No `updated_at` / `deleted_at`** — append-only.

**Indexes**
- INDEX(tenant_id, invoice_id)
- INDEX(tenant_id, payment_date)

---

## Table: `quotations`
Maps to `Quotation`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | — |
| tenant_id | UUID | NOT NULL | — |
| quotation_number | VARCHAR(30) | NOT NULL | `BG-2026-001` |
| customer_id | UUID | NOT NULL, FK | — |
| customer_name | VARCHAR(200) | NOT NULL | Snapshot |
| issue_date | DATE | NOT NULL | — |
| valid_until | DATE | NOT NULL | — |
| status | VARCHAR(10) | NOT NULL CHECK IN ('draft','sent','accepted','rejected','expired') | — |
| total | NUMERIC(18,2) | NOT NULL | — |
| notes | TEXT | NULL | — |
| converted_invoice_id | UUID | NULL, FK → invoices(id) | Set on conversion |
| created_by_user_id | UUID | NOT NULL, FK → users(id) | — |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | — |

**Constraints**
- UNIQUE(tenant_id, quotation_number)
- CHECK (valid_until >= issue_date)
- INDEX(tenant_id, status)
- INDEX(tenant_id, customer_id)

---

## Table: `quotation_items`
Same shape as `invoice_items` but FK → `quotations(id)`.

| Column | Type | Notes |
|---|---|---|
| id, tenant_id, quotation_id, product_id, product_name, quantity, unit_price, discount, line_total, position | as above | — |

---

## Table: `templates`
Maps to `TemplateSchema`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | — |
| tenant_id | UUID | NOT NULL | — |
| name | VARCHAR(120) | NOT NULL | — |
| version | VARCHAR(20) | NOT NULL DEFAULT '1.0' | — |
| paper_size | VARCHAR(10) | NOT NULL CHECK IN ('A4','A5','A6','Thermal') | — |
| orientation | VARCHAR(10) | NOT NULL CHECK IN ('portrait','landscape') | — |
| margins_json | JSONB | NOT NULL | `{top,right,bottom,left}` |
| primary_color | VARCHAR(7) | NOT NULL | Hex |
| blocks_json | JSONB | NOT NULL | Block array |
| custom_html | TEXT | NULL | When isCustomHTML |
| is_custom_html | BOOLEAN | NOT NULL DEFAULT false | — |
| is_default | BOOLEAN | NOT NULL DEFAULT false | Only 1 per tenant |
| is_active | BOOLEAN | NOT NULL DEFAULT true | — |
| created_at, updated_at, deleted_at | timestamps | — | — |

**Constraints**
- PARTIAL UNIQUE INDEX (tenant_id) WHERE is_default — only one default per tenant.

---

## Table: `tenant_settings`
Maps to `Settings.tsx` form.

| Column | Type | Notes |
|---|---|---|
| tenant_id | UUID | PK, FK |
| company_name | VARCHAR(200) | — |
| company_tax_code | VARCHAR(20) | — |
| company_address | VARCHAR(300) | — |
| company_phone | VARCHAR(30) | — |
| company_email | VARCHAR(120) | — |
| invoice_prefix | VARCHAR(10) | e.g. 'HD-' |
| next_invoice_number | INT | atomic increment |
| default_due_days | INT | 0–365 |
| default_tax_rate | NUMERIC(5,2) | 0–100 |
| auto_tax | BOOLEAN | default true |
| auto_email | BOOLEAN | default false |
| payment_reminder | BOOLEAN | default true |
| updated_at | TIMESTAMPTZ | — |

---

## Table: `user_notification_prefs`

| Column | Type | Notes |
|---|---|---|
| user_id | UUID | PK, FK |
| notify_new_invoice | BOOLEAN | default true |
| notify_payment | BOOLEAN | default true |
| notify_overdue | BOOLEAN | default true |
| updated_at | TIMESTAMPTZ | — |

---

## Table: `audit_logs`
Append-only.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| tenant_id | UUID | — |
| actor_user_id | UUID | — |
| actor_role | VARCHAR(20) | — |
| action | VARCHAR(60) | e.g. `invoice.create` |
| resource_type | VARCHAR(40) | — |
| resource_id | UUID | — |
| before_json | JSONB | NULL on create |
| after_json | JSONB | NULL on delete |
| ip | INET | — |
| user_agent | TEXT | — |
| occurred_at | TIMESTAMPTZ | DEFAULT now() |

INDEX(tenant_id, resource_type, resource_id, occurred_at DESC).

---

## Enumerations (used by the app)

| Enum | Values |
|---|---|
| InvoiceStatus | `draft`, `unpaid`, `partial`, `paid`, `overdue` |
| PaymentMethod | `cash`, `bank_transfer`, `check`, `other` |
| QuotationStatus | `draft`, `sent`, `accepted`, `rejected`, `expired` |
| UserRole | `ADMIN`, `ACCOUNTANT`, `SALES`, `VIEWER` |
| UserStatus / CustomerStatus / ProductStatus | `active`, `inactive` |
| PaperSize | `A4`, `A5`, `A6`, `Thermal` |
| Orientation | `portrait`, `landscape` |
| Alignment | `left`, `center`, `right` |
| HeaderLayout | `logo-left`, `logo-center`, `logo-right` |
| TotalsAlign | `left`, `right` |

---

## Derived fields (NEVER stored)

| Field | Source |
|---|---|
| `customers.total_debt` | `Σ invoices.remaining_balance WHERE status != 'draft'` |
| `dashboard.monthly_revenue` | `Σ payments.amount WHERE payment_date IN current month` (cash basis) OR (invoiced basis) `Σ invoices.total WHERE issue_date IN month` |
| `debts.aging` | bucketed by `today − due_date` |
