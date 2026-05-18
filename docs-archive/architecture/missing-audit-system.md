# Missing Audit System — Invoice Pro

> No audit logging exists (**[VERIFIED]**). This document is the **[RECOMMENDED]** target audit subsystem.

---

## 1. Current state

**[VERIFIED]**:
- No `audit_logs` table / collection / file.
- No structured logger; only `console.log` (`pages/TemplateList.tsx:handleSetDefault`).
- Mutations to invoices and payments leave no trace of "who did what, when".
- Browser refresh wipes the state without record.

Consequence: in any future production deployment, "who changed this invoice?" is unanswerable; tax-audit and security-incident investigations are impossible.

---

## 2. Recommended audit subsystem

### 2.1 Storage
**[RECOMMENDED]** `audit_logs` table in the primary Postgres DB (defined in `database/database-dictionary.md`):

```sql
CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  actor_user_id   UUID NOT NULL,
  actor_role      VARCHAR(20) NOT NULL,
  action          VARCHAR(60) NOT NULL,        -- e.g. invoice.create, payment.create, settings.update
  resource_type   VARCHAR(40) NOT NULL,
  resource_id     UUID,
  before_json     JSONB,                       -- snapshot before mutation (NULL on create)
  after_json      JSONB,                       -- snapshot after mutation (NULL on delete)
  cause_json      JSONB,                       -- e.g. {type: 'payment.create', payment_id: '…'}
  ip              INET,
  user_agent      TEXT,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_resource_idx ON audit_logs (tenant_id, resource_type, resource_id, occurred_at DESC);
CREATE INDEX audit_logs_actor_idx    ON audit_logs (tenant_id, actor_user_id, occurred_at DESC);

-- Defence in depth: revoke UPDATE / DELETE from the application role
REVOKE UPDATE, DELETE ON audit_logs FROM invoicepro_app;
```

Append-only — no UI lets a user edit or delete an audit row.

### 2.2 Producer — `AuditInterceptor`
A NestJS interceptor (or Spring AOP advice) wraps every mutating endpoint and emits one row after the underlying TX commits.

```ts
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req  = ctx.switchToHttp().getRequest();
    const meta = this.reflector.get<AuditMeta>('audit', ctx.getHandler());
    if (!meta) return next.handle();
    const before = meta.captureBefore ? this.snapshot(meta, req) : null;
    return next.handle().pipe(
      tap(after => this.audit.write({
        tenantId: req.user.tenantId,
        actorUserId: req.user.id,
        actorRole: req.user.role,
        action: meta.action,
        resourceType: meta.resourceType,
        resourceId: this.extractId(after, req),
        beforeJson: before,
        afterJson:  meta.captureAfter ? after : null,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      }))
    );
  }
}
```

Decorator usage:
```ts
@Post()
@Audit({ action: 'invoice.create', resourceType: 'invoice', captureAfter: true })
create(@Body() dto: CreateInvoiceDto) { ... }
```

### 2.3 Consumer — `/audit` admin UI
A read-only page for `ADMIN` of the tenant. Filters: actor, action, resource type, resource id, date range. Export to CSV.

---

## 3. Actions to log

### 3.1 Authentication
| Action | When |
|---|---|
| `auth.login.success` | Successful login |
| `auth.login.failure` | Wrong password / unknown email |
| `auth.lockout` | 5th failure in 15 min |
| `auth.logout` | Manual logout |
| `auth.password_change` | Self-change |
| `auth.password_reset.requested` | Forgot-password requested |
| `auth.password_reset.completed` | New password set via reset token |

### 3.2 User & RBAC
| Action |
|---|
| `user.create` |
| `user.update` |
| `user.role_change` |
| `user.deactivate` / `user.reactivate` |

### 3.3 Invoice lifecycle
| Action |
|---|
| `invoice.create` (draft / final) |
| `invoice.update` |
| `invoice.finalize` (draft → unpaid) |
| `invoice.status_change` — auto recompute → overdue (write only when status actually changes) |
| `invoice.void` |
| `invoice.delete` (ADMIN soft delete) |
| `invoice.print` |
| `invoice.pdf_generated` |
| `invoice.export` |

### 3.4 Payments
| Action |
|---|
| `payment.create` |
| `payment.refund` (future) |

### 3.5 Quotations
| Action |
|---|
| `quotation.create` |
| `quotation.update` |
| `quotation.send` |
| `quotation.accept` |
| `quotation.reject` |
| `quotation.expire` (auto) |
| `quotation.convert` |
| `quotation.clone` |

### 3.6 Customers & Products
| Action |
|---|
| `customer.create` / `.update` / `.deactivate` |
| `product.create` / `.update` / `.delete` |

### 3.7 Settings & Templates
| Action |
|---|
| `settings.company.update` |
| `settings.invoice.update` |
| `settings.notifications.update` |
| `template.create` / `.update` / `.delete` / `.set_default` / `.clone` |

### 3.8 Reports
| Action |
|---|
| `report.view` (optional; can be noisy) |
| `report.export` |

---

## 4. Required attributes per event

For every event:
- **Who:** `actor_user_id`, `actor_role`, optional `on_behalf_of_user_id`.
- **What:** `action`, `resource_type`, `resource_id`.
- **When:** `occurred_at` (server time, UTC) + tenant-TZ representation in UI.
- **Where (network):** `ip`, `user_agent`.
- **Before / after:** full row snapshot on update; diff-derived. For create, only `after_json`; for delete, only `before_json`.
- **Causality (recommended):** `cause_json` linking to the request that triggered the change (`request_id`) or to the parent event (e.g. an `invoice.status_change` caused by a specific `payment.create` carries `cause_json = {type: 'payment.create', payment_id: '…'}`).

---

## 5. Read-side semantics

- The audit log is **strictly read-only** via UI / API.
- DB privileges revoke `UPDATE` and `DELETE` from the application role.
- Backups include audit rows; PITR allows replay if a row is accidentally lost.
- Cross-tenant audit queries are forbidden — every read scoped by `tenant_id`.

---

## 6. Retention

| Class | Retention |
|---|---|
| Authentication events | 2 years |
| Invoice / payment / financial events | **10 years** (Vietnam tax record requirement) |
| RBAC / user-management events | 5 years |
| Settings / template events | 5 years |
| Report-view events | 90 days (high volume; less critical) |

A retention worker purges expired rows nightly.

---

## 7. Performance considerations

- Audit writes happen **after** the business transaction commits — never inside the same TX as the business write (avoids blocking).
- Batch fire-and-forget into a Redis queue if write volume becomes high; a consumer drains to Postgres.
- Indexes optimized for "show me the timeline of resource X" and "show me everything user Y did".

---

## 8. UI requirements

`/audit` page (ADMIN only):

| Section | Fields |
|---|---|
| Filter bar | Actor (autocomplete), Action (dropdown), Resource type (dropdown), Resource id (text), Date range, Tenant (omitted for non-super-admin) |
| Results table | Time · Actor (avatar + name) · Action · Resource (link to entity if available) · Before/After (expandable JSON diff) · IP · UA |
| Export | CSV download (rate-limited; itself logged as `audit.export`) |

Drill-down: clicking an audit row opens a JSON diff viewer (e.g. `react-json-view-lite`).

---

## 9. Cross-references

- `database/database-dictionary.md` → table `audit_logs`.
- `architecture/missing-backend-components.md` → AuditInterceptor as cross-cutting provider.
- `architecture/missing-authentication.md` → BR-AUTH-* events to audit.
- `architecture/missing-authorization.md` → mandatory audit on every mutating endpoint.
- `gap-analysis/security-risks.md` → SECR-011 (audit log integrity), SECR-012 (PII scrubbing in logs).
- `qa/security-test-cases.md` → SEC-AUD-01..04.

---

## 10. Pre-launch checklist

- [ ] `audit_logs` table migrated, RLS-enabled.
- [ ] DB privileges revoke UPDATE / DELETE.
- [ ] AuditInterceptor wraps every mutating controller.
- [ ] `/audit` read UI delivered for ADMIN.
- [ ] CSV export with size cap and rate limit.
- [ ] Retention worker scheduled.
- [ ] Restore-from-backup drill confirms audit rows are preserved.
