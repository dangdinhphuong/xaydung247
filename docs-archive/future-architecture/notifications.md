# Future Architecture — Notifications

---

## 1. Current Frontend Implementation [VERIFIED]

- `Header.tsx` shows a bell with a permanent red dot.
- No notification list, no dropdown content, no read/unread state.
- No backend.

## 2. Missing Backend Requirements [RECOMMENDED]

- Notification table per tenant.
- Real-time delivery via WebSocket (or fallback polling).
- Per-user preferences (already designed in `user_notification_prefs`).
- Producers:
  - `invoice.create` → notify `Settings:notifyNewInvoice` subscribers.
  - `payment.create` → notify `notifyPayment` subscribers.
  - `invoice.status_change → overdue` → notify `notifyOverdue` subscribers.
  - `quotation.accepted` → notify owner.
  - `quotation.expiring (3 days)` → notify owner.

## 3. Recommended API Design [RECOMMENDED]

| Verb | Path | Body | Permission |
|---|---|---|---|
| GET    | `/api/notifications?unread=true&limit=20` | — | (self) |
| POST   | `/api/notifications/:id/read` | — | (self) |
| POST   | `/api/notifications/read-all` | — | (self) |
| GET    | `/api/notifications/unread-count` | — | (self) |
| GET    | `/api/notifications/stream` | SSE/WebSocket | (self) |

## 4. Recommended Database Tables [RECOMMENDED]

```sql
CREATE TABLE notifications (
  id            UUID PRIMARY KEY,
  tenant_id     UUID NOT NULL,
  user_id       UUID NOT NULL,        -- recipient
  type          VARCHAR(40) NOT NULL, -- invoice.created | payment.received | invoice.overdue | quotation.*
  title         VARCHAR(200) NOT NULL,
  body          TEXT,
  link          TEXT,                 -- in-app deep link, e.g. /invoices/<id>
  resource_type VARCHAR(40),
  resource_id   UUID,
  is_read       BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at       TIMESTAMPTZ
);
CREATE INDEX notifications_user_unread_idx ON notifications (user_id, created_at DESC) WHERE is_read = false;
```

## 5. Recommended Auth Flow [RECOMMENDED]

- All endpoints `(self)` scoped — uses `currentUser.id`.

## 6. Recommended Validation Strategy [RECOMMENDED]

- N/A for writes (system-generated).
- On `read`: server checks `user_id = currentUser.id` (404 otherwise).

## 7. Recommended Audit Logging [RECOMMENDED]

- Notification reads / dismissals not audited (volume).
- Producer events already audited at their source.

## 8. Recommended State Persistence [RECOMMENDED]

- FE: `useQuery(['notifications','unread-count'], { refetchInterval: 60_000 })` OR WS subscription.
- Bell badge bound to that count.
- Dropdown lazy-loads `useQuery(['notifications', { unread: false, limit: 20 }])`.
- Mark-read mutation invalidates both queries.
