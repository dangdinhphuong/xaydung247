# Missing Authorization — Invoice Pro

> Authorization (RBAC + tenant isolation + ownership checks) does not exist (**[VERIFIED]**). This document is the **[RECOMMENDED]** target.

---

## 1. Current state

**[VERIFIED]**:
- No `<AuthGuard>` or role-check component wraps any route in `src/app/routes.ts`.
- No role conditional logic in any UI action button (e.g. Delete invoice is gated only by visual styling, not by role).
- No tenant concept exists in code (`tenant_id` not present anywhere).
- The Header displays a hard-coded "Quản trị viên" label, but it is decorative — no module reads from a role.

Consequence: every visitor can perform every action; in a multi-user / multi-tenant deployment this is a critical privilege-escalation hole.

---

## 2. Recommended authorization model

### 2.1 Three layers of enforcement

| Layer | Mechanism | Why |
|---|---|---|
| **UI guards** | `useAuth().can('Invoice:create')` → hide/disable buttons | UX clarity |
| **API middleware** | `@UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')` | Reject unauthorised requests |
| **Database RLS** | Postgres `CREATE POLICY ... USING (tenant_id = current_setting('app.current_tenant')::uuid)` | Defence in depth |

UI guards alone are **never** sufficient (attacker can call the API directly). API middleware alone is **almost** sufficient (RLS prevents a buggy query from leaking other tenants' rows).

### 2.2 Roles (recap from `roles/roles-and-permissions.md`)

| Code | Role | Label (vi) |
|---|---|---|
| `ADMIN` | Administrator | Quản trị viên |
| `ACCOUNTANT` | Accountant | Kế toán |
| `SALES` | Sales | Nhân viên kinh doanh |
| `VIEWER` | Viewer/Manager | Người xem / Quản lý |

Multi-role assignment per user is **[RECOMMENDED]** (e.g. owner is both `ADMIN` and `ACCOUNTANT`).

---

## 3. Permission catalog

Each action expressed as `<resource>:<verb>`. Backend `RolesGuard` and frontend `useAuth().can(...)` both reference this list.

| Permission | ADMIN | ACCOUNTANT | SALES | VIEWER |
|---|:---:|:---:|:---:|:---:|
| `Dashboard:read` | ✓ | ✓ | ✓ | ✓ |
| `Invoice:list` | ✓ | ✓ | ✓ (own) | — |
| `Invoice:create:draft` | ✓ | ✓ | ✓ | — |
| `Invoice:create:final` (status=unpaid) | ✓ | ✓ | — | — |
| `Invoice:read` | ✓ | ✓ | ✓ (own) | — |
| `Invoice:update:header` (notes, dates) | ✓ | ✓ | ✓ (own draft) | — |
| `Invoice:update:items` (only when draft) | ✓ | ✓ | ✓ (own draft) | — |
| `Invoice:delete` | ✓ | — | — | — |
| `Invoice:void` (cancel issued) | ✓ | — | — | — |
| `Invoice:print` | ✓ | ✓ | ✓ (own) | ✓ |
| `Invoice:export` | ✓ | ✓ | — | ✓ |
| `Payment:create` | ✓ | ✓ | — | — |
| `Payment:read` | ✓ | ✓ | ✓ (own invoice) | — |
| `Quotation:list` | ✓ | ✓ | ✓ | ✓ |
| `Quotation:create` | ✓ | ✓ | ✓ | — |
| `Quotation:send` | ✓ | ✓ | ✓ | — |
| `Quotation:accept` / `:reject` | ✓ | ✓ | ✓ | — |
| `Quotation:convert` | ✓ | ✓ | — | — |
| `Debt:read` | ✓ | ✓ | — | ✓ |
| `Customer:list` | ✓ | ✓ | ✓ | ✓ |
| `Customer:create` | ✓ | ✓ | ✓ | — |
| `Customer:update` | ✓ | ✓ | ✓ (own) | — |
| `Customer:delete` | ✓ | — | — | — |
| `Product:list` | ✓ | ✓ | ✓ | ✓ |
| `Product:create` / `:update` / `:delete` | ✓ | — | — | — |
| `Report:read` | ✓ | ✓ | — | ✓ |
| `Report:export` | ✓ | ✓ | — | ✓ |
| `Settings:company:update` | ✓ | — | — | — |
| `Settings:invoice:update` | ✓ | — | — | — |
| `Settings:notifications:update` (self) | ✓ | ✓ | ✓ | ✓ |
| `Template:list` | ✓ | ✓ | — | — |
| `Template:create` / `:update` / `:delete` / `:setDefault` | ✓ | — | — | — |
| `User:list` / `:create` / `:update` / `:deactivate` | ✓ | — | — | — |
| `Audit:read` | ✓ | — | — | — |

Ownership notes:
- "(own)" means: SALES sees / mutates only invoices/customers where `created_by_user_id = currentUser.id` OR `salesperson_user_id = currentUser.id`.
- ADMINs of a tenant see everything in that tenant.

---

## 4. Tenant isolation rules

**[RECOMMENDED]**:

1. Every API request carries an authenticated principal that includes `tenant_id`.
2. `TenantInterceptor` extracts `tenant_id` and stores it on the request context.
3. The repository / DAO layer adds `WHERE tenant_id = :session_tenant` to every query — never trusts a `tenantId` from the request body.
4. Postgres RLS policy on every table:
   ```sql
   ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
   CREATE POLICY invoices_tenant_isolation ON invoices
     USING (tenant_id = current_setting('app.current_tenant')::uuid);
   ```
5. Cross-tenant ID guesses return **404** (NOT 403) to avoid leaking the existence of foreign IDs.

---

## 5. UI consequences

| UI element | Show only when |
|---|---|
| Sidebar "Báo cáo" item | `can('Report:read')` |
| Sidebar "Cài đặt" item | `can('Settings:company:update') OR …` |
| "Tạo hóa đơn mới" button | `can('Invoice:create:draft')` |
| "Thêm thanh toán" button on InvoiceDetail | `can('Payment:create') AND invoice.remainingBalance > 0 AND invoice.status !== 'draft'` |
| Edit / Delete row actions | `can('Invoice:update:*')` / `can('Invoice:delete')` |
| "Xuất Excel" buttons | `can('Report:export')` |
| Templates list page | `can('Template:list')` |
| "Đặt làm mặc định" template button | `can('Template:setDefault')` |
| Settings form sections | per-section permission |
| User management page | `can('User:list')` |
| Audit log page | `can('Audit:read')` |

Implementation hint: a single `<Can permission="Invoice:create:final">{children}</Can>` HOC + a `useAuth().can(...)` helper.

---

## 6. Server-side guard implementation (NestJS sketch)

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const required: Permission[] = this.reflector.getAllAndOverride('permissions', [ctx.getHandler(), ctx.getClass()]) ?? [];
    if (required.length === 0) return true;
    const { user } = ctx.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();
    return required.every(p => this.permissionService.can(user, p));
  }
}

// Decorator
export const RequirePermission = (...perms: Permission[]) => SetMetadata('permissions', perms);

// Usage
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  @Post()
  @RequirePermission('Invoice:create:final')
  create(@CurrentUser() u: AuthUser, @Body() dto: CreateInvoiceDto) { … }

  @Post(':id/payments')
  @RequirePermission('Payment:create')
  addPayment(@Param('id') id: string, @Body() dto: AddPaymentDto) { … }
}
```

Repositories enforce `tenant_id`:
```ts
async findInvoiceById(id: string, tenantId: string) {
  return this.repo.findOne({ where: { id, tenantId } }); // 404 if mismatch
}
```

---

## 7. Ownership checks

**[RECOMMENDED]** Beyond role, SALES sees only resources they "own":

| Resource | Ownership predicate |
|---|---|
| Invoice | `created_by_user_id = user.id OR salesperson_user_id = user.id` |
| Customer | `created_by_user_id = user.id` (recommended; debatable whether SALES owns customers globally — confirm with business) |
| Quotation | `created_by_user_id = user.id` |

Implementation: query-level predicates added by the repository when the principal's role is SALES (and not also ADMIN/ACCOUNTANT).

---

## 8. Bypass / override rules

- An `ADMIN` can act on behalf of a colleague (`X-Acting-As: <userId>` header — optional). All audit log entries record `actor` (admin) AND `on_behalf_of` (target).
- A user with multiple roles gets the **union** of permissions.

---

## 9. Error responses

| HTTP | Code | When |
|---|---|---|
| 401 | `UNAUTHENTICATED` | No session / expired token |
| 403 | `FORBIDDEN` | Authenticated but lacks the required permission |
| 404 | `NOT_FOUND` | Resource id does not exist **OR** belongs to another tenant (do not leak) |
| 409 | `CONFLICT` | Concurrency or duplicate-key |

Response body uses Problem Details (`architecture/missing-backend-components.md` §3.6).

---

## 10. Tests required

| Category | See |
|---|---|
| RBAC happy paths | `qa/qa-test-scenarios.md` §15 (rec.), §SEC-AUTHZ-* |
| Cross-tenant attempts | `qa/security-test-cases.md` SEC-AUTHZ-04..05, SEC-TEN-01..05 |
| Privilege escalation via body params | SEC-AUTHZ-07 |

---

## 11. Pre-launch gating

Authorization MUST be complete before production exposure. Minimum:

- [ ] Permission catalog defined and code-enforced.
- [ ] `tenant_id` on every business row and every query.
- [ ] RLS enabled in Postgres.
- [ ] UI guards mirror server guards (same constants shared via a generated types package).
- [ ] Ownership predicates for SALES.
- [ ] Audit log records `actor`, `actor_role`, `tenant_id` on every write.
