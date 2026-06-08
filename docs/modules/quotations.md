# Module — Quotations

## Routes
- `/quotations` — list
- `/quotations/new` — create
- `/quotations/:id` — detail + actions
- `/quotations/:id/edit` — edit (chỉ draft)

## Data hooks
- `useQuotations(filters)` → list
- `useQuotation(id)` → detail
- `useCreateQuotation()`, `useUpdateQuotation()`, `useSendQuotation()`, `useAcceptQuotation()`, `useRejectQuotation()`, `useCloneQuotation()`, `useConvertQuotation()`, `useDeleteQuotation()`

---

## QuotationManagement page (`/quotations`)

### UI
- Header: count + "Tạo báo giá" CTA
- Search box (number/customerName)
- Status filter: draft/sent/accepted/rejected/expired
- Desktop table: Mã BG · Khách hàng · Ngày tạo · Hiệu lực đến · Tổng tiền · Trạng thái (combined với isExpired) · Thao tác
- Mobile: card list

### Status badge
Tương tự invoice — combined với isExpired:
| status | isExpired | Label |
|---|---|---|
| draft | — | Nháp (grey) |
| sent | false | Đã gửi (blue) |
| sent | true | Hết hạn (orange) |
| accepted | — | Đã chấp nhận (green) — kèm icon nếu đã convert |
| rejected | — | Đã từ chối (red) |

### Empty state
"Không tìm thấy báo giá nào"

---

## QuotationForm (`/quotations/new`, `/quotations/:id/edit`)

UI tương tự CreateInvoice nhưng:
- `dueDate` → `validUntil`
- Không có submit "Lưu nháp" + "Tạo hoá đơn" — chỉ có "Lưu" (status='draft')
- Sau khi save, redirect `/quotations/:id` để có thể nhấn "Gửi"

---

## QuotationDetail page (`/quotations/:id`)

### UI
- Header: quotationNumber (hoặc "Nháp"), status badge, action buttons
- Items table read-only + breakdown totals
- Customer info
- Action buttons (conditional):
  - "Gửi cho khách" (draft): allocate number, status → sent
  - "Đánh dấu chấp nhận" (sent, !expired)
  - "Đánh dấu từ chối" (sent): modal nhập reason
  - "Sao chép" (mọi status): clone → new draft
  - "Chuyển thành hoá đơn" (accepted, !converted): modal confirm
  - "Sửa" (draft only): redirect edit page
  - "Xoá" (draft only, ADMIN)

### Empty state cho không-tồn-tại
"Không tìm thấy báo giá" + back link

---

## Convert flow

1. User click "Chuyển thành hoá đơn" trên `QuotationDetail`.
2. Modal: "Tạo hoá đơn từ báo giá BG-2026-001?" + thông tin sẽ tạo (issueDate=today, dueDate=today + N).
3. Click "Xác nhận" → POST `/api/quotations/:id/convert`.
4. Success → invalidate queries → redirect `/invoices/:newId`.
5. Toast "Đã tạo hoá đơn từ báo giá".

Disabled button khi pending để giảm race.

---

## Bỏ khỏi v1
- ❌ Public link cho customer self-accept
- ❌ Email gửi báo giá tự động
- ❌ Auto-expire cron (chỉ tính derived ở read-time)
- ❌ PDF báo giá riêng (dùng cùng template invoice nếu cần in báo giá)
