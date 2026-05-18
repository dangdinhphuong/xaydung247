---
title: Phase 1 — Hợp nhất 2 prisma project vào backend/prisma/
status: Đang triển khai
created_date: 2026-05-18
started_date: 2026-05-18
completed_date:
cancel_reason:
owner: ai (claude)
related_spec: docs/plans/db-schema-phase1-identity.md
---

# Merge Plan — root `prisma/` → `backend/prisma/`

## Quyết định nền (user-approved 2026-05-18)

| # | Quyết định |
|---|---|
| M-01 | Canonical location = `backend/prisma/`. Root `prisma/` sẽ bị xóa sau khi port xong. |
| M-02 | Phase 1 scope mở rộng: thêm `audit_logs` + `password_reset_tokens` (do `backend/` đã có). |
| M-03 | Permission code format = **dot** (`invoices.create`). Override backend cũ (colon 3-tier). |
| M-04 | Giữ `FORCE` + `WITH CHECK` + helper `app_current_tenant()` từ backend (RLS chặt hơn). |
| M-05 | Giữ NestJS scaffold `backend/{src,test,docker,nest-cli.json,package.json,tsconfig.json,.env.example,.gitignore}` — không sửa trong merge này. |
| M-06 | UUID strategy: dùng `@default(uuid())` của Prisma (client-side, như backend hiện tại) — bỏ phụ thuộc pgcrypto trong Phase 1. Có thể đổi sau nếu cần. |

---

## Hybrid schema target (backend/prisma/schema.prisma sau merge)

### Enums (mới thêm — port từ root)
```prisma
enum TenantStatus { active suspended @@map("tenant_status") }
enum UserStatus   { active inactive  @@map("user_status") }
```

### Tenant — patch
- ➕ thêm `slug VARCHAR(64)` + partial unique `lower(slug)` WHERE deleted_at IS NULL
- ⤴️ đổi `status` từ `String` → `TenantStatus` enum
- ⤴️ `name` VARCHAR(200) → 255 (canonical)
- giữ relations cũ + thêm relation `passwordResetTokens` không cần (đã có)

### User — patch
- ➕ `failedLoginCount Int @default(0) @db.SmallInt` (BR-AUTH-02)
- ➕ `lockedUntil DateTime?` (BR-AUTH-02)
- ⤴️ `email VARCHAR(120)` → `VARCHAR(254)` (RFC-5322)
- ⤴️ `status` → enum `UserStatus`
- giữ `avatarUrl` (backend có, root không có — không hại)
- giữ pattern không declare self-relation cho `createdById/updatedById`

### Role — patch
- ➕ `deletedAt DateTime?` (soft delete)
- ⤴️ `code VARCHAR(40)` → `VARCHAR(64)` (canonical)
- ⤴️ `name VARCHAR(120)` → `VARCHAR(128)` (canonical)
- giữ logic hybrid system/tenant role

### Permission — patch
- ⤴️ `code VARCHAR(80)` → `VARCHAR(128)`
- ⤴️ CHECK format dot thay vì colon (`^[a-z][a-z0-9_]+\.[a-z][a-z0-9_]+$`)
- ➕ `isSystem Boolean @default(true)`
- ➕ `@@unique([resource, action])`

### RolePermission — patch nhẹ
- đổi `createdAt` → `grantedAt` (semantic rõ hơn)
- ➕ `grantedBy String? @db.Uuid`

### UserRole — patch
- ➕ `tenantId String @db.Uuid` (denormalized cho RLS perf)
- ➕ trigger `fn_user_roles_tenant_consistency` (cross-table validation)

### AuditLog — GIỮ NGUYÊN từ backend
✅ Không sửa. Cấu trúc match canonical CR-T-05.

### PasswordResetToken — GIỮ NGUYÊN từ backend
✅ Không sửa.

---

## Migration restructure

### Trạng thái hiện tại `backend/prisma/migrations/`
```
0002_rls/           (broken — phụ thuộc 0001_init không tồn tại)
0003_audit_grants/
0004_indexes/
```

### Trạng thái target (đã thực thi Turn 1 + Turn 2)
```
0001_phase1_identity/   (NEW — CREATE TABLE 8 model + enum + CHECK + trigger)
0002_rls/               (KEEP, không đổi)
0003_audit_grants/      (KEEP, không đổi)
0004_indexes/           (KEEP, không đổi — chứa drift đã fix ở 0005)
0005_fix_drifts/        (NEW — forward-patch DRIFT-2 + DRIFT-4)
0006_phase1_seed_rbac/  (NEW — seed 60+ permissions + 4 roles + grants, idempotent)
```

**Note:** đã bỏ kế hoạch `0000_init_extensions` vì giữ Q-M-01 (Prisma `uuid()` client-side, không cần pgcrypto).
**Note:** đã bỏ kế hoạch ghi `uq_roles_tenant_code_lower` riêng — index này đã được tạo trong 0001 luôn (xem mục Verify 3 / DRIFT-2).

### Lý do giữ số 0002–0004 thay vì renumber
- Greenfield (chưa có DB production). Có thể đặt lại tên tự do.
- Nhưng giữ 0002–0004 → giảm diff, dễ review từng file.
- 0001 sẽ bao trùm hết những gì 0002/0003/0004 sẽ giả định.

### Quan trọng — file `0000_init_extensions`
- Nếu giữ `@default(uuid())` (Prisma client UUID) → KHÔNG cần pgcrypto → có thể skip 0000.
- Nếu sau này muốn `gen_random_uuid()` → thêm 0000 sau.
- **Quyết định:** SKIP 0000 trong merge này. Đặt placeholder file documentation chứ không tạo migration thực.

---

## Step-by-step thực thi (cần user approve trước khi tôi làm)

### Bước 1 — Cập nhật `backend/prisma/schema.prisma`
- 1 lần edit (Write toàn file mới).
- Diff size: ~+50 dòng (enum + slug + lockout + length update).

### Bước 2 — Tạo migration `0001_phase1_identity/migration.sql` trong `backend/prisma/migrations/`
- File mới ~250 dòng.
- Bao gồm: enum DDL, CREATE TABLE 8 bảng (tenants/users/roles/permissions/role_permissions/user_roles/audit_logs/password_reset_tokens), CHECK constraints, indexes thường, trigger cross-table.
- **KHÔNG đụng** vào 3 migrations cũ.

### Bước 3 — Review/patch `0002_rls/migration.sql`
- Hiện đã handle 5 bảng: users, roles, user_roles, audit_logs, password_reset_tokens.
- KHÔNG đụng `tenants` (intentional, super-admin needs cross-tenant access — match root).
- KHÔNG đụng `permissions` (global catalog).
- **Verdict:** giữ nguyên 100%, không cần patch.

### Bước 4 — Review `0003_audit_grants/migration.sql`
- Hoàn toàn standalone, không phụ thuộc schema.
- **Verdict:** giữ nguyên 100%.

### Bước 5 — Patch `0004_indexes/migration.sql`
- Hiện có:
  - `uq_users_tenant_email_lower` — nếu 0001 đã CREATE thì `IF NOT EXISTS` sẽ skip → SAFE
  - `uq_roles_system_code` — same
- Vấn đề: 0001 nên CREATE luôn các partial unique → 0004 sẽ trở thành no-op `IF NOT EXISTS`.
- **Verdict:** giữ nguyên 100% (idempotent guard đã có).
- Tùy chọn: thêm `uq_roles_tenant_code_lower` (root có, backend chưa có) → bổ sung vào 0004.

### Bước 6 — Tạo migration `0005_phase1_seed_rbac/migration.sql`
- Port từ root `prisma/migrations/0002_phase1_seed_rbac/migration.sql`
- ~150 dòng (60+ permissions + 4 roles + grants)
- Format permission code = dot (đã đúng).

### Bước 7 — Tạo `backend/prisma/seed.ts`
- Port từ root `prisma/seed.ts`.
- Cập nhật import đường dẫn nếu cần.
- Confirm `package.json` đã có `"seed": "ts-node prisma/seed.ts"` (✅ đã có).

### Bước 8 — Xóa thư mục `prisma/` ở root
- Sau khi 7 bước trên đã xong + bạn verify lại.
- `rm -rf prisma/` — destructive, **cần xác nhận lại** trước khi thực hiện.

### Bước 9 — Cập nhật plan files
- Mark `docs/plans/db-schema-phase1-identity.md` status: `Hoàn thành` (sau khi merge xong).
- File này (`db-schema-phase1-merge.md`) status: `Hoàn thành`.

---

## Risk register

| ID | Risk | Mitigation |
|---|---|---|
| R-1 | `prisma migrate dev` trên Prisma version khác sinh `0001_init` khác | KHÔNG dùng `migrate dev` để sinh 0001. Tôi viết tay 0001 theo schema target, commit thẳng. |
| R-2 | `0002_rls` reference column chưa CREATE trong 0001 | Trước khi commit 0001, verify mọi table/column 0002 reference đều có trong 0001. Checklist trong Step 7 review. |
| R-3 | Migration 0004 trùng index với 0001 | `IF NOT EXISTS` đã có → idempotent. Confirm. |
| R-4 | Seed data trong 0005 không idempotent nếu re-run | `INSERT ... ON CONFLICT DO NOTHING` cho roles/permissions (sẽ thêm) |
| R-5 | Trigger `fn_user_roles_tenant_consistency` xung đột với existing logic | Backend chưa có trigger nào → safe. |
| R-6 | App role chưa tồn tại lúc 0003 chạy | 0003 đã có exception handler → safe. |

---

## Acceptance criteria

Sau khi 9 bước done:
1. ✅ `cd backend && pnpm install` thành công
2. ✅ `cd backend && pnpm prisma generate` không lỗi
3. ✅ `cd backend && pnpm prisma migrate deploy` apply 4 migrations (0001 → 0005) lên Postgres trống thành công
4. ✅ `SELECT count(*) FROM permissions` ≥ 60
5. ✅ `SELECT count(*) FROM roles WHERE tenant_id IS NULL` = 4
6. ✅ `SELECT count(*) FROM role_permissions WHERE role_id = <admin>` = số permissions
7. ✅ `SEED_DEMO=true DEMO_ADMIN_PASSWORD=ChangeMe!2026 pnpm seed` tạo demo tenant + admin user
8. ✅ Thư mục root `prisma/` không còn
9. ✅ Plan file Phase 1 status = `Hoàn thành`

---

## Drifts đã phát hiện & fix

Verification chạy đầu Turn 2 phát hiện 4 drift (DRIFT-2/3/4/5). Quyết định user:

| Drift | Quyết định | Thực thi |
|---|---|---|
| DRIFT-2 (uq_roles_system_code case-sensitive + thiếu deleted_at) | Forward-patch | `0005_fix_drifts/migration.sql` |
| DRIFT-3 (comment 0002_rls misleading) | Defer (chỉ comment) | — |
| DRIFT-4 (trigger + RLS race) | ALTER FUNCTION SECURITY DEFINER | `0005_fix_drifts/migration.sql` |
| DRIFT-5 (duplicate uq_users_tenant_email declaration) | Xóa CREATE INDEX khỏi 0001 | Edit `0001_phase1_identity/migration.sql` line 84–86 + schema comment |

## Open question cuối — confirm trước khi tôi thực thi

| # | Câu hỏi | Đề xuất mặc định |
|---|---|---|
| Q-M-01 | Đồng ý giữ `@default(uuid())` (Prisma client UUID) thay vì `gen_random_uuid()` (DB)? | Có (theo backend hiện tại) |
| Q-M-02 | Có cần thêm `uq_roles_tenant_code_lower` (case-insensitive) vào 0004 cho tenant-scoped roles không? | Có (canonical yêu cầu case-insensitive) |
| Q-M-03 | Sau merge xong, có muốn tôi tự xóa `prisma/` root luôn hay chờ bạn xóa tay? | Tôi xóa, sau khi bạn verify backend migrate chạy OK |
| Q-M-04 | Muốn tôi thực thi 9 bước trong **1 turn** (output dài) hay **chia 2 turn** (turn này: schema + 0001; turn sau: 0004 patch + 0005 seed + seed.ts + xóa root)? | Chia 2 turn — review dễ hơn |
