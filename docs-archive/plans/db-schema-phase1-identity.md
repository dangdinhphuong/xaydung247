---
title: DB Schema Phase 1 — Identity & Tenancy
status: Đã lập kế hoạch
created_date: 2026-05-18
started_date:
completed_date:
cancel_reason:
owner: ai (claude)
related_spec: docs/domain-reconciliation/canonical-business-rules.md
---

# Phase 1 — Identity & Tenancy

> **Phạm vi:** sinh các bảng nền tảng cho phép các phase sau (customers/products/invoices…) hoạt động an toàn theo multi-tenant + RBAC.
> **Nguồn quy tắc:** `docs/domain-reconciliation/canonical-business-rules.md` (mặc định) + 8 quyết định người dùng đã xác nhận trong session ngày 2026-05-18.
> **Không invent rule:** mọi field/constraint phải trace về 1 dòng canonical hoặc 1 quyết định đã được user xác nhận (cite bên dưới).

---

## 0. Quyết định nền (đã chốt session 2026-05-18)

| # | Quyết định | Nguồn |
|---|---|---|
| D-01 | VND precision: `NUMERIC(18,2)` cho mọi cột tiền | canonical CR-INV-08 ✅ |
| D-02 | Rounding: **HALF_EVEN** (banker's), tại bước aggregation cuối | canonical CR-INV-08 ✅ |
| D-03 | Payment model: **single-invoice** (`payments.invoice_id NOT NULL`), reversal qua `reverses_payment_id` | canonical CR-PAY-09 ✅ |
| D-04 | Invoice status enum: `draft\|unpaid\|partial\|paid\|void` + boolean `is_overdue` (KHÔNG có `overdue` trong enum) | canonical CR-S-01..03 ✅ |
| D-05 | RBAC: tenant-scoped roles + bảng `user_roles` M:N + global system roles (nullable `tenant_id`) | user decision (canonical chưa spec — sẽ patch canonical sau) |
| D-06 | Tax base: `(subtotal − discount) × rate / 100` | canonical CR-TAX-01..02 ✅ |
| D-07 | Discount: cả line + invoice cùng lúc, đều ABSOLUTE VND | canonical CR-L-02, CR-INV-02 ✅ |
| D-08 | Debts: SQL VIEW `v_customer_debt` (Phase 4) — chưa cần materialized | canonical CR-DEBT-05 ✅ |

**Phase 1 chỉ chạm D-05** (RBAC). Các quyết định khác áp dụng từ Phase 2+.

---

## 1. Phạm vi Phase 1

### 1.1 Bảng sinh trong phase này (6 bảng)

| Bảng | Mục đích | Multi-tenant scope |
|---|---|---|
| `tenants` | Root entity — mỗi tenant = 1 khách hàng SaaS | self (PK) |
| `users` | Tài khoản đăng nhập | tenant-scoped |
| `roles` | Vai trò (ADMIN, ACCOUNTANT, SALES, VIEWER, …) | tenant-scoped HOẶC global (NULL tenant_id) |
| `permissions` | Quyền nguyên tử kiểu `resource.action` | global (không scope tenant) |
| `role_permissions` | M:N — role nào có permission nào | (derived) |
| `user_roles` | M:N — user nào giữ role nào | tenant-scoped (kiểm chéo) |

### 1.2 KHÔNG làm trong Phase 1

- ❌ `tenant_settings` (Phase 3 — gắn với invoice numbering)
- ❌ `audit_logs` (Phase 4)
- ❌ `user_notification_prefs` (Phase 4)
- ❌ Email verification / password reset token tables → defer Phase 1.5 nếu cần
- ❌ Session / refresh token storage → quyết định cùng NestJS auth module
- ❌ Bất kỳ business entity nào (customers, products, invoices, …)

---

## 2. ERD Phase 1

```
                ┌───────────────┐
                │   tenants     │
                │   (root)      │
                └───┬───────────┘
                    │ 1
        ┌───────────┼───────────────┬────────────────┐
        │ N         │ N             │ N              │
   ┌────▼────┐ ┌────▼────┐    ┌─────▼─────┐
   │  users  │ │  roles  │    │ (future:  │
   │         │ │ (tenant │    │  customers│
   │         │ │ -scoped │    │  invoices │
   │         │ │  OR     │    │  …)       │
   │         │ │  global)│    └───────────┘
   └────┬────┘ └────┬────┘
        │ N        │ N
        │          │
        └────┬─────┘
             │ M:N (within same tenant)
        ┌────▼──────────┐
        │  user_roles   │
        └───────────────┘

   ┌─────────────┐                    ┌──────────────────┐
   │ permissions │  ◄──── M:N ────►  │ role_permissions │
   │  (global)   │                    └──────────────────┘
   └─────────────┘                            │ N
                                              │
                                         ┌────▼────┐
                                         │  roles  │
                                         └─────────┘
```

**Lưu ý quan hệ chéo tenant:**
- Một `user.tenant_id` cố định (1 user thuộc đúng 1 tenant — canonical user model).
- Một `role` có thể global (`tenant_id IS NULL`) hoặc thuộc 1 tenant cụ thể.
- Một `user_roles(user_id, role_id)`: HỢP LỆ chỉ khi `role.tenant_id IS NULL` hoặc `role.tenant_id = user.tenant_id`. **Enforce ở application layer** (DB CHECK liên bảng phức tạp; thay bằng trigger nếu cần defence-in-depth).

---

## 3. Enums cần định nghĩa (Phase 1)

| Enum | Values | Ghi chú |
|---|---|---|
| `UserStatus` | `active`, `inactive` | canonical CR-C-03 dùng pattern này; áp dụng cho users |
| `TenantStatus` | `active`, `suspended` | "suspended" cho việc ngừng dịch vụ; user không thể login khi tenant suspended |

**Không tạo enum cho role name** — role là dữ liệu (bảng `roles`), không phải enum. Cho phép tenant tạo custom role.

---

## 4. Chi tiết từng bảng

### 4.1 `tenants`

| Cột | Kiểu | NULL | Mặc định | Ghi chú |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | PK |
| `name` | VARCHAR(255) | NO | | Tên hiển thị tenant |
| `slug` | VARCHAR(64) | NO | | URL-safe, unique global |
| `status` | TenantStatus | NO | `'active'` | |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `deleted_at` | TIMESTAMPTZ | YES | NULL | Soft delete |

**Indexes:**
- PK: `id`
- UNIQUE: `slug` (case-insensitive: `UNIQUE(lower(slug))`)
- INDEX: `(status) WHERE deleted_at IS NULL`

**Constraints:**
- `slug` regex `^[a-z0-9-]{3,64}$` (CHECK)
- `name` length 1..255 (CHECK)

**Bỏ qua trong Phase 1:** billing, plan, seat count → đợi product spec.

---

### 4.2 `users`

| Cột | Kiểu | NULL | Mặc định | Ghi chú |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | |
| `tenant_id` | UUID | NO | | FK → tenants(id) |
| `email` | VARCHAR(254) | NO | | RFC-5322 max 254 |
| `password_hash` | VARCHAR(255) | NO | | bcrypt cost ≥10 (BR-AUTH-01) |
| `full_name` | VARCHAR(255) | NO | | |
| `phone` | VARCHAR(20) | YES | NULL | regex `^0\d{9,10}$` nếu có |
| `status` | UserStatus | NO | `'active'` | |
| `last_login_at` | TIMESTAMPTZ | YES | NULL | cập nhật sau login thành công |
| `failed_login_count` | SMALLINT | NO | 0 | BR-AUTH-02 |
| `locked_until` | TIMESTAMPTZ | YES | NULL | BR-AUTH-02 (5-fail → lock 30m) |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `deleted_at` | TIMESTAMPTZ | YES | NULL | canonical: user không hard-delete |
| `created_by` | UUID | YES | NULL | FK self → users(id); NULL = system seed |
| `updated_by` | UUID | YES | NULL | FK self → users(id) |

**Indexes:**
- PK: `id`
- UNIQUE: `(tenant_id, lower(email))` — canonical BR-AUTH email uniqueness
- INDEX: `(tenant_id, status) WHERE deleted_at IS NULL`
- INDEX: `(email)` để hỗ trợ "forgot password" lookup (case-insensitive function index)

**Constraints:**
- `email` regex check (CHECK với regex chuẩn)
- `phone` nullable, nếu có thì match `^0\d{9,10}$`
- `failed_login_count >= 0`
- FK `tenant_id` → `tenants(id)` ON DELETE RESTRICT (không cho xóa tenant nếu còn user)

**Lưu ý:**
- KHÔNG có `role` enum trên users (RBAC qua bảng `user_roles`).
- `created_by/updated_by` global requirement trong scope của user.

---

### 4.3 `roles`

| Cột | Kiểu | NULL | Mặc định | Ghi chú |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | |
| `tenant_id` | UUID | YES | NULL | NULL = global system role (D-05) |
| `code` | VARCHAR(64) | NO | | e.g. `admin`, `accountant`, `sales`, `viewer` |
| `name` | VARCHAR(128) | NO | | tên hiển thị tiếng Việt |
| `description` | TEXT | YES | NULL | |
| `is_system` | BOOLEAN | NO | false | true = không cho xóa/sửa (seeded) |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `deleted_at` | TIMESTAMPTZ | YES | NULL | |
| `created_by` | UUID | YES | NULL | |
| `updated_by` | UUID | YES | NULL | |

**Indexes:**
- PK: `id`
- UNIQUE: `(COALESCE(tenant_id, '00000000-0000-0000-0000-000000000000'), lower(code))` — đảm bảo code unique per tenant + unique trong global namespace
  - **Triển khai Prisma:** dùng partial unique index riêng cho `tenant_id IS NULL` và `tenant_id IS NOT NULL` thay vì COALESCE (Prisma không expression-index trực tiếp → raw SQL trong migration).
- INDEX: `(tenant_id) WHERE deleted_at IS NULL`

**Constraints:**
- `code` regex `^[a-z][a-z0-9_]{1,63}$`
- FK `tenant_id` → `tenants(id)` ON DELETE RESTRICT

---

### 4.4 `permissions`

| Cột | Kiểu | NULL | Mặc định | Ghi chú |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | |
| `code` | VARCHAR(128) | NO | | `resource.action` e.g. `invoices.create`, `invoices.approve` |
| `resource` | VARCHAR(64) | NO | | parse-out để filter, e.g. `invoices` |
| `action` | VARCHAR(64) | NO | | e.g. `create`, `read`, `update`, `delete`, `approve`, `export` |
| `description` | TEXT | YES | NULL | |
| `is_system` | BOOLEAN | NO | true | tất cả seeded permission đều system |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |

**Indexes:**
- PK: `id`
- UNIQUE: `code`
- UNIQUE: `(resource, action)`
- INDEX: `(resource)`

**Constraints:**
- `code` regex `^[a-z][a-z0-9_]+\.[a-z][a-z0-9_]+$`
- KHÔNG có tenant_id (permission là global namespace).
- KHÔNG có soft-delete (permission là catalog cố định; muốn "xóa" thì revoke khỏi role).

---

### 4.5 `role_permissions`

| Cột | Kiểu | NULL | Mặc định | Ghi chú |
|---|---|---|---|---|
| `role_id` | UUID | NO | | FK → roles(id) ON DELETE CASCADE |
| `permission_id` | UUID | NO | | FK → permissions(id) ON DELETE RESTRICT |
| `granted_at` | TIMESTAMPTZ | NO | `now()` | |
| `granted_by` | UUID | YES | NULL | FK → users(id) |

**PK composite:** `(role_id, permission_id)`

**Indexes:**
- INDEX: `(permission_id)` để answer "role nào có quyền X"

---

### 4.6 `user_roles`

| Cột | Kiểu | NULL | Mặc định | Ghi chú |
|---|---|---|---|---|
| `user_id` | UUID | NO | | FK → users(id) ON DELETE CASCADE |
| `role_id` | UUID | NO | | FK → roles(id) ON DELETE RESTRICT |
| `tenant_id` | UUID | NO | | denormalize từ user.tenant_id để query nhanh + RLS |
| `assigned_at` | TIMESTAMPTZ | NO | `now()` | |
| `assigned_by` | UUID | YES | NULL | |

**PK composite:** `(user_id, role_id)`

**Indexes:**
- INDEX: `(role_id)`
- INDEX: `(tenant_id, user_id)` — RLS-friendly

**Trigger / validation (application layer):**
- Khi insert: assert `role.tenant_id IS NULL OR role.tenant_id = user.tenant_id` (tránh user của tenant A gán role của tenant B).
- Khi insert/update: assert `user_roles.tenant_id = user.tenant_id`.

---

## 5. Cross-cutting concerns Phase 1

### 5.1 Soft delete & audit fields
- Tất cả bảng business có: `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`.
- `permissions` và `role_permissions` ngoại lệ: không có `updated_by/deleted_at` (catalog cố định / link table).
- Query mặc định: `WHERE deleted_at IS NULL`. Triển khai qua Prisma middleware ở Phase 5 (NestJS) — Phase 1 chỉ định nghĩa cột.

### 5.2 Row-Level Security (RLS) — defence in depth (canonical CR-T-03)
Phase 1 sẽ tạo policy RLS cho `users`, `roles` (where `tenant_id IS NOT NULL`), `user_roles`:
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
```
- `permissions` KHÔNG bật RLS (global).
- `tenants` KHÔNG bật RLS (cần truy cập từ super-admin).
- Migration ghi chú: cần `GRANT` đúng cho app role + để bypass với migration role.

### 5.3 UUID generation
- Dùng `gen_random_uuid()` (Postgres `pgcrypto`) — yêu cầu enable extension trong migration `0000_init_extensions`.

### 5.4 Timestamps
- `TIMESTAMPTZ` mọi nơi (canonical CR-T-07).
- `updated_at` cập nhật qua Prisma `@updatedAt`.

---

## 6. Prisma schema fragment (preview — sẽ generate ở turn sau)

```prisma
// schema.prisma — Phase 1 PREVIEW (KHÔNG commit ở turn này)

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgcrypto]
}

enum TenantStatus {
  active
  suspended
}

enum UserStatus {
  active
  inactive
}

model Tenant {
  id        String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String       @db.VarChar(255)
  slug      String       @unique @db.VarChar(64)
  status    TenantStatus @default(active)
  createdAt DateTime     @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime     @updatedAt      @map("updated_at") @db.Timestamptz
  deletedAt DateTime?    @map("deleted_at") @db.Timestamptz

  users User[]
  roles Role[]

  @@map("tenants")
  @@index([status], map: "ix_tenants_status")
}

model User {
  id                 String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenantId           String     @map("tenant_id") @db.Uuid
  email              String     @db.VarChar(254)
  passwordHash       String     @map("password_hash") @db.VarChar(255)
  fullName           String     @map("full_name") @db.VarChar(255)
  phone              String?    @db.VarChar(20)
  status             UserStatus @default(active)
  lastLoginAt        DateTime?  @map("last_login_at") @db.Timestamptz
  failedLoginCount   Int        @default(0) @map("failed_login_count") @db.SmallInt
  lockedUntil        DateTime?  @map("locked_until") @db.Timestamptz
  createdAt          DateTime   @default(now()) @map("created_at") @db.Timestamptz
  updatedAt          DateTime   @updatedAt      @map("updated_at") @db.Timestamptz
  deletedAt          DateTime?  @map("deleted_at") @db.Timestamptz
  createdBy          String?    @map("created_by") @db.Uuid
  updatedBy          String?    @map("updated_by") @db.Uuid

  tenant     Tenant      @relation(fields: [tenantId], references: [id])
  userRoles  UserRole[]

  // Lưu ý: UNIQUE(tenant_id, lower(email)) cần raw SQL trong migration
  @@map("users")
  @@index([tenantId, status], map: "ix_users_tenant_status")
}

model Role {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenantId    String?   @map("tenant_id") @db.Uuid  // NULL = global
  code        String    @db.VarChar(64)
  name        String    @db.VarChar(128)
  description String?
  isSystem    Boolean   @default(false) @map("is_system")
  createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime  @updatedAt      @map("updated_at") @db.Timestamptz
  deletedAt   DateTime? @map("deleted_at") @db.Timestamptz
  createdBy   String?   @map("created_by") @db.Uuid
  updatedBy   String?   @map("updated_by") @db.Uuid

  tenant          Tenant?          @relation(fields: [tenantId], references: [id])
  rolePermissions RolePermission[]
  userRoles       UserRole[]

  @@map("roles")
  @@index([tenantId], map: "ix_roles_tenant")
}

model Permission {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  code        String   @unique @db.VarChar(128)
  resource    String   @db.VarChar(64)
  action      String   @db.VarChar(64)
  description String?
  isSystem    Boolean  @default(true) @map("is_system")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz

  rolePermissions RolePermission[]

  @@map("permissions")
  @@unique([resource, action], map: "uq_permissions_resource_action")
  @@index([resource], map: "ix_permissions_resource")
}

model RolePermission {
  roleId       String   @map("role_id") @db.Uuid
  permissionId String   @map("permission_id") @db.Uuid
  grantedAt    DateTime @default(now()) @map("granted_at") @db.Timestamptz
  grantedBy    String?  @map("granted_by") @db.Uuid

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id])

  @@id([roleId, permissionId])
  @@map("role_permissions")
  @@index([permissionId], map: "ix_role_permissions_permission")
}

model UserRole {
  userId     String   @map("user_id") @db.Uuid
  roleId     String   @map("role_id") @db.Uuid
  tenantId   String   @map("tenant_id") @db.Uuid
  assignedAt DateTime @default(now()) @map("assigned_at") @db.Timestamptz
  assignedBy String?  @map("assigned_by") @db.Uuid

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id])

  @@id([userId, roleId])
  @@map("user_roles")
  @@index([roleId], map: "ix_user_roles_role")
  @@index([tenantId, userId], map: "ix_user_roles_tenant_user")
}
```

**Raw SQL bổ sung trong migration (Prisma không sinh trực tiếp):**
- `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
- `CREATE UNIQUE INDEX uq_tenants_slug_lower ON tenants (lower(slug)) WHERE deleted_at IS NULL;`
- `CREATE UNIQUE INDEX uq_users_tenant_email_lower ON users (tenant_id, lower(email)) WHERE deleted_at IS NULL;`
- `CREATE UNIQUE INDEX uq_roles_tenant_code_lower ON roles (tenant_id, lower(code)) WHERE deleted_at IS NULL AND tenant_id IS NOT NULL;`
- `CREATE UNIQUE INDEX uq_roles_global_code_lower ON roles (lower(code)) WHERE deleted_at IS NULL AND tenant_id IS NULL;`
- CHECK constraints (slug regex, email regex, phone regex, code regex)
- RLS policies (mục 5.2)

---

## 7. Seed data Phase 1

### 7.1 Permissions (global catalog — ~30 hàng)

Theo canonical permission matrix (CR-* + missing-authorization.md §3):

```
# Invoices
invoices.read
invoices.create.draft
invoices.create.final
invoices.update.header
invoices.update.items
invoices.finalize
invoices.void
invoices.delete

# Payments
payments.read
payments.create

# Quotations
quotations.read
quotations.create
quotations.update
quotations.send
quotations.accept
quotations.reject
quotations.convert

# Customers
customers.read
customers.create
customers.update
customers.delete

# Products
products.read
products.create
products.update
products.delete

# Debts
debts.read

# Reports
reports.read
reports.export

# Users / RBAC
users.read
users.create
users.update
users.deactivate
roles.read
roles.assign

# Settings / Templates
settings.read
settings.update
templates.read
templates.create
templates.update
templates.delete
templates.set_default

# Audit
audit.read
```

### 7.2 Global system roles (seeded với `tenant_id = NULL`, `is_system = true`)

| code | name | Permissions (preview — confirm khi sinh) |
|---|---|---|
| `admin` | Quản trị viên | tất cả permissions |
| `accountant` | Kế toán | invoices.*, payments.*, quotations.*, customers.read, products.read, debts.read, reports.*, audit.read |
| `sales` | Nhân viên kinh doanh | invoices.read|create.draft|create.final|update.*, customers.*, quotations.* (own only — ownership enforce ở service layer), products.read |
| `viewer` | Chỉ xem | *.read only |

Cite: missing-authorization.md §3 (đã đọc qua Explore agent).

### 7.3 Demo tenant + demo admin user (CHỈ cho dev, KHÔNG seed ở production)

- 1 tenant: `name="Demo Co", slug="demo"`.
- 1 user: `email="admin@demo.local", password="ChangeMe!2026"` (bcrypt cost 12).
- Gán role `admin` (global).
- Seed này phải gate bằng env `SEED_DEMO=true`.

---

## 8. Migration plan

Sinh **3 migration files**:

| File | Nội dung |
|---|---|
| `0000_init_extensions/migration.sql` | `CREATE EXTENSION pgcrypto;` |
| `0001_phase1_identity/migration.sql` | Tất cả CREATE TABLE + enum + FK + index + CHECK + RLS policy |
| `0002_phase1_seed_permissions_roles/migration.sql` | INSERT permissions + INSERT roles (global) + INSERT role_permissions (KHÔNG seed demo tenant — demo seed dùng `prisma db seed` script, không phải migration) |

**Naming:** Prisma migrate sẽ thêm timestamp prefix tự động khi chạy `prisma migrate dev`.

**Rollback:** Prisma không support down-migration tự động. Phase 1 acceptable vì greenfield; sẽ document rollback procedure ở `docs/database/rollback-runbook.md` (tạo ở Phase 4).

---

## 9. Success criteria (Definition of Done)

1. ✅ `npx prisma generate` chạy không lỗi với fragment trên.
2. ✅ `npx prisma migrate dev` apply sạch trên Postgres trống.
3. ✅ Test query: `SELECT * FROM permissions` trả về ≥30 hàng.
4. ✅ Test query: `SELECT code FROM roles WHERE tenant_id IS NULL` trả về 4 hàng (`admin`, `accountant`, `sales`, `viewer`).
5. ✅ Test query: `SELECT COUNT(*) FROM role_permissions WHERE role_id = (SELECT id FROM roles WHERE code='admin' AND tenant_id IS NULL)` = số permissions tổng.
6. ✅ Insert thử 1 user vào demo tenant — pass.
7. ✅ Insert user với email duplicate trong cùng tenant — fail với unique violation.
8. ✅ Insert user với email duplicate khác tenant — pass.
9. ✅ Gán role global cho user — pass.
10. ✅ Gán role tenant A cho user tenant B — service layer reject (manual test, vì DB cross-table CHECK không enforce).

---

## 10. Out-of-scope reminder (sẽ làm phase sau)

| Việc | Phase |
|---|---|
| `tenant_settings` (invoice_prefix, next_number, default_tax_rate, …) | Phase 3 (trước invoice) |
| `customers`, `products` | Phase 2 |
| `invoices`, `invoice_items`, `quotations`, `quotation_items`, `payments` | Phase 3 |
| `audit_logs`, `notifications`, `user_notification_prefs`, `templates`, `v_customer_debt` | Phase 4 |
| NestJS scaffold, auth module, RBAC guard, exception filter | Backend phase (sau Phase 4 schema) |
| RLS app role + session variable `app.current_tenant` wiring | Backend phase (cần JWT context) |
| Email verification, password reset, refresh token storage | Backend auth phase |

---

## 11. Open questions cần user xác nhận TRƯỚC khi sinh code

| # | Câu hỏi | Đề xuất mặc định |
|---|---|---|
| Q-P1-01 | Tên 4 global role: `admin/accountant/sales/viewer` (lowercase) hay `ADMIN/ACCOUNTANT/SALES/VIEWER` (uppercase)? | lowercase (UI sẽ map sang display tiếng Việt) |
| Q-P1-02 | Permission cho SALES có cần ownership predicate ở DB không, hay enforce ở service layer? | Service layer (DB chỉ filter `tenant_id`) — đơn giản, đúng canonical missing-authorization.md §7 |
| Q-P1-03 | Có cần bảng `tenants.plan` / `tenants.max_users` ngay Phase 1 không? | KHÔNG — defer, không có trong canonical |
| Q-P1-04 | Có pre-create demo tenant trong migration luôn không, hay tách ra `prisma db seed` script? | Tách ra seed script, gate bằng env `SEED_DEMO=true` |
| Q-P1-05 | Naming Prisma migration folder: `0001_phase1_identity` (mục 8) hay để Prisma tự đặt `<timestamp>_phase1_identity`? | Để Prisma tự đặt (`prisma migrate dev --name phase1_identity`) |
| Q-P1-06 | `permissions` có cần i18n cho `description` không? | KHÔNG — Phase 1 chỉ Việt; i18n ở backend layer sau |

---

## 12. Sync sang docs/plans/

File này đã được tạo trực tiếp tại `docs/plans/db-schema-phase1-identity.md` (committed, team-visible) theo lựa chọn của user trong session 2026-05-18.

---

**END OF PLAN — chờ user review & duyệt các open questions trước khi generate code.**
