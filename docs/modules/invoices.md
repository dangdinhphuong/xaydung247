# Module — Invoices

## Mục đích
Quản lý hoá đơn bán hàng: tạo, list, xem chi tiết, thêm thanh toán, huỷ.

## Routes
- `/invoices` — list
- `/invoices/create` — tạo mới
- `/invoices/:id` — chi tiết + thêm payment

## Actors & permissions
Xem `architecture/auth-and-rbac.md` §2.2.

## Data hooks
- `useInvoices(filters)` → `GET /api/invoices`
- `useInvoice(id)` → `GET /api/invoices/:id`
- `useCreateInvoice()` → `POST /api/invoices`
- `useUpdateInvoice(id)` → `PATCH /api/invoices/:id`
- `useFinalizeInvoice(id)` → `POST /api/invoices/:id/finalize`
- `useVoidInvoice(id)` → `POST /api/invoices/:id/void`
- `useAddPayment(invoiceId)` → `POST /api/invoices/:invoiceId/payments`

---

## InvoiceList page

### UI
- Header: title + count + "Tạo hoá đơn mới" CTA (ADMIN/ACCOUNTANT/SALES)
- Search box (free text)
- Status filter dropdown: tất cả / draft / unpaid / partial / paid / overdue / void
  - "overdue" filter: gọi API với `?isOverdue=true`
- Desktop: table — Mã HĐ · Khách hàng · Ngày tạo · Ngày đến hạn · Tổng tiền · Đã TT · Còn lại · Trạng thái · Thao tác
- Mobile: card list
- Row actions: View · Edit (nếu draft) · Quick-Pay (nếu open + có quyền) · "Xuất Excel" button trên header (FE-only)

### Filters
- Search: `?search=`
- Status: `?status=draft,unpaid` (multi-select)
- Khách hàng: `?customerId=`
- Date range: `?from=&to=`
- Overdue: `?isOverdue=true`

### Empty state
"Không tìm thấy hoá đơn nào"

---

## CreateInvoice page

### UI sections
1. **Thông tin chung** — Customer picker (Select + search), issueDate, dueDate, notes textarea
2. **Chi tiết sản phẩm** — Table repeatable: Sản phẩm picker | SL | Đơn giá | Giảm giá | Thành tiền | Xoá
3. **Tổng kết** — sidebar phải: Tạm tính · Giảm giá (input) · Thuế VAT (input + checkbox "Auto") · Phí vận chuyển (input) · TỔNG CỘNG
4. **Action bar** — "Lưu nháp" + "Tạo hoá đơn"

### Default values
- `issueDate = today`
- `dueDate = today + settings.defaultDueDays` (fetch settings ở mount)
- `tax`: nếu `settings.autoTax` → checkbox "Auto" check, value computed live; user uncheck để override

### Computed (live, FE-side)
- `lineTotal = quantity × unitPrice − discount`
- `subtotal = Σ lineTotal`
- `tax = autoTax ? round((subtotal − discount) × defaultTaxRate / 100) : userInput`
- `total = subtotal − discount + tax + shipping`

### Auto-fill on product select
- `productName`, `unit`, `unitPrice` từ product.

### Submit
- "Lưu nháp" → `status='draft'`, redirect `/invoices/:id`
- "Tạo hoá đơn" → `status='unpaid'` (allocate number), redirect `/invoices/:id`

### Validation (Zod + react-hook-form)
- Xem `api/invoices.md` validation table.

### Form library
react-hook-form + zodResolver. Errors hiển thị inline dưới input.

---

## InvoiceDetail page

### UI sections

1. **Header**: invoiceNumber (hoặc "Nháp"), status badge (combined với isOverdue), "In" button, "Tải PDF" button, back arrow
2. **Mobile KPI strip** (mobile only): Tổng HĐ | Đã TT | Còn lại
3. **Thông tin hoá đơn**: customer info + dates + notes
4. **Chi tiết mặt hàng**: table items (read-only) + breakdown subtotal/discount/tax/shipping/total
5. **Tổng kết thanh toán** (desktop sidebar): 3 cards Tổng / Đã TT / Còn lại + "Thêm thanh toán" CTA (conditional)
6. **Lịch sử thanh toán**: table payments (read-only)

### Conditional rendering
- "Thêm thanh toán" CTA visible khi: `status NOT IN {draft, void, paid}` AND user can('Payment:create').
- "Huỷ hoá đơn" button (ADMIN): visible nếu `status != paid && status != void`.
- "Xoá" button (ADMIN): visible nếu `status === draft || status === void`.
- "Finalize" button: visible nếu `status === draft`, hiển thị "Phát hành hoá đơn".
- "Edit items": chỉ enabled khi draft.

### Modals
- `PaymentModal` — xem section bên dưới.
- `VoidConfirmModal` — input voidReason + nút Xác nhận.
- `DeleteConfirmModal` — "Xoá vĩnh viễn?" + nút Xác nhận.

### Actions
- In → `window.print()`
- Tải PDF → cùng `window.print()` (user chọn "Save as PDF" trong dialog)
- Edit (draft) → enable form mode hoặc redirect `/invoices/:id/edit`

---

## PaymentModal

### Form fields
| Field | Type | Required | Default |
|---|---|---|---|
| amount | number | ✓ | (empty) |
| paymentDate | date | ✓ | today |
| method | select | ✓ | 'cash' |
| reference | text | conditional | (empty) |
| note | textarea | — | (empty) |

### Conditional UI
- `reference` field visible & required khi `method ∈ {bank_transfer, check}`.
- Hint "Số tiền còn lại: {remainingBalance}" dưới input amount.

### Validation
- `amount > 0` (V-PAY-01)
- `amount <= remainingBalance` (V-PAY-02)
- `paymentDate <= today + 1 day` (V-PAY-03)
- `reference required` if bank_transfer/check (V-PAY-06)

### Submit
- Submit disabled khi đang pending (chống double-click).
- Success: invalidate `['invoice', id]`, `['invoices']`, `['dashboard']`. Toast "Thêm thanh toán thành công!". Close modal.

---

## Excel export (FE-only)

Button "Xuất Excel" trên InvoiceList header. Click → SheetJS generate file từ filtered invoices đang hiển thị (không re-fetch).

Format file: `hoa-don-2026-05-18.xlsx`. Columns: Mã HĐ · Khách hàng · Ngày tạo · Ngày đến hạn · Tổng tiền · Đã TT · Còn lại · Trạng thái.

---

## Print stylesheet

`@media print`:
- Ẩn sidebar, header, mobile nav, action bar.
- Show `<PrintableInvoice />` component (mặc định `display: none`).
- `PrintableInvoice` render từ `settings.invoiceTemplateHtml` + replace `{{placeholders}}`.
- Trang A4 portrait, margin 20mm.

---

## Pages bỏ khỏi v1
- ❌ `/invoices/:id/edit` riêng — dùng inline edit ở `/invoices/:id` khi draft hoặc redirect về `/invoices/:id` (TBD)
