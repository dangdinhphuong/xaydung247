# Module — Settings (Cài đặt)

**Source:** `src/app/pages/Settings.tsx`.

---

## 1. Purpose
Centralise tenant-level configuration: company profile (appears on invoices), invoice numbering & tax defaults, and notification preferences.

## 2. Business description
The Settings page is grouped into four cards:
1. **Cài đặt nhanh** — quick link to "Mẫu hóa đơn" (`/settings/templates`).
2. **Thông tin công ty** — Tên công ty, Mã số thuế, Địa chỉ, Số điện thoại, Email.
3. **Cài đặt hóa đơn** — Tiền tố hóa đơn, Số hóa đơn tiếp theo, Số ngày đến hạn mặc định, Thuế suất mặc định (%), plus 3 toggles:
   - Tự động tính thuế (default ON)
   - Gửi email tự động (default OFF)
   - Nhắc nhở thanh toán (default ON)
4. **Thông báo** — 3 toggles:
   - Thông báo hóa đơn mới (ON)
   - Thông báo thanh toán (ON)
   - Thông báo hóa đơn quá hạn (ON)

All "Lưu thay đổi" buttons are present but **not wired** (no save handler) — gap to close.

## 3. Actors
ADMIN — write company info, invoice settings.
Any role — write own notification preferences (recommended).

## 4. Trigger conditions
Sidebar → "Cài đặt".

---

## 5. Form fields

### 5.1 Company

| Field | Type | Required | Validation | Default (seed) | Business meaning |
|---|---|---|---|---|---|
| companyName | text | Yes | 2–200 chars | "Công ty TNHH Vật Liệu Xây Dựng ABC" | Header on every invoice |
| taxCode | text | No (recommended Yes) | VN MST | "0123456789" | Required for VAT invoices |
| address | text | Yes | ≤ 300 chars | "123 Đường Võ Văn Tần, Q.3, TP.HCM" | Header |
| phone | text | Yes | VN format | "028 1234 5678" | Header |
| email | email | Yes | RFC-5322 | "info@vlxdabc.vn" | Header / auto-send sender |

### 5.2 Invoice settings

| Field | Type | Required | Validation | Default (seed) | Business meaning |
|---|---|---|---|---|---|
| invoicePrefix | text | Yes | `^[A-Z0-9-]+$` | "HD-" | Prepended to numbering |
| nextNumber | integer | Yes | ≥ 1 | 9 | Next sequence number |
| defaultDueDays | integer | Yes | 0–365 | 30 | Default days from issueDate to dueDate |
| taxRate | number | No | 0–100 | 10 | Default VAT % |
| autoTax | boolean | — | — | true | Auto-apply VAT on new invoices |
| autoEmail | boolean | — | — | false | Auto-email invoice on finalize |
| paymentReminder | boolean | — | — | true | Send reminder N days before due |

### 5.3 Notifications (per-user)

| Field | Type | Default | Meaning |
|---|---|---|---|
| notifyNewInvoice | boolean | true | In-app + email when invoice created |
| notifyPayment | boolean | true | When payment recorded |
| notifyOverdue | boolean | true | When invoice flips to overdue |

---

## 6. Business rules

| ID | Rule |
|---|---|
| BR-SET-01 | Invoice numbering on create MUST use `invoicePrefix + zeroPad(N)(nextNumber)` and increment `nextNumber` atomically. **Current code does not use these settings — it has its own bug-prone logic (see modules/orders.md BR-CI-04).** |
| BR-SET-02 | `defaultDueDays` MUST be used by `CreateInvoice` to set the default `dueDate` (currently hard-coded `+30 days`). |
| BR-SET-03 | `taxRate` × subtotal MUST be the default value of `tax` on a new invoice when `autoTax` is ON. |
| BR-SET-04 | Company info is the SOURCE of `Ten_Cong_Ty / Dia_Chi_Cong_Ty / …` placeholders in the template HTML editor. |
| BR-SET-05 | Only ADMIN may save Company / Invoice settings. |
| BR-SET-06 | Notification toggles are per-user when applied to in-app/email destination (recommended). |
| BR-SET-07 | Changing `invoicePrefix` mid-year SHOULD NOT renumber existing invoices. |

## 7. Validation rules

| Code | Trigger | Message |
|---|---|---|
| V-SET-01 | Empty companyName | "Tên công ty là bắt buộc" |
| V-SET-02 | Invalid email | "Email không hợp lệ" |
| V-SET-03 | `nextNumber ≤ max(existing)` | "Số tiếp theo phải lớn hơn số đã dùng" |
| V-SET-04 | `defaultDueDays` out of range | "Số ngày đến hạn không hợp lệ (0–365)" |
| V-SET-05 | `taxRate` out of range | "Thuế suất phải nằm trong khoảng 0–100" |

## 8. UI behaviors
- All sections have a primary-blue "Lưu thay đổi" button with a Save icon.
- Switches are Radix-Switch components.
- Inputs `defaultValue` (uncontrolled in current code → on submit must be read via `ref` or migrated to controlled state when wiring real save).

## 9. API contract (recommended)

| Verb | Path | Body | Response |
|---|---|---|---|
| GET | `/api/settings` | — | `Settings` |
| PUT | `/api/settings/company` | company fields | `Settings` |
| PUT | `/api/settings/invoice` | invoice fields | `Settings` |
| PUT | `/api/settings/notifications` | per-user toggles | `Settings` |

## 10. Permission rules
- ADMIN: company + invoice + own notifications.
- Other roles: own notifications only.

## 11. Edge cases
- Two admins editing concurrently → last-write-wins (acceptable) or optimistic-locking via `updatedAt` (recommended).
- A change to `taxRate` after invoices are issued does not retroactively change them.
