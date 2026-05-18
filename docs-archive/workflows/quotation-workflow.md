# Workflow — Quotation Lifecycle

**Source:** `src/app/pages/QuotationManagement.tsx`, `src/app/types.ts:Quotation`, `src/app/data/mockData.ts`.

This file zooms into the quotation lifecycle. See `workflows/approval-workflow.md` for the consolidated state diagram and `modules/quotations.md` for the business module SRS.

---

## 1. Lifecycle diagram

```
                    ┌────────┐
   "Tạo nháp"  ───▶│ draft  │──"Gửi cho khách"──┐
                    └────┬───┘                   │
                         │ edit                  ▼
                         │                  ┌────────┐
                         │                  │  sent  │
                         │                  └─┬──┬───┘
                         │                    │  │
                         │                    │  │  validUntil < today
                         │                    │  └──────────────┐
                         │                    │                 ▼
                         │     accepted       │            ┌──────────┐
                         │ ◀──────────────────┤            │ expired  │ (terminal)
                         │                    │            └──────────┘
                         ▼                    │
                    ┌──────────┐              │
                    │ accepted │──convert──▶ creates invoice (status=unpaid)
                    └──────────┘              │
                                              │ rejected
                                              ▼
                                         ┌──────────┐
                                         │ rejected │ (terminal)
                                         └──────────┘
```

---

## 2. Transition table

| From | Trigger | To | Guard |
|---|---|---|---|
| draft | "Gửi cho khách" | sent | items.length ≥ 1, validUntil > today |
| draft | delete | (removed) | only by creator/ADMIN |
| sent | "Đánh dấu chấp nhận" | accepted | — |
| sent | "Đánh dấu từ chối" | rejected | rejection reason recommended |
| sent | system clock crosses validUntil | expired | scheduled job + on-read check |
| accepted | "Chuyển thành hóa đơn" | (locked) → creates Invoice | once only; sets `converted_invoice_id` |
| rejected / expired | "Sao chép" (clone) | new draft | original stays read-only |

---

## 3. Conversion-to-invoice rules

| ID | Rule |
|---|---|
| WF-Q-01 | Conversion copies line items verbatim (productId, productName, quantity, unitPrice, discount, lineTotal). |
| WF-Q-02 | Customer info is snapshot-copied to the new invoice (re-resolves from customer master at conversion time). |
| WF-Q-03 | New invoice defaults: `status='unpaid'`, `issueDate = today`, `dueDate = today + defaultDueDays`. |
| WF-Q-04 | New invoice notes prepended with `"Từ báo giá BG-XXXX-NNN"` (recommended). |
| WF-Q-05 | The quotation row is locked: status remains `accepted`, `converted_invoice_id` is populated. Re-conversion attempts return the existing invoice (idempotent). |

---

## 4. Expiry job (recommended)

Run daily at 00:05 Asia/Ho_Chi_Minh:
```sql
UPDATE quotations
SET status = 'expired'
WHERE status = 'sent'
  AND valid_until < CURRENT_DATE
  AND deleted_at IS NULL;
```

Also mirror in the read path: when `GET /api/quotations` is invoked, the service should opportunistically run the same update.

---

## 5. UI behaviors

- Status badge colours hard-coded in `QuotationManagement.tsx:statusConfig` — see `modules/quotations.md` §12.
- Quotation number rendered in primary blue.
- Empty state: "Không tìm thấy báo giá nào".

---

## 6. Notifications (recommended)

| Event | Recipients | Channel |
|---|---|---|
| Quotation.sent | customer (if email known) | email with PDF |
| Quotation.expiring (3 days warning) | sales owner | in-app |
| Quotation.expired | sales owner | in-app |
| Quotation.accepted (via signed customer link) | sales owner + ACCOUNTANT | in-app + email |
| Quotation.rejected | sales owner | in-app |

---

## 7. Edge cases

| Case | Behavior |
|---|---|
| Customer accepts after expiry | Reject or revive? Default: reject — sales must clone. |
| Customer wants to renegotiate prices after `sent` | Sales must clone (sent is locked from edits). |
| Sales sends a quotation to wrong customer | Move to `rejected` with reason "Wrong customer"; clone for correct one. |
| Convert a quotation whose products no longer exist | Allow; the snapshot keeps the line items. Recommend warning if `productId` is now soft-deleted. |
