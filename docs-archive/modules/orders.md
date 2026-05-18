# Module — Invoice ("Order") Management (Quản lý hóa đơn)

> In this product, the **"order" is the invoice** — there is no separate sales-order entity. The invoice is created as either `draft` (a saved draft) or `unpaid` (a finalised, legally binding sale).

**Sources:**
- `src/app/pages/InvoiceList.tsx`
- `src/app/pages/CreateInvoice.tsx`
- `src/app/pages/InvoiceDetail.tsx`
- `src/app/components/PaymentModal.tsx`
- `src/app/components/StatusBadge.tsx`
- `src/app/data/store.ts`
- `src/app/utils/invoiceCalculations.ts`
- `src/app/utils/formatters.ts`
- `src/app/types.ts`

---

## 1. Purpose
Issue, view, search, filter, and collect on sales invoices, with multi-payment support and automatic overdue handling.

## 2. Business description
Every B2B sale is captured as an invoice with:
- Header: customer + dates + notes.
- N line items (product, quantity, unit price, line-level absolute-VND discount, computed line total).
- Invoice-level discount, VAT, shipping.
- A live `status` reflecting payment & due-date.
- A `payments[]` array (append-only) of received cash with method, date, reference, note.

## 3. Actors
ADMIN, ACCOUNTANT (full), SALES (create + view own), VIEWER (recommended: read).

## 4. Preconditions
- Customer master is non-empty.
- Product master is non-empty.

---

## 5. Submodules / routes
| Route | Purpose |
|---|---|
| `/invoices` | List with search + status filter |
| `/invoices/create` | New-invoice form |
| `/invoices/:id` | Detail + add-payment |

---

## 6. Status lifecycle

| Status | Vietnamese | Colour pill | Meaning | Reachable from |
|---|---|---|---|---|
| `draft` | Nháp | grey | Saved-but-not-issued. NOT a receivable. | (creation with "Lưu nháp") |
| `unpaid` | Chưa thanh toán | red soft | Issued, no payment yet, not past due. | (creation with "Tạo hóa đơn") |
| `partial` | Thanh toán một phần | orange | At least 1 payment, balance remaining, not past due. | `unpaid → partial` on first payment |
| `paid` | Đã thanh toán | green | `remainingBalance ≤ 0`. Terminal. | any → on full payment |
| `overdue` | Quá hạn | red strong | `remainingBalance > 0` AND `dueDate < today` AND `status !== 'draft'`. | `unpaid → overdue`, `partial → overdue` |

> Auto-evaluation: `store.updateOverdueStatuses()` runs on every `getInvoices()` and `getInvoice()` call.
> Re-payment after overdue may move status back to `paid` if balance reaches 0 (since calculateStatus → `paid` when `remaining ≤ 0`).

See `workflows/order-workflow.md` and `workflows/approval-workflow.md` for the full state diagram.

---

## 7. List view — features

### 7.1 Filters
- **Search:** case-insensitive substring on `invoiceNumber` and `customerName`.
- **Status:** `all | draft | unpaid | partial | paid | overdue`.
- Mobile: bottom-sheet filter drawer; "Đặt lại" resets to `all`.

### 7.2 Columns (desktop)
| Column | Meaning | Sortable | Filterable | Searchable | Visible conditions |
|---|---|---|---|---|---|
| Mã hóa đơn | `invoiceNumber` (link to detail) | (recommended) | — | ✅ | always |
| Khách hàng | `customerName` | (recommended) | — | ✅ | always |
| Ngày tạo | `issueDate` | (recommended) | — | — | `lg:` only (hidden on md) |
| Ngày đến hạn | `dueDate` | (recommended) | — | — | always |
| Tổng tiền | `total` | (recommended) | — | — | always |
| Đã thanh toán | `paidAmount` | (recommended) | — | — | `lg:` only |
| Còn lại | `remainingBalance` | (recommended) | — | — | always |
| Trạng thái | `status` badge | — | ✅ | — | always |
| Thao tác | view / edit / quick-pay | — | — | — | quick-pay shown only when `remainingBalance > 0 && status !== 'draft'` |

### 7.3 Empty state
"Không tìm thấy hóa đơn nào".

---

## 8. Create-invoice form

### 8.1 Header fields

| Field | Type | Required | Validation | Default | Editable | Business meaning |
|---|---|---|---|---|---|---|
| customerId | select (search) | Yes | exists in master | — | Yes | Picks the buyer |
| issueDate | date | Yes | — | today | Yes | Document date |
| dueDate | date | Yes | (recommended) ≥ issueDate | today + 30 days | Yes | Credit term |
| notes | textarea | No | ≤ 1000 chars | empty | Yes | Internal/external note |

### 8.2 Line item fields (repeatable)

| Field | Type | Required | Validation | Default | Editable | Business meaning |
|---|---|---|---|---|---|---|
| productId | select | Yes | exists in master | — | Yes | Auto-fills name & unit price |
| productName | text | Yes (auto) | non-empty | (from product) | (auto) | Snapshot at insertion |
| quantity | number | Yes | `> 0` | 1 | Yes | In product's unit |
| unitPrice | number | Yes | `> 0` | (from product) | Yes | VND |
| discount | number | No | `≥ 0`; recommended `≤ qty × unitPrice` | 0 | Yes | Absolute VND line discount |
| lineTotal | number (auto) | — | `qty × unitPrice − discount` | computed | (auto) | Per-line subtotal |

### 8.3 Footer fields

| Field | Type | Required | Validation | Default | Editable | Business meaning |
|---|---|---|---|---|---|---|
| discount | number | No | `≥ 0` | 0 | Yes | Invoice-level discount (VND) |
| tax | number | No | `≥ 0` | 0 | Yes | VAT amount (VND). NB: input is amount, not rate. |
| shipping | number | No | `≥ 0` | 0 | Yes | Shipping fee |
| subtotal | computed | — | `Σ lineTotal` | — | — | — |
| total | computed | — | `subtotal − discount + tax + shipping` | — | — | — |

### 8.4 Validation (`pages/CreateInvoice.tsx` handleSubmit)

| Code | Trigger | Message (toast.error) |
|---|---|---|
| V-CI-01 | `customerId` empty | "Vui lòng chọn khách hàng" |
| V-CI-02 | `items.length === 0` | "Vui lòng thêm ít nhất một sản phẩm" |
| V-CI-03 | Any item with missing `productId` OR `quantity ≤ 0` OR `unitPrice ≤ 0` | "Vui lòng điền đầy đủ thông tin sản phẩm" |
| V-CI-04 | Selected customer not found | "Không tìm thấy thông tin khách hàng" |

### 8.5 Submission paths

| Button | Resulting status | Success toast |
|---|---|---|
| "Lưu nháp" | `draft` | "Lưu nháp hóa đơn thành công!" |
| "Tạo hóa đơn" | `unpaid` | "Tạo hóa đơn thành công!" |

Both navigate to `/invoices/:id`.

### 8.6 Business rules

| ID | Rule | Source |
|---|---|---|
| BR-CI-01 | Default `dueDate` = today + 30 days. (Should be sourced from Settings `defaultDueDays`.) | `CreateInvoice.tsx` line 43 |
| BR-CI-02 | `lineTotal = quantity × unitPrice − discount` (absolute VND discount). | `CreateInvoice.tsx` line 89; `invoiceCalculations.ts` |
| BR-CI-03 | New invoice has `paidAmount = 0`, `remainingBalance = total`, `payments = []`. | `CreateInvoice.tsx` lines 162–167 |
| BR-CI-04 | Invoice number = `'INV' + zeroPad(8)(lastNum+1)` based on **the most recent invoice** (index 0 after `unshift`). **Known defect:** uses `replace('INV', '')` but seed data is `HD-2026-001`, so `parseInt('')` → `NaN`. Reconcile with Settings prefix `HD-`. | `CreateInvoice.tsx` lines 130–137 |
| BR-CI-05 | Customer phone/address/name are snapshot-copied. | `CreateInvoice.tsx` lines 144–146 |
| BR-CI-06 | Both submit buttons are **disabled** when `items.length === 0`. | `CreateInvoice.tsx` lines 203, 210 |

---

## 9. Detail view

### 9.1 Sections
1. Header: number, status badge, **In / Tải PDF** buttons (UI-only, no handler).
2. Mobile-only KPI strip: Tổng HĐ / Đã TT / Còn lại.
3. Invoice information: customer snapshot + issue/due dates + notes.
4. Items breakdown table + subtotal / discount / tax / shipping / total.
5. Payment summary cards: Tổng / Đã thanh toán / Còn lại (orange when remaining).
6. Payment history (or "Chưa có thanh toán nào").
7. "Thêm thanh toán" CTA — **only when** `remainingBalance > 0 && status !== 'draft'`.

### 9.2 Business rules

| ID | Rule |
|---|---|
| BR-ID-01 | Draft invoices CANNOT receive payments (no CTA shown). |
| BR-ID-02 | Fully-paid invoices CANNOT receive payments (no CTA shown). |
| BR-ID-03 | Discount / tax / shipping summary rows are hidden when their value = 0. |
| BR-ID-04 | If `id` does not resolve, the page renders a full-block "Không tìm thấy hóa đơn" with a "Quay lại danh sách" link. |

---

## 10. Add-payment modal (`PaymentModal.tsx`)

### 10.1 Fields

| Field | Type | Required | Validation | Default | Editable | Business meaning |
|---|---|---|---|---|---|---|
| amount | number | Yes | `> 0` AND `≤ maxAmount` (remainingBalance) | empty | Yes | Cash received (VND) |
| paymentDate | date | Yes | — | today | Yes | When cash was received |
| method | enum | Yes | `cash | bank_transfer | check | other` | `cash` | Instrument |
| reference | text | No | — | empty | Yes (only shown if `method='bank_transfer'`) | Bank txn code |
| note | textarea | No | ≤ 500 chars | empty | Yes | Free text |

### 10.2 Validation (`PaymentModal.tsx`)

| Code | Trigger | Message (in-modal red panel) |
|---|---|---|
| V-PAY-01 | `amount` NaN or `≤ 0` | "Số tiền không hợp lệ" |
| V-PAY-02 | `amount > maxAmount` | "Số tiền vượt quá số tiền còn lại (₫…)" |

### 10.3 Business rules

| ID | Rule | Source |
|---|---|---|
| BR-PAY-01 | `newPaidAmount = oldPaidAmount + amount` | `store.ts:addPayment` |
| BR-PAY-02 | `newRemainingBalance = total − newPaidAmount` | same |
| BR-PAY-03 | New status = `calculateStatus(total, newPaidAmount, dueDate)`: `≤0 → paid`; `(paid>0 && rem>0)` → overdue if past-due else partial; else overdue if past-due else unpaid. | `store.ts:calculateStatus` |
| BR-PAY-04 | Payments are **append-only**. No edit/delete UI; recommended audit. | `store.ts:addPayment` |
| BR-PAY-05 | `reference` input is only shown when method = `bank_transfer`, but it is **not enforced as required** — gap to clarify with business. | `PaymentModal.tsx` lines 126–135 |
| BR-PAY-06 | Toast on success: "Thêm thanh toán thành công!" | `InvoiceDetail.tsx` line 55 |

---

## 11. Permission rules
See `roles/roles-and-permissions.md` §4.

---

## 12. Notifications (recommended)
- Email customer when invoice is created (toggle in Settings).
- Email + push reminder N days before due (toggle in Settings).
- Notify all `ACCOUNTANT` when an invoice flips to `overdue`.

---

## 13. Audit logs (recommended)
- `invoice.create`, `invoice.update`, `invoice.finalize` (draft→unpaid), `invoice.cancel`, `invoice.delete` (admin), `invoice.status_recompute`.
- `payment.create` (immutable; ledger).

---

## 14. Error cases & edge cases

| ID | Case | Behavior |
|---|---|---|
| E-INV-01 | Network/server error on submit | (Recommended) toast "Lưu hóa đơn thất bại" and keep form state. |
| E-INV-02 | Duplicate invoice number race | Backend MUST allocate the number transactionally. |
| E-INV-03 | Negative `lineTotal` from over-discount | Not blocked client-side; recommended server-side validation `discount ≤ qty × unitPrice`. |
| E-INV-04 | Decimal quantity for a discrete unit (e.g. 0.5 bao) | Not enforced; product unit could carry an `isInteger` flag. |
| E-INV-05 | `dueDate < issueDate` | Not validated; recommended. |
| E-INV-06 | Customer deleted between picker load and submit | Toast V-CI-04 prevents partial save. |
| E-INV-07 | Payment recorded against a now-paid invoice (race) | Server MUST recompute & reject if `amount > remainingBalance`. |
| E-INV-08 | Add-payment when `status='draft'` via direct API | Backend MUST reject (mirror BR-ID-01). |

---

## 15. Production-readiness gaps

1. Edit / Delete row actions on the list have icons but no handlers.
2. Print / PDF buttons on detail have no handler.
3. Excel export on the list has no handler.
4. Invoice numbering bug noted in BR-CI-04.
5. No "void / cancel" status — recommended for issued invoices that must be reversed.
6. No attachment / file upload on an invoice.
7. No stock decrement on issue (BR-PROD-05).
