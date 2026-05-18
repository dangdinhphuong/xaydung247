# Canonical Business Rules — MVP v1

> **SINGLE SOURCE OF TRUTH cho mọi business logic.** Quy tắc đánh số `CR-*`. Khi tài liệu khác mâu thuẫn với file này, file này thắng.

**Phiên bản:** MVP v1 simple-first
**Locale:** vi-VN, VND, Asia/Ho_Chi_Minh
**Single-tenant on-prem** (không có tenantId trong schema)

---

## 1. Định danh & thời gian

| ID | Quy tắc |
|---|---|
| **CR-T-01** | Mọi `_id` là ObjectId do Mongo sinh server-side. KHÔNG dùng `Date.now()` ở FE để tạo ID. |
| **CR-T-02** | Mọi ngày nghiệp vụ (`issueDate`, `dueDate`, `paymentDate`, `validUntil`) lưu dạng `Date` ở Mongo. Diễn giải theo `Asia/Ho_Chi_Minh`. |
| **CR-T-03** | Mọi timestamp (`createdAt`, `updatedAt`) tự động bởi Mongoose `{ timestamps: true }`. |
| **CR-T-04** | "Hôm nay" để so sánh nghiệp vụ = `new Date()` ở server (server chạy múi giờ Asia/Ho_Chi_Minh hoặc convert). FE không tự tính "hôm nay" cho overdue. |

---

## 2. Đánh số hoá đơn

| ID | Quy tắc |
|---|---|
| **CR-NUM-01** | Format: `{prefix}{YYYY}-{NNN}` ví dụ `HD-2026-009`. `prefix` lấy từ Settings (default `HD-`). |
| **CR-NUM-02** | Sequence per-year, reset đầu năm. Collection `counters` lưu `{ _id: "invoice-2026", seq: 9 }`. |
| **CR-NUM-03** | Cấp số atomic bằng `findOneAndUpdate({ _id }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: 'after' })`. Mongo single-document op là atomic. |
| **CR-NUM-04** | Cấp số khi **finalize** (chuyển từ draft → unpaid). Draft có `invoiceNumber: null`. |
| **CR-NUM-05** | Số đã cấp không tái sử dụng. Void/delete vẫn giữ số. Cho phép gap. |
| **CR-NUM-06** | FE hiển thị "Chưa cấp số" khi `invoiceNumber == null`. |
| **CR-NUM-07** | Đổi prefix trong Settings không renumber hoá đơn cũ. |
| **CR-NUM-08** | Quotation cùng cơ chế: format `BG-{YYYY}-{NNN}`, cấp số khi action "Send". |

---

## 3. Khách hàng

| ID | Quy tắc |
|---|---|
| **CR-C-01** | `taxCode` optional. Nếu invoice có `tax > 0` mà customer không có taxCode → server warning (không reject ở MVP). |
| **CR-C-02** | `status: 'active' | 'inactive'`. Inactive không xuất hiện trong picker khi tạo hoá đơn/báo giá mới. |
| **CR-C-03** | `currentDebt` **derived**, không lưu trên customer. Tính qua endpoint `GET /customers/:id/debt` hoặc FE tính từ `GET /invoices?customerId=...`. |
| **CR-C-04** | Không hard-delete khách hàng nếu đã có invoice. Soft-delete bằng `status='inactive'`. |
| **CR-C-05** | Khi tạo invoice/quotation, snapshot `customerName`, `customerPhone`, `customerAddress`, `customerTaxCode` vào document. Sửa customer không thay đổi document cũ. |

---

## 4. Sản phẩm

| ID | Quy tắc |
|---|---|
| **CR-P-01** | `price ≥ 0`, `stock ≥ 0`. Validate ở DTO. |
| **CR-P-02** | `stock` chỉ để hiển thị. **KHÔNG decrement khi xuất hoá đơn** trong MVP. |
| **CR-P-03** | Khi thêm product vào invoice line, snapshot `productName`, `unit`, `unitPrice`. |
| **CR-P-04** | Không hard-delete nếu đã có invoice line tham chiếu. Soft-delete bằng `status='inactive'`. |
| **CR-P-05** | Low-stock cue `< 100` chỉ là UI hint, không phải business rule. |

---

## 5. Hoá đơn — dòng sản phẩm

| ID | Quy tắc |
|---|---|
| **CR-L-01** | Mỗi line có: `productId` (optional cho ad-hoc), `productName`, `quantity > 0`, `unitPrice ≥ 0`, `discount ≥ 0`. |
| **CR-L-02** | `discount` là **số tiền tuyệt đối VND**, không phải %. |
| **CR-L-03** | `lineTotal = quantity × unitPrice − discount`. Xem `financial-formulas.md` F-1. |
| **CR-L-04** | `lineTotal ≥ 0` → `discount ≤ quantity × unitPrice`. Validate trong DTO + service. |
| **CR-L-05** | `quantity` decimal (kg, m³, lít có thể lẻ). |
| **CR-L-06** | Chỉnh sửa line chỉ cho phép khi `status='draft'`. |

---

## 6. Hoá đơn — tổng cộng

| ID | Quy tắc |
|---|---|
| **CR-INV-01** | `subtotal = Σ lineTotal`. Server tính lại, không trust FE. |
| **CR-INV-02** | `invoice.discount ≥ 0` và `≤ subtotal`. |
| **CR-INV-03** | `invoice.shipping ≥ 0`. |
| **CR-INV-04** | `invoice.tax ≥ 0`. |
| **CR-INV-05** | `total = subtotal − discount + tax + shipping`. Server tính. |
| **CR-INV-06** | `paidAmount = Σ payments.amount` (không có reversal trong MVP — payment là final). |
| **CR-INV-07** | `0 ≤ paidAmount ≤ total`. |
| **CR-INV-08** | `remainingBalance = total − paidAmount`. |
| **CR-INV-09** | Money lưu dạng number trong Mongo (đơn vị: VND nguyên — không có decimal). |

---

## 7. Tính thuế

| ID | Quy tắc |
|---|---|
| **CR-TAX-01** | `taxBase = subtotal − invoiceDiscount`. |
| **CR-TAX-02** | Khi tạo invoice, nếu request không gửi `tax` → server tính `tax = round(taxBase × tenantSettings.defaultTaxRate / 100)`. |
| **CR-TAX-03** | Nếu request gửi `tax` rõ ràng → server dùng giá trị đó (cho phép override). |
| **CR-TAX-04** | `tax` là 1 số tuyệt đối ở mức invoice. Không có per-line tax. |
| **CR-TAX-05** | Sửa `tax` chỉ khi `status='draft'`. |
| **CR-TAX-06** | Rounding: làm tròn về VND nguyên (không decimal). |

---

## 8. Thanh toán

| ID | Quy tắc |
|---|---|
| **CR-PAY-01** | Mỗi payment có `amount > 0`, `paymentDate`, `method ∈ {cash, bank_transfer, check, other}`, `reference?`, `note?`. |
| **CR-PAY-02** | Payment **append-only**, không edit/delete trong MVP. Sai sót → tạo invoice mới hoặc xoá invoice cũ (admin). |
| **CR-PAY-03** | `_id` do Mongo sinh server-side. FE KHÔNG sinh ID. |
| **CR-PAY-04** | `reference` required khi `method='bank_transfer'` hoặc `'check'`. |
| **CR-PAY-05** | Không cho add payment khi: `status='draft'` (422), `status='void'` (422), `remainingBalance === 0` (422). |
| **CR-PAY-06** | `amount ≤ remainingBalance`. Không cho overpay. |
| **CR-PAY-07** | `paymentDate ≤ today + 1`. Không cho future-date quá 1 ngày. |
| **CR-PAY-08** | Sau khi insert payment, service recompute: `paidAmount`, `remainingBalance`, `status`. Save lại invoice. Không có transaction (race hiếm, FE disable button khi pending). |
| **CR-PAY-09** | Không có Idempotency-Key trong MVP. FE disable nút "Xác nhận" sau click đầu để giảm race. |

---

## 9. Status lifecycle hoá đơn

Xem `business-rules/status-lifecycle.md` cho state machine đầy đủ.

| ID | Quy tắc |
|---|---|
| **CR-S-01** | `status ∈ {draft, unpaid, partial, paid, void}`. **Không có `overdue` như status value.** |
| **CR-S-02** | `isOverdue` là **derived boolean**, tính tại read-time. Công thức: `status ∈ {unpaid, partial} AND remainingBalance > 0 AND dueDate < today`. |
| **CR-S-03** | Hàm `calculateStatus(total, paidAmount, isDraft, isVoid)`: void→void; draft→draft; paid=0→unpaid; paid<total→partial; paid≥total→paid. Xem `financial-formulas.md` F-9. |
| **CR-S-04** | Transition cho phép: (none)→draft, (none)→unpaid, draft→unpaid (finalize), unpaid→partial, unpaid→paid, partial→paid, *→void (ADMIN). |
| **CR-S-05** | `paid` là terminal. Không có refund trong MVP. |
| **CR-S-06** | StatusBadge FE hiển thị combined label: ví dụ `partial` + `isOverdue` → "Thanh toán một phần · Quá hạn". |

---

## 10. Overdue

| ID | Quy tắc |
|---|---|
| **CR-OVR-01** | `isOverdue` tính tại read-time, không lưu trong DB. |
| **CR-OVR-02** | Công thức: `(status ∈ {unpaid, partial}) AND (remainingBalance > 0) AND (dueDate < today)`. Strict `<`: due hôm nay KHÔNG overdue. |
| **CR-OVR-03** | Backend service `InvoicesService.findAll()` map từng invoice thêm field `isOverdue` trước khi return. FE đọc trực tiếp. |
| **CR-OVR-04** | Draft không bao giờ overdue. Void không bao giờ overdue. Paid không bao giờ overdue. |
| **CR-OVR-05** | **Không có cron** để batch update. Mọi nơi cần check overdue đều tính lại. |

---

## 11. Công nợ (debt)

| ID | Quy tắc |
|---|---|
| **CR-DEBT-01** | Invoice "open" = `status ∈ {unpaid, partial} AND remainingBalance > 0 AND !deleted`. Drafts và voids loại trừ. |
| **CR-DEBT-02** | `currentDebt(customer) = Σ remainingBalance over open invoices`. |
| **CR-DEBT-03** | **Tính FE-side** từ `GET /invoices?status=unpaid,partial&customerId=...`. Hoặc backend cung cấp endpoint helper `GET /customers/:id/debt`. |
| **CR-DEBT-04** | Aging buckets: 4 bucket `0-30 / 31-60 / 61-90 / 90+` ngày kể từ `dueDate`. Xem `financial-formulas.md` F-7. |
| **CR-DEBT-05** | **Tính FE-side** từ list open invoices của customer. Hoặc backend cung cấp endpoint `GET /customers/:id/aging`. |
| **CR-DEBT-06** | Không có view DB cho aging (MongoDB không có view kiểu Postgres). Logic ở FE hoặc trong service. |

---

## 12. Báo giá (Quotation)

| ID | Quy tắc |
|---|---|
| **CR-Q-01** | Quotation có cùng line model và totals breakdown như invoice: `items[]`, `subtotal`, `discount`, `tax`, `shipping`, `total`. |
| **CR-Q-02** | `status ∈ {draft, sent, accepted, rejected, expired}`. |
| **CR-Q-03** | Number format `BG-{YYYY}-{NNN}`, cấp khi action "send". |
| **CR-Q-04** | `validUntil ≥ issueDate`. |
| **CR-Q-05** | Transition: (none)→draft, draft→sent, sent→accepted, sent→rejected. Expired tính derived (xem CR-Q-06). |
| **CR-Q-06** | `isExpired = (status='sent' AND validUntil < today)`. Tính tại read-time, không cron. |
| **CR-Q-07** | Sửa quotation chỉ khi `status='draft'`. |
| **CR-Q-08** | Clone: tạo quotation mới với `status='draft'`, copy items + customer. |

---

## 13. Convert báo giá → hoá đơn

| ID | Quy tắc |
|---|---|
| **CR-CONV-01** | Điều kiện: `status='accepted' AND convertedInvoiceId IS NULL`. |
| **CR-CONV-02** | Không có Idempotency-Key. FE disable nút sau click. |
| **CR-CONV-03** | Không transaction. Service làm theo thứ tự: (1) tạo invoice mới `status='unpaid'`, cấp số, snapshot customer; (2) update quotation `convertedInvoiceId = invoice._id`. Nếu (2) fail → có invoice mới mồ côi (rare; admin manual cleanup). |
| **CR-CONV-04** | Snapshot customer lấy từ customer record HIỆN TẠI (không phải snapshot trong quotation). |
| **CR-CONV-05** | Default: `issueDate=today`, `dueDate=today + tenantSettings.defaultDueDays`. |
| **CR-CONV-06** | Notes invoice = `"Từ báo giá {quotationNumber}\n" + quotation.notes`. |
| **CR-CONV-07** | Sau convert, quotation lock (PATCH 422). Status vẫn `accepted`, có thêm `convertedInvoiceId`. |

---

## 14. Cài đặt (Settings)

| ID | Quy tắc |
|---|---|
| **CR-SET-01** | 1 document duy nhất trong collection `settings` (single-tenant). Khởi tạo khi seed. |
| **CR-SET-02** | Fields: `companyName`, `companyTaxCode`, `companyAddress`, `companyPhone`, `companyEmail`, `invoicePrefix`, `defaultDueDays`, `defaultTaxRate`, `autoTax`, `invoiceTemplateHtml`. |
| **CR-SET-03** | `defaultDueDays` consumed bởi CreateInvoice (default `dueDate = issueDate + N`). |
| **CR-SET-04** | `defaultTaxRate` + `autoTax` consumed bởi tax calculation. |
| **CR-SET-05** | `invoiceTemplateHtml` là 1 HTML string với placeholders `{{Ma_Hoa_Don}}`, `{{Khach_Hang}}`, etc. FE render khi in. **Không sanitize trong MVP** (single-tenant nội bộ, ADMIN tin được). |
| **CR-SET-06** | Chỉ ADMIN sửa settings. |

---

## 15. Soft delete

| ID | Quy tắc |
|---|---|
| **CR-DEL-01** | Mọi collection chính (`customers`, `products`, `invoices`, `quotations`) có field `deletedAt: Date | null`. Query default filter `{ deletedAt: null }`. |
| **CR-DEL-02** | `payments` không có deletedAt (append-only). |
| **CR-DEL-03** | Hard-delete chỉ ADMIN, qua endpoint riêng `/admin/hard-delete/:id` (out of scope MVP nếu chưa cần). |
| **CR-DEL-04** | Invoice void: set `status='void'`, `remainingBalance=0`. KHÔNG xoá payments cũ. Số hoá đơn giữ nguyên. |

---

## 16. Authentication & RBAC

| ID | Quy tắc |
|---|---|
| **CR-AUTH-01** | Session cookie HttpOnly + Secure + SameSite=Lax. Session store: MongoDB qua `connect-mongo`. |
| **CR-AUTH-02** | CSRF token cho mọi mutating request (POST/PATCH/DELETE). |
| **CR-AUTH-03** | Password bcrypt cost ≥ 10. |
| **CR-AUTH-04** | 4 role: ADMIN, ACCOUNTANT, SALES, VIEWER. Xem `architecture/auth-and-rbac.md` cho permission matrix. |
| **CR-AUTH-05** | Mỗi user có đúng 1 role. |
| **CR-AUTH-06** | Không có lockout / rate-limit trong MVP. Single-tenant nội bộ, ít attack surface. |
| **CR-AUTH-07** | Không có forgot-password flow tự động. Admin reset password thủ công qua UI. |

---

## 17. Cross-rule invariants (test trong Jest)

| ID | Invariant |
|---|---|
| **INV-1** | `subtotal = Σ items.lineTotal` |
| **INV-2** | `lineTotal = quantity × unitPrice − discount`, `lineTotal ≥ 0` |
| **INV-3** | `total = subtotal − discount + tax + shipping` |
| **INV-4** | `paidAmount = Σ payments.amount` |
| **INV-5** | `0 ≤ paidAmount ≤ total` |
| **INV-6** | `remainingBalance = total − paidAmount` |
| **INV-7** | `status` consistent với `calculateStatus(total, paidAmount, isDraft, isVoid)` |
| **INV-8** | `quotation.validUntil ≥ quotation.issueDate` |
| **INV-9** | `quotation.convertedInvoiceId` set → status='accepted' |
| **INV-10** | Draft invoice có `invoiceNumber=null`; non-draft có invoiceNumber khác null |

---

## 18. Các thứ KHÔNG có trong MVP (cố ý)

- ❌ Multi-tenant / tenantId
- ❌ Audit log
- ❌ Notifications / email / reminders
- ❌ Idempotency-Key + dedupe
- ❌ Optimistic concurrency (If-Match)
- ❌ Row-level lock
- ❌ Transactions
- ❌ Cron jobs (overdue scan, quotation expire)
- ❌ Background queue
- ❌ Report engine (chỉ có Dashboard 4 KPI)
- ❌ Server-side PDF / Excel
- ❌ File attachments
- ❌ Stock tracking / inventory movements
- ❌ Coupon engine (discount chỉ là số tiền tuyệt đối)
- ❌ Multi-currency (chỉ VND)
- ❌ Refund flow (paid là terminal)
- ❌ Public link cho customer
- ❌ Bulk import Excel
- ❌ MFA / OIDC SSO
- ❌ Password reset tự động (admin reset thủ công)

Khi có yêu cầu thực tế, mở ADR và re-design. Không build trước.
