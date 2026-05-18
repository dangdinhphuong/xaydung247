# Tech Stack — Invoice Pro MVP v1

## Frontend

| Item | Choice | Lý do |
|---|---|---|
| Framework | React 18 + Vite 6 | Đã có sẵn từ prototype, build nhanh |
| Routing | react-router 7 | Đã có sẵn |
| Styling | TailwindCSS 4 | Đã có sẵn |
| Components | Radix UI + ShadCN pattern | Đã có sẵn |
| Forms | react-hook-form + Zod | Validate đồng bộ FE/BE qua Zod schema |
| Data fetching | TanStack Query v5 | Cache, retry, invalidation tự động |
| HTTP client | fetch native + wrapper | Không cần axios cho MVP |
| Charts | recharts | Cho Dashboard (1–2 chart đơn giản) |
| Toast | sonner | Đã có |
| Excel export | SheetJS (xlsx) | Generate browser-side, không cần backend |
| PDF | `window.print()` + print stylesheet | Không cần Puppeteer |
| Icons | lucide-react | Đã có |

## Backend

| Item | Choice | Lý do |
|---|---|---|
| Framework | NestJS 10 | Module structure rõ ràng, decorator-based |
| ORM | Mongoose 8 | Native MongoDB, schema validation |
| Validation | class-validator + class-transformer | DTO + decorator |
| Auth | @nestjs/passport + passport-local | Session-based |
| Session store | connect-mongo | Tận dụng MongoDB sẵn có |
| CSRF | csurf middleware | Pair với session cookie |
| Password hash | bcrypt | Standard |
| Config | @nestjs/config + dotenv | `.env` per environment |
| Logger | Nest built-in Logger | Console log đủ cho MVP |
| Testing | Jest + supertest | Mặc định Nest CLI |

## Database

| Item | Choice |
|---|---|
| Engine | MongoDB 6+ standalone |
| Transactions | **Không dùng** (cần replica set) |
| Connection | mongodb://localhost:27017/invoicepro |
| Indexes | Định nghĩa trong Mongoose schema |
| Backups | `mongodump` cron (out of scope MVP, để team ops setup) |

## Deployment

| Item | Choice |
|---|---|
| Container | Docker (FE + BE + Mongo) |
| Orchestration | docker-compose (single host) |
| Reverse proxy | nginx (TLS termination + serve FE static) |
| Domain | `<shop>.local` hoặc IP nội bộ |

## Dev tools

| Tool | Purpose |
|---|---|
| pnpm | Package manager (workspace) |
| ESLint + Prettier | Lint + format |
| Husky + lint-staged | Pre-commit hook |
| TypeScript 5 | Strict mode |

## Không dùng (cố ý)

- ❌ PostgreSQL / MySQL — đã chọn MongoDB
- ❌ Redis — session lưu trong Mongo
- ❌ BullMQ / queue — không có background job
- ❌ S3 / MinIO — không có file upload
- ❌ Puppeteer / Gotenberg — PDF dùng `window.print()`
- ❌ exceljs server-side — Excel dùng SheetJS browser-side
- ❌ Sentry / OpenTelemetry — log console đủ
- ❌ Kafka / RabbitMQ — không event-driven
- ❌ Materialized views, RLS — MongoDB không có
- ❌ Prisma — dùng Mongoose vì native cho MongoDB
- ❌ tRPC / GraphQL — REST thuần đủ

## Repository structure (target)

```
invoice-pro/
├── apps/
│   ├── frontend/        (React SPA — code hiện tại refactor)
│   └── backend/         (NestJS app mới)
├── packages/
│   └── shared-types/    (TypeScript interfaces share giữa FE và BE)
├── docker-compose.yml
├── package.json         (pnpm workspace)
└── pnpm-workspace.yaml
```
