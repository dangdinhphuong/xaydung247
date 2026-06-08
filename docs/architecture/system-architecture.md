# System Architecture — MVP v1

## 1. Triết lý

- 3-tier đơn giản: React SPA → NestJS REST API → MongoDB.
- Không microservice, không message queue, không cache layer.
- Single-tenant on-prem: 1 shop = 1 deployment = 1 instance.

## 2. Architecture diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ React SPA (Vite build → static)                      │   │
│  │  - TanStack Query (cache + retry + invalidation)     │   │
│  │  - react-hook-form + Zod (forms)                     │   │
│  │  - SheetJS (Excel export browser-side)               │   │
│  │  - window.print() (PDF / in)                         │   │
│  └────────────────────┬─────────────────────────────────┘   │
└────────────────────────┼─────────────────────────────────────┘
                         │ HTTPS · session cookie + CSRF token
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  nginx (single host, on-prem)                                │
│  - TLS termination                                           │
│  - Serve FE static từ /var/www/invoicepro/                   │
│  - Proxy /api/* → NestJS                                     │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  NestJS API (Node 20)                                        │
│  Modules:                                                    │
│  - AuthModule (session-cookie + CSRF)                        │
│  - UsersModule                                               │
│  - CustomersModule                                           │
│  - ProductsModule                                            │
│  - InvoicesModule + PaymentsModule (cùng module)             │
│  - QuotationsModule                                          │
│  - SettingsModule                                            │
│  - DashboardModule (helper KPI nếu cần backend tính)         │
│                                                              │
│  Cross-cutting:                                              │
│  - Global ValidationPipe (class-validator)                   │
│  - RolesGuard (RBAC decorator @Roles)                        │
│  - SessionMiddleware (express-session + connect-mongo)       │
│  - csurf middleware                                          │
└────────────────────────┬─────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  MongoDB 6+ standalone                                       │
│  Database: invoicepro                                        │
│  Collections:                                                │
│  - users                                                     │
│  - customers                                                 │
│  - products                                                  │
│  - invoices    (embed items[])                               │
│  - payments    (separate collection, ref invoiceId)          │
│  - quotations  (embed items[])                               │
│  - settings    (1 document)                                  │
│  - counters    (1 document per year per type)                │
│  - sessions    (managed by connect-mongo)                    │
└─────────────────────────────────────────────────────────────┘
```

## 3. Deployment (docker-compose)

```yaml
version: '3.8'
services:
  mongo:
    image: mongo:6
    volumes: [mongo-data:/data/db]
    restart: unless-stopped

  backend:
    build: ./apps/backend
    environment:
      MONGODB_URI: mongodb://mongo:27017/invoicepro
      SESSION_SECRET: ${SESSION_SECRET}
      NODE_ENV: production
      TZ: Asia/Ho_Chi_Minh
    depends_on: [mongo]
    restart: unless-stopped

  frontend:
    build: ./apps/frontend
    # Output là static, nginx serve
    volumes: [frontend-dist:/dist]

  nginx:
    image: nginx:alpine
    ports: ['80:80', '443:443']
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - frontend-dist:/var/www/invoicepro:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on: [backend, frontend]
    restart: unless-stopped

volumes:
  mongo-data:
  frontend-dist:
```

## 4. Request flow ví dụ

### 4.1 Tạo invoice

```
1. User submit form ở FE.
2. FE: react-hook-form validate Zod schema → pass.
3. FE: fetch POST /api/invoices với cookie + X-CSRF-Token header.
4. nginx forward → NestJS.
5. SessionMiddleware decode cookie → req.user.
6. CSRF middleware verify token → pass.
7. RolesGuard check req.user.role ∈ ['ADMIN', 'ACCOUNTANT', 'SALES'].
8. ValidationPipe validate CreateInvoiceDto (class-validator).
9. InvoicesController.create → InvoicesService.create.
10. Service: recompute subtotal/total/tax (F-1..F-4), insert vào collection.
11. Nếu status='unpaid' → allocate invoiceNumber (F-12, atomic counter).
12. Return Invoice document.
13. FE: TanStack Query mutation success → invalidate ['invoices'], ['dashboard'].
14. Navigate /invoices/:id.
```

### 4.2 Add payment

```
1. FE PaymentModal submit → POST /api/invoices/:id/payments.
2. NestJS: validate amount > 0 AND ≤ remainingBalance AND status not in [draft, void, paid].
3. Service: insert payment vào collection payments.
4. Service: query all payments của invoice → recompute paidAmount.
5. Service: update invoice { paidAmount, remainingBalance, status }.
6. Return { payment, invoice }.
7. FE invalidate ['invoice', id], ['invoices'], ['dashboard'].
```

Không có transaction. Race condition (2 user trả cùng lúc) có thể overstate paidAmount tạm thời nhưng sẽ self-correct ở read tiếp theo (vì recompute từ payments collection).

## 5. Cấu trúc thư mục

```
invoice-pro/
├── apps/
│   ├── frontend/                    # React SPA (refactor từ code hiện tại)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── api/             # API client wrappers
│   │   │   │   ├── hooks/           # TanStack Query hooks
│   │   │   │   ├── pages/           # Existing pages, refactored
│   │   │   │   ├── components/      # Shared UI
│   │   │   │   ├── auth/            # Auth context
│   │   │   │   └── lib/             # csrf, fetch wrapper
│   │   │   └── main.tsx
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── backend/                     # NestJS app (mới)
│       ├── src/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── customers/
│       │   ├── products/
│       │   ├── invoices/
│       │   ├── quotations/
│       │   ├── settings/
│       │   ├── dashboard/
│       │   ├── common/              # guards, decorators, filters
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── nest-cli.json
│       └── package.json
├── packages/
│   └── shared-types/                # TS interfaces share giữa FE/BE
│       └── src/index.ts
├── docker-compose.yml
├── nginx.conf
├── package.json                     # pnpm workspace
└── pnpm-workspace.yaml
```

## 6. Cross-cutting concerns

| Concern | Implementation |
|---|---|
| Auth | Session cookie + connect-mongo + csurf |
| RBAC | `@Roles('ADMIN', 'ACCOUNTANT')` decorator + RolesGuard |
| Validation | Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` |
| Errors | Standard HttpException; FE handles via TanStack Query error handler + sonner toast |
| Logging | NestJS Logger console (production: ship stdout to file via Docker logging driver) |
| CORS | Cùng host (nginx serve cả FE + proxy API), không cần CORS |
| Health check | `GET /api/health` returns 200 với version + mongo ping |

## 7. Out of scope

- ❌ Multi-region
- ❌ Auto-scaling / Kubernetes
- ❌ Replica set / sharding
- ❌ CDN
- ❌ Service mesh
- ❌ APM / distributed tracing
- ❌ Feature flags
- ❌ A/B testing

Khi cần, mở ADR.
