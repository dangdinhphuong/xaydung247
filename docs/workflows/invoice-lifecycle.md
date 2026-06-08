# Workflow — Invoice Lifecycle

## Actors
- ADMIN, ACCOUNTANT, SALES

## State machine
Xem `business-rules/status-lifecycle.md` §1.

## Trigger conditions
- User click "Tạo hoá đơn mới" → CreateInvoice page
- User click "Phát hành" trên draft → finalize endpoint
- User add payment trên unpaid/partial
- User click "Huỷ hoá đơn" (ADMIN) → void

## Main flows

### Flow 1: Tạo và finalize 1 hoá đơn
1. SALES login → click "Tạo hoá đơn" → CreateInvoice page mở.
2. Chọn customer từ dropdown (auto-fill info preview).
3. Click "Thêm sản phẩm" lặp lại: chọn product, nhập qty, optionally điều chỉnh price/discount.
4. Nhập invoice-level discount/tax/shipping nếu cần.
5. (SALES) click "Lưu nháp" → POST `/api/invoices` với `status='draft'`. invoiceNumber=null.
6. Redirect `/invoices/:id`. Status badge "Nháp".
7. ACCOUNTANT review draft, click "Phát hành hoá đơn" → POST `/api/invoices/:id/finalize`. Allocate `HD-2026-009`. Status badge "Chưa thanh toán".
8. In hoá đơn → `window.print()` → giao khách.

### Flow 2: Tạo trực tiếp (direct issue)
1. ACCOUNTANT click "Tạo hoá đơn" → form.
2. Điền xong click "Tạo hoá đơn" (không click "Lưu nháp") → POST với `status='unpaid'`. Server allocate number ngay.
3. Redirect detail.

### Flow 3: Khách trả nhiều đợt
1. ACCOUNTANT mở `/invoices/:id` (status unpaid).
2. Click "Thêm thanh toán" → PaymentModal mở.
3. Nhập amount = 15M, method = cash, submit.
4. POST `/api/invoices/:id/payments`.
5. Server: insert payment, recompute paidAmount = 15M, remainingBalance = 30M, status = partial.
6. Response: { payment, invoice }. Modal close. Toast success.
7. Invoice status badge → "Thanh toán một phần".
8. Customer trả tiếp 30M → repeat step 2–6. paidAmount = 45M, status = paid. CTA "Thêm thanh toán" biến mất.

### Flow 4: Hoá đơn quá hạn
1. Invoice issue 2026-04-01, due 2026-05-01, status=unpaid, isOverdue=false.
2. Today = 2026-05-02. ACCOUNTANT mở `/invoices` list.
3. Backend `InvoicesService.findAll()` map từng invoice: `isOverdue = (status ∈ {unpaid, partial}) AND remainingBalance > 0 AND dueDate < today`.
4. Invoice nói trên có `isOverdue = true`.
5. FE StatusBadge hiển thị "Chưa thanh toán · Quá hạn" (red strong).
6. Dashboard `overdueCount` += 1.

### Flow 5: Huỷ hoá đơn (ADMIN)
1. ADMIN mở `/invoices/:id` (status=partial, paid=15M).
2. Click "Huỷ hoá đơn" → VoidConfirmModal.
3. Nhập voidReason "Khách trả lại hàng" → confirm.
4. POST `/api/invoices/:id/void`.
5. Server: set status='void', remainingBalance=0, voidReason. Payment cũ KHÔNG xoá.
6. Status badge "Đã huỷ" (grey strike).
7. Dashboard `totalDebt` giảm 30M (số còn nợ).

## Edge cases

| Case | Behavior |
|---|---|
| Tạo invoice cho customer inactive | Backend reject (customer không trong dropdown vì FE filter `?status=active`) |
| Tạo invoice với product inactive | Tương tự, không xuất hiện picker |
| Sửa items khi status không phải draft | 422 `DOMAIN-LINES-LOCKED` |
| Thêm payment lớn hơn remaining | 400 `V-PAY-02` |
| Thêm payment cho draft | 422 `DOMAIN-DRAFT-PAYMENT` |
| Thêm payment cho void | 422 `DOMAIN-VOID-PAYMENT` |
| Thêm payment cho paid | 422 `DOMAIN-PAID-PAYMENT` |
| 2 user trả payment cùng lúc (race) | Cả 2 insert OK, recompute lần 2 đúng (vì query lại all payments) — không có lock |
| Date trả future > today+1 | 400 `V-PAY-03` |

## Out of scope (v1)
- Refund flow
- Partial refund / credit note
- Recurring invoices
- Approval workflow trước khi finalize
