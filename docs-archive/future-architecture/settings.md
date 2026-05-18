# Future Architecture — Settings (Cài đặt)

---

## 1. Current Frontend Implementation [VERIFIED]

- Route `/settings` → `pages/Settings.tsx`.
- 4 sections: quick links, company info, invoice settings, notification settings.
- Inputs use `defaultValue` (uncontrolled) → state lives in the DOM.
- Save buttons render but have **no handlers** (ISSUE-011).
- Settings have **no consumers** (`invoicePrefix`, `nextNumber`, `defaultDueDays`, `taxRate`, `autoTax`, `autoEmail`, `paymentReminder`, notification toggles).

## 2. Missing Backend Requirements [RECOMMENDED]

- Persistent `tenant_settings` and `user_notification_prefs` tables.
- Consume settings in: invoice numbering, default due-days, default VAT, email triggers, reminder scheduling, notification routing.
- Atomic `nextNumber` allocation.

## 3. Recommended API Design [RECOMMENDED]

| Verb | Path | Body | Permission |
|---|---|---|---|
| GET | `/api/settings` | — | (any authenticated; returns tenant + per-user prefs) |
| PUT | `/api/settings/company` | `{companyName, taxCode?, address, phone, email}` | `Settings:company:update` |
| PUT | `/api/settings/invoice` | `{invoicePrefix, nextNumber, defaultDueDays, defaultTaxRate, autoTax, autoEmail, paymentReminder}` | `Settings:invoice:update` |
| PUT | `/api/settings/notifications` | `{notifyNewInvoice, notifyPayment, notifyOverdue}` | `Settings:notifications:update` (self) |

`If-Match: <ISO updated_at>` required on PUT (optimistic concurrency).

## 4. Recommended Database Tables [RECOMMENDED]

- `tenant_settings` (PK = `tenant_id`).
- `user_notification_prefs` (PK = `user_id`).
- See `database/database-dictionary.md`.

## 5. Recommended Auth Flow [RECOMMENDED]

- `JwtAuthGuard` + `@RequirePermission('Settings:…')`.
- ADMIN only for company / invoice; any role for own notifications.

## 6. Recommended Validation Strategy [RECOMMENDED]

- V-SET-01..06 (`qa/validation-rules.md` §6).
- `nextNumber` must be greater than current `MAX(invoice sequence)` for the tenant.
- `invoicePrefix` regex `^[A-Z0-9-]+$`.
- `defaultDueDays` in `[0, 365]`.
- `defaultTaxRate` in `[0, 100]`.

## 7. Recommended Audit Logging [RECOMMENDED]

- `settings.company.update`, `settings.invoice.update`, `settings.notifications.update`.
- Always include `before / after` snapshots.

## 8. Recommended State Persistence [RECOMMENDED]

- FE: migrate to `react-hook-form + zod`; replace `defaultValue` with controlled state.
- `useQuery(['settings'])` + `useMutation` per section.
- On save → `invalidateQueries(['settings'])`, plus invalidate any derived queries (e.g. default-due-days affects new-invoice form).
