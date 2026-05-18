# Invoice Pro — Documentation

> **Phiên bản:** MVP v1 (simple-first, single-tenant on-prem)
> **Ngày:** 2026-05-18
> **Stack:** React + Vite + TanStack Query · NestJS · MongoDB 6+

---

## Triết lý thiết kế

- **Simple-first.** Mỗi file giải quyết đúng nhu cầu hiện tại, không dự phòng tương lai.
- **CRUD thuần.** Backend = REST CRUD + validation tối thiểu. Không event-driven, CQRS, message queue.
- **Logic ở FE.** Tính toán dashboard, aging buckets, tổng KPI → tính FE-side từ list invoice.
- **MongoDB standalone.** Không transaction, không replica set. Race condition hiếm được chấp nhận cho MVP.
- **Single-tenant on-prem.** Mỗi shop deploy 1 instance. Không có `tenantId` trong schema.
- **Không over-engineering.** Bỏ: RLS, materialized views, audit log DB-level, notifications, email, cron, queue, idempotency keys, optimistic concurrency, server-side PDF/Excel.

---

## Phạm vi MVP v1

### Modules giữ
- Dashboard (4 KPI + recent invoices, tính FE)
- Invoice CRUD + Payment add
- Customer CRUD
- Product CRUD
- Quotation CRUD + Convert to invoice
- Template HTML đơn giản (1 field trong settings)
- Excel export / PDF print — **FE-only** (SheetJS + `window.print()`)

### Modules bỏ khỏi v1
- Reports module (chỉ giữ Dashboard)
- Notifications, email, payment reminders
- Audit log
- Cron jobs (overdue tính tại read-time)
- Server-side PDF generation
- Multi-tenant SaaS
- Template visual builder (chỉ giữ HTML editor đơn giản)

---

## Cấu trúc tài liệu

| Folder | Nội dung |
|---|---|
| `overview/` | Tổng quan business + tech stack |
| `business-rules/` | Quy tắc nghiệp vụ chốt (CR-*), công thức tài chính (F-*), status lifecycle |
| `architecture/` | System / FE / BE architecture, auth + RBAC |
| `database/` | MongoDB schema + seed data |
| `api/` | REST API contract per module |
| `modules/` | Per-module SRS (UI behaviors, forms) |
| `workflows/` | Lifecycle: invoice, payment, quotation conversion |
| `qa/` | Test scenarios + validation rules |
| `implementation/` | Setup guide, NestJS skeleton, FE migration guide, checklist |

---

## Reading paths

### Dev backend mới (NestJS)
1. `overview/tech-stack.md`
2. `architecture/backend-architecture.md`
3. `database/mongodb-schema.md`
4. `business-rules/canonical-rules.md` + `business-rules/financial-formulas.md`
5. `api/*` (theo module cần build)
6. `implementation/setup-guide.md` + `implementation/nestjs-skeleton.md`

### Dev frontend (refactor SPA hiện có)
1. `architecture/frontend-architecture.md`
2. `implementation/frontend-migration-guide.md`
3. `api/*` (xem endpoint shape)
4. `modules/*` (xem UI behavior từng trang)

### BA / PM
1. `overview/executive-summary.md`
2. `business-rules/canonical-rules.md`
3. `modules/*`
4. `workflows/*`

### QA
1. `business-rules/canonical-rules.md`
2. `qa/test-scenarios.md` + `qa/validation-rules.md`
3. `modules/*`

---

## Lịch sử

Bộ tài liệu cũ (60+ file enterprise-grade theo định hướng PostgreSQL + event-driven + audit + reporting engine) đã được lưu ở `/docs-archive/` để tham khảo, không còn là source of truth.

Quyết định pivot sang MVP-simple được ghi nhận trong session ngày 2026-05-18, lý do: ưu tiên ship nhanh cho 1 shop on-prem, mở rộng sau khi có production traffic thực tế.
