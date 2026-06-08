# Auth & RBAC — MVP v1

## 1. Authentication

### 1.1 Cách hoạt động

- Session cookie HttpOnly + Secure + SameSite=Lax.
- Session store: MongoDB qua `connect-mongo` (cùng DB với app data, collection `sessions`).
- CSRF protection: csurf middleware, FE attach `X-CSRF-Token` header trên mọi mutation.
- Không có MFA, OIDC, social login trong MVP.

### 1.2 Endpoints

| Method | Path | Auth | Mục đích |
|---|---|---|---|
| GET | `/api/auth/csrf` | None | FE call ở app mount để lấy CSRF token |
| POST | `/api/auth/login` | None | `{email, password}` → set session cookie |
| POST | `/api/auth/logout` | Session | destroy session |
| GET | `/api/auth/me` | Session | `{user}` |
| POST | `/api/auth/change-password` | Session | `{currentPassword, newPassword}` |

### 1.3 Password rules

- Bcrypt cost 10.
- Min 8 chars, ≥ 1 chữ và ≥ 1 số.
- Không có HIBP check, không có rotation, không lockout (MVP single-tenant nội bộ).

### 1.4 Forgot password

Không có flow tự động trong MVP. ADMIN reset password thủ công qua UI Users management:

- ADMIN vào `/users/:id/edit` → nút "Đặt lại mật khẩu" → modal nhập password mới → save.

### 1.5 Login flow

```
1. FE GET /api/auth/csrf → lưu csrfToken in memory.
2. User nhập email + password trên LoginPage.
3. FE POST /api/auth/login với header X-CSRF-Token, body { email, password }.
4. BE: AuthService.validate(email, password) — query users, bcrypt.compare.
5. BE: req.session.userId = user._id.toString().
6. BE: return { user: { id, email, fullName, role } }.
7. FE: redirect /  (hoặc URL từ ?from=...)
```

## 2. RBAC

### 2.1 4 roles

| Code | Tiếng Việt | Mô tả |
|---|---|---|
| ADMIN | Quản trị viên | Chủ shop. Full quyền + settings + delete + manage users. |
| ACCOUNTANT | Kế toán | Tạo/finalize/void invoice, ghi nhận thanh toán, xem báo giá, xem công nợ. |
| SALES | Nhân viên kinh doanh | Lập báo giá, draft invoice, xem khách hàng/sản phẩm. |
| VIEWER | Người xem | Chỉ xem dashboard + công nợ. |

### 2.2 Permission matrix

Legend: ✓ = allowed, ✗ = forbidden, — = no access (404).

| Action | ADMIN | ACCOUNTANT | SALES | VIEWER |
|---|:---:|:---:|:---:|:---:|
| Login / Logout / Profile self | ✓ | ✓ | ✓ | ✓ |
| Change own password | ✓ | ✓ | ✓ | ✓ |
| Dashboard read | ✓ | ✓ | ✓ | ✓ |
| **Users** |  |  |  |  |
| List users | ✓ | — | — | — |
| Create / Update / Reset password / Deactivate user | ✓ | — | — | — |
| **Customers** |  |  |  |  |
| List / View | ✓ | ✓ | ✓ | ✓ |
| Create / Update | ✓ | ✓ | ✓ | — |
| Soft delete | ✓ | — | — | — |
| **Products** |  |  |  |  |
| List / View | ✓ | ✓ | ✓ | ✓ |
| Create / Update | ✓ | — | — | — |
| Soft delete | ✓ | — | — | — |
| **Invoices** |  |  |  |  |
| List | ✓ | ✓ | ✓ | — |
| View detail | ✓ | ✓ | ✓ | — |
| Create draft | ✓ | ✓ | ✓ | — |
| Create direct (status=unpaid) | ✓ | ✓ | — | — |
| Update header (notes/dates) | ✓ | ✓ | ✓ (own draft) | — |
| Update items (only draft) | ✓ | ✓ | ✓ (own draft) | — |
| Finalize (draft → unpaid) | ✓ | ✓ | — | — |
| Void | ✓ | — | — | — |
| Soft delete (only draft / void) | ✓ | — | — | — |
| Print | ✓ | ✓ | ✓ | ✓ |
| **Payments** |  |  |  |  |
| Add payment | ✓ | ✓ | — | — |
| View payment history | ✓ | ✓ | ✓ | — |
| **Quotations** |  |  |  |  |
| List / View | ✓ | ✓ | ✓ | ✓ |
| Create / Update (draft) | ✓ | ✓ | ✓ | — |
| Send | ✓ | ✓ | ✓ | — |
| Accept / Reject | ✓ | ✓ | ✓ | — |
| Convert to invoice | ✓ | ✓ | — | — |
| Clone | ✓ | ✓ | ✓ | — |
| Delete (only draft) | ✓ | — | — | — |
| **Settings** |  |  |  |  |
| View | ✓ | ✓ | — | — |
| Update | ✓ | — | — | — |

### 2.3 Ownership

SALES role có ownership constraint:
- `Invoice.createdBy === currentUser.id` cho update operations.

Service implement: thêm `createdBy: user.id` vào query filter khi role là SALES và action là update/delete.

```typescript
async update(id, dto, user) {
  const filter: any = { _id: id, deletedAt: null }
  if (user.role === 'SALES') {
    filter.createdBy = user.id
  }
  const invoice = await this.invoiceModel.findOne(filter)
  if (!invoice) throw new NotFoundException()  // 404 không 403 để không leak existence
  ...
}
```

### 2.4 Backend implementation

Decorator + Guard:

```typescript
@Controller('invoices')
@UseGuards(SessionAuthGuard, RolesGuard)
export class InvoicesController {
  @Get()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  list() { ... }

  @Post(':id/payments')
  @Roles('ADMIN', 'ACCOUNTANT')
  addPayment() { ... }

  @Post(':id/void')
  @Roles('ADMIN')
  void() { ... }
}
```

`@Public()` decorator cho endpoints không cần auth:

```typescript
@Public()
@Get('csrf')
csrf() { ... }
```

`SessionAuthGuard` skip nếu metadata `isPublic`.

### 2.5 Frontend implementation

```typescript
// useAuth().can('Invoice:create:final')
const can = (perm: string) => {
  const matrix = PERMISSION_MATRIX[user.role]
  return matrix.includes(perm)
}

// UI conditional
{can('Invoice:void') && (
  <Button onClick={voidInvoice}>Huỷ hoá đơn</Button>
)}
```

`PERMISSION_MATRIX` sync với backend; lưu trong `src/app/auth/permissions.ts`. Nếu có thay đổi, update cả 2 nơi.

### 2.6 Last admin protection

```typescript
// users.service.ts
async update(id, dto) {
  const target = await this.userModel.findById(id)
  if (target.role === 'ADMIN' && dto.role !== 'ADMIN') {
    const adminCount = await this.userModel.countDocuments({ role: 'ADMIN', status: 'active' })
    if (adminCount <= 1) throw new BadRequestException('DOMAIN-LAST-ADMIN')
  }
  // tương tự cho deactivate
  ...
}
```

## 3. CSRF

### 3.1 Cấu hình

```typescript
// main.ts
app.use(csurf({
  cookie: false,                    // dùng session để lưu secret
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
}))
```

Backend tự skip CSRF check cho `GET /api/auth/csrf` và `POST /api/auth/login` (chưa có session).

### 3.2 FE flow

```typescript
// src/app/lib/csrf.ts
let csrfToken: string | null = null

export async function fetchCsrfToken() {
  const res = await fetch('/api/auth/csrf')
  const data = await res.json()
  csrfToken = data.csrfToken
}

export function getCsrfToken() {
  return csrfToken
}

// src/app/lib/http.ts
export async function fetchJson(url, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  if (!['GET', 'HEAD'].includes(options.method ?? 'GET')) {
    headers.set('X-CSRF-Token', getCsrfToken() ?? '')
  }
  const res = await fetch(url, { ...options, headers, credentials: 'include' })
  ...
}
```

`fetchCsrfToken` gọi ở app mount + sau login + sau khi nhận 403 với code `EBADCSRFTOKEN` (token expire).

## 4. Session management

- TTL 24h.
- Sliding: mỗi request refresh expiry.
- Logout: `req.session.destroy()` + clear cookie.
- Khi user bị deactivate, session vẫn tồn tại đến khi expire HOẶC backend check `user.status` mỗi request (SessionAuthGuard đã làm).

## 5. Security checklist

| Item | Status |
|---|---|
| HTTPS only | ✓ (nginx TLS) |
| HttpOnly cookie | ✓ |
| Secure cookie (production) | ✓ |
| SameSite=Lax | ✓ |
| CSRF token mọi mutation | ✓ |
| Bcrypt password | ✓ |
| Rate limit | ❌ (MVP, single-tenant) |
| Account lockout | ❌ (MVP) |
| MFA | ❌ |
| OIDC SSO | ❌ |
| Password rotation | ❌ |
| HIBP check | ❌ |

Khi mở public hoặc multi-tenant → re-evaluate.

## 6. Not implemented (cố ý)

- ❌ Multi-tenancy + tenantId
- ❌ Refresh token / JWT
- ❌ Per-resource ACL (chỉ có role)
- ❌ Permission catalog database-driven (hard-coded matrix)
- ❌ Audit log
- ❌ Active session list per user
- ❌ Force logout all sessions
- ❌ Login history
