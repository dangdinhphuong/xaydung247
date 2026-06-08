# Pre-Launch Checklist — MVP v1

Hành trình từ docs đến production. Đánh dấu khi hoàn thành.

---

## Phase 0 — Foundation (1-2 ngày)

- [ ] Backup `/docs-archive/` (đã xong, từ session pivot)
- [ ] Setup monorepo: `apps/frontend`, `apps/backend`, `packages/shared-types`, `pnpm-workspace.yaml`
- [ ] `docker-compose.yml` + `nginx.conf` skeleton
- [ ] CI workflow: lint + typecheck + test cho cả FE và BE

## Phase 1 — Backend skeleton (2-3 ngày)

- [ ] `nest new apps/backend`
- [ ] Install deps theo `implementation/nestjs-skeleton.md` §2
- [ ] Generate 9 modules + common guards/decorators/filters
- [ ] `main.ts` + `app.module.ts` đầy đủ session + csurf + ValidationPipe
- [ ] MongoDB connection working (`docker-compose up mongo`)
- [ ] Health endpoint `/api/health` return 200
- [ ] Seed script `pnpm seed` tạo admin + settings

## Phase 2 — Backend API endpoints (5-7 ngày)

Theo thứ tự ưu tiên:

- [ ] Auth: login, logout, csrf, me, change-password (`api/auth.md`)
- [ ] Users: CRUD + reset-password (`api/users.md`)
- [ ] Customers: CRUD + aging helper (`api/customers.md`)
- [ ] Products: CRUD + categories (`api/products.md`)
- [ ] Settings: GET/PATCH (`api/settings.md`)
- [ ] Invoices: CRUD + finalize + void (`api/invoices.md`)
- [ ] Payments: POST + GET subresource
- [ ] Quotations: CRUD + send/accept/reject/clone/convert (`api/quotations.md`)
- [ ] Dashboard: GET helper (`api/dashboard.md`)

Cho mỗi endpoint:
- [ ] DTO + class-validator decorators khớp `qa/validation-rules.md`
- [ ] Service implement business logic theo `business-rules/*`
- [ ] Controller wiring guards + roles
- [ ] Unit tests cho service
- [ ] Supertest integration test happy path

## Phase 3 — Frontend refactor (5-7 ngày)

Theo `implementation/frontend-migration-guide.md`:

- [ ] Install TanStack Query + react-hook-form + Zod + xlsx + handlebars
- [ ] HTTP wrapper + CSRF helper
- [ ] TanStack Query setup
- [ ] AuthContext + AuthGuard + LoginPage
- [ ] API client per module (8 files)
- [ ] Hooks per module
- [ ] Refactor pages — xoá DataStore + mockData:
  - [ ] Dashboard
  - [ ] InvoiceList, CreateInvoice, InvoiceDetail
  - [ ] PaymentModal
  - [ ] CustomerManagement, CustomerForm
  - [ ] ProductManagement, ProductForm
  - [ ] QuotationManagement, QuotationForm, QuotationDetail
  - [ ] DebtManagement
  - [ ] Settings
- [ ] Update routes.tsx (bỏ /menu, /reports, /settings/templates)
- [ ] XOÁ files theo `frontend-migration-guide.md` §11
- [ ] Excel export hooked vào nút
- [ ] Print stylesheet + PrintableInvoice component

## Phase 4 — Permission gating (1-2 ngày)

- [ ] Permission matrix sync giữa FE và BE
- [ ] UI conditional rendering cho mọi action button
- [ ] Test RBAC scenarios trong `qa/test-scenarios.md` §2

## Phase 5 — QA (3-5 ngày)

- [ ] Manual smoke test toàn bộ user journey
- [ ] Jest tests cho service layer (target 70% coverage cho service files)
- [ ] Supertest E2E flow (Phase 11 `qa/test-scenarios.md`)
- [ ] Mobile responsive check (Chrome DevTools mobile)
- [ ] Print preview check
- [ ] Excel export check
- [ ] Cross-browser smoke: Chrome, Edge, Safari iOS

## Phase 6 — Deployment (1-2 ngày)

- [ ] Dockerfile cho backend
- [ ] Dockerfile cho frontend (multi-stage: Vite build → nginx static)
- [ ] `docker-compose.yml` đầy đủ
- [ ] `nginx.conf` đầy đủ (TLS, proxy /api, serve static)
- [ ] Backup cron (`mongodump`)
- [ ] Production env file
- [ ] Test deploy trên staging server
- [ ] Smoke test trên staging
- [ ] Deploy production
- [ ] Hand-off cho ops team

---

## Acceptance criteria (cuối Phase 6)

| Tiêu chí | Pass nếu |
|---|---|
| Login ADMIN + tạo invoice + add payment + in | < 5 phút end-to-end |
| Dashboard load với 100 invoices | < 2 giây |
| Refresh page → data còn nguyên | ✓ |
| 2 user đồng thời, 1 tạo invoice 1 trả payment, không conflict | ✓ |
| Print invoice ra file PDF (qua dialog) | Hiển thị đúng template |
| Excel export download | File mở được trong Excel, đầy đủ cột |
| Logout, login lại | OK |
| Refresh sau logout → redirect /login | ✓ |
| RBAC: SALES không thấy nút "Thêm thanh toán" | ✓ |
| Validation error hiển thị tiếng Việt | ✓ |

---

## Out-of-scope (v2 backlog)

- Reports module với charts
- Notifications + email + reminders
- Audit log UI
- Server-side PDF (Puppeteer)
- File attachments
- Multi-tenant SaaS
- MongoDB replica set + transactions
- Idempotency-Key
- Bulk import Excel
- Mobile app (PWA)
- MFA / OIDC
- Inventory tracking
- Coupon engine
- Recurring invoices
- Approval workflow

Mở ADR riêng khi có nhu cầu thực.

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| PM | | |
| Tech lead | | |
| QA lead | | |
| Owner / Chủ shop | | |
