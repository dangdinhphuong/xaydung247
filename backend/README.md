# Invoice Pro Backend (NestJS + MongoDB)

MVP backend — REST CRUD thuần. Implement theo `../docs/`.

## Yêu cầu

- Node 20 LTS
- pnpm 8+ (hoặc npm)
- MongoDB 6+ chạy local (`mongodb://localhost:27017`)

## Quick start

```bash
cd backend
cp .env.example .env
# Edit .env — đặt SESSION_SECRET (openssl rand -hex 32) và SEED_ADMIN_PASSWORD

pnpm install
pnpm seed          # tạo admin + settings + counters
pnpm start:dev     # NestJS dev server tại http://localhost:3000/api
```

## Test bằng curl

### 1. Health check
```bash
curl http://localhost:3000/api/health
# { "ok": true, "mongo": { "readyState": 1 }, "timestamp": "..." }
```

### 2. Login flow

CSRF cookie + session cookie cần được **persist** giữa các requests. Dùng `-c cookies.txt -b cookies.txt`:

```bash
# Step 1: Lấy CSRF token
curl -c cookies.txt http://localhost:3000/api/auth/csrf
# { "csrfToken": "abc..." }
TOKEN="abc..."

# Step 2: Login
curl -b cookies.txt -c cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" \
  -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"admin@vlxdabc.vn","password":"Admin1234"}'
# { "user": { "id": "...", "email": "...", "role": "ADMIN" } }

# Step 3: Me (sau login)
curl -b cookies.txt http://localhost:3000/api/auth/me
```

### 3. End-to-end test: tạo invoice + thanh toán

```bash
# Tạo customer
curl -b cookies.txt -c cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" \
  -X POST http://localhost:3000/api/customers \
  -d '{
    "name": "Cty TNHH ABC",
    "phone": "0901234567",
    "email": "abc@example.com",
    "address": "123 Lê Lợi, Q.1, TP.HCM"
  }'
# → lấy customer.id

# Tạo product
curl -b cookies.txt -c cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" \
  -X POST http://localhost:3000/api/products \
  -d '{
    "name": "Xi măng PCB40",
    "category": "Xi măng",
    "unit": "bao",
    "price": 95000,
    "stock": 500
  }'
# → lấy product.id

# Tạo invoice unpaid (cấp số luôn)
curl -b cookies.txt -c cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" \
  -X POST http://localhost:3000/api/invoices \
  -d '{
    "customerId": "<CUSTOMER_ID>",
    "issueDate": "2026-05-18",
    "dueDate": "2026-06-17",
    "status": "unpaid",
    "items": [
      { "productId": "<PRODUCT_ID>", "quantity": 100, "unitPrice": 95000, "discount": 0 }
    ],
    "discount": 0,
    "shipping": 0
  }'
# → response có invoiceNumber=HD-2026-001, total=9500000+tax, status=unpaid

# Thêm thanh toán 5 triệu
curl -b cookies.txt -c cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" \
  -X POST http://localhost:3000/api/invoices/<INVOICE_ID>/payments \
  -d '{
    "amount": 5000000,
    "paymentDate": "2026-05-18",
    "method": "cash"
  }'
# → status='partial', remainingBalance giảm 5M

# Get detail
curl -b cookies.txt http://localhost:3000/api/invoices/<INVOICE_ID>
```

## Endpoints implemented

| Module | Endpoints |
|---|---|
| Auth | `GET /auth/csrf`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| Profile | `GET /profile`, `PATCH /profile`, `POST /profile/change-password` |
| Users (ADMIN) | `GET/POST /users`, `GET/PATCH /users/:id`, `POST /users/:id/reset-password` |
| Settings | `GET /settings` (ADMIN/ACCOUNTANT), `PATCH /settings` (ADMIN) |
| Customers | `GET/POST /customers`, `GET/PATCH /customers/:id` |
| Products | `GET/POST /products`, `GET /products/categories`, `GET/PATCH /products/:id` |
| Invoices | `GET/POST /invoices`, `GET/PATCH /invoices/:id`, `POST .../finalize`, `POST .../void`, `DELETE /invoices/:id` |
| Payments | `GET/POST /invoices/:invoiceId/payments` |
| Health | `GET /health` |

## Business rules đã enforce

- **F-1 → F-4**: line total, subtotal, tax (auto từ settings), total — tính server-side
- **F-5**: payment recompute canonical — query all + reduce, KHÔNG memory-cache
- **H-4**: post-recompute guard — throw 422 `DOMAIN-PAID-EXCEEDS-TOTAL` nếu race
- **F-9**: status function — draft/unpaid/partial/paid/void
- **F-12 + H-1**: atomic counter với retry E11000
- **H-2**: sparse unique invoiceNumber/quotationNumber
- **H-5**: CSRF exempt paths centralized
- **H-6**: convert quotation reload customer hiện tại (sẽ trong module quotations sau)
- **CR-CUST**: ensureActiveForInvoice — check active/deletedAt khi tạo invoice
- **CR-PROD**: ensureManyActive — check product active khi snapshot
- **RBAC**: 4 role + SALES ownership filter

## Stack

- NestJS 10, Mongoose 8, class-validator
- Session cookie HttpOnly + CSRF (csurf)
- bcrypt (cost 10)
- Logger console (xuất stdout — capture qua docker logs)

## Out of scope MVP

- Transactions / replica set
- Background queues
- Idempotency-Key dedupe
- Audit log DB-level
- Notifications / email
- Reports module (chỉ có dashboard endpoint sẽ build sau)
- Quotations module (sẽ build sau)
- PDF / Excel server-side
- Bulk import

## Test bằng Postman

Import file `postman-collection.json` trong cùng folder. Chạy theo thứ tự:
1. Health
2. CSRF
3. Login
4. Create Customer → save id vào collection variable
5. Create Product → save id
6. Create Invoice
7. Add Payment
8. Get Invoice (verify status)
