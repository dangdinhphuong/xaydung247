# Common Errors — API Catalog

> **[RECOMMENDED]** Canonical error-code catalog. Every endpoint MUST emit only codes from this list (or document a new one here). Codes are stable; messages are localisable.

---

## Error envelope

See `api-contracts/README.md` for the full RFC 7807 shape. Every error response includes a `code` field whose value MUST appear in the table below.

---

## Validation errors (HTTP 400)

| Code | Vietnamese message | Module | Source |
|---|---|---|---|
| `V-CI-01` | Vui lòng chọn khách hàng | Invoice create | `pages/CreateInvoice.tsx` |
| `V-CI-02` | Vui lòng thêm ít nhất một sản phẩm | Invoice create | same |
| `V-CI-03` | Vui lòng điền đầy đủ thông tin sản phẩm | Invoice create | same |
| `V-CI-04` | Không tìm thấy thông tin khách hàng | Invoice create | same |
| `V-CI-05` | Ngày đến hạn phải sau ngày tạo | Invoice create | recommended |
| `V-CI-06` | Giảm giá vượt quá tạm tính | Invoice create | recommended |
| `V-CI-07` | Giá trị không hợp lệ | Invoice create | recommended |
| `V-CI-08` | Giảm giá vượt quá thành tiền | Invoice line | recommended |
| `V-CI-09` | Ghi chú vượt quá 1000 ký tự | Invoice | recommended |
| `V-CI-10` | Số hoá đơn đã tồn tại | Invoice create | recommended (server-only) |
| `V-PAY-01` | Số tiền không hợp lệ | Payment | `components/PaymentModal.tsx` |
| `V-PAY-02` | Số tiền vượt quá số tiền còn lại | Payment | same |
| `V-PAY-03` | Ngày thanh toán không hợp lệ | Payment | recommended |
| `V-PAY-04` | Không thể thanh toán hóa đơn nháp | Payment | recommended |
| `V-PAY-05` | Hóa đơn đã được thanh toán | Payment | recommended |
| `V-PAY-06` | Vui lòng nhập mã giao dịch | Payment (bank_transfer) | recommended — clarify with business |
| `V-PAY-07` | Số tiền vượt giới hạn | Payment | recommended |
| `V-PAY-08` | Yêu cầu trùng (idempotency replay) | Payment | recommended |
| `V-CUST-01` | Tên khách hàng là bắt buộc | Customer | recommended |
| `V-CUST-02` | Số điện thoại không hợp lệ | Customer | recommended |
| `V-CUST-03` | Email không hợp lệ | Customer | recommended |
| `V-CUST-04` | Mã số thuế không hợp lệ | Customer | recommended |
| `V-CUST-05` | Khách hàng đã tồn tại | Customer | recommended |
| `V-CUST-06` | Địa chỉ vượt quá 300 ký tự | Customer | recommended |
| `V-PROD-01` | Tên sản phẩm là bắt buộc | Product | recommended |
| `V-PROD-02` | Đơn giá không hợp lệ | Product | recommended |
| `V-PROD-03` | Tồn kho không hợp lệ | Product | recommended |
| `V-PROD-04` | Danh mục là bắt buộc | Product | recommended |
| `V-PROD-05` | Đơn vị là bắt buộc | Product | recommended |
| `V-Q-01` | Vui lòng chọn khách hàng | Quotation | recommended |
| `V-Q-02` | Ngày hết hiệu lực phải lớn hơn ngày tạo | Quotation | recommended |
| `V-Q-03` | Vui lòng thêm ít nhất một sản phẩm | Quotation | recommended |
| `V-Q-04` | Vui lòng điền đầy đủ thông tin sản phẩm | Quotation | recommended |
| `V-Q-05` | Chỉ báo giá đã chấp nhận mới được chuyển thành hóa đơn | Quotation convert | recommended |
| `V-Q-06` | Báo giá đã được chuyển thành hóa đơn | Quotation convert | recommended |
| `V-SET-01` | Tên công ty là bắt buộc | Settings | recommended |
| `V-SET-02` | Email không hợp lệ | Settings | recommended |
| `V-SET-03` | Số tiếp theo phải lớn hơn số đã dùng | Settings | recommended |
| `V-SET-04` | Số ngày đến hạn không hợp lệ | Settings | recommended |
| `V-SET-05` | Thuế suất phải nằm trong khoảng 0–100 | Settings | recommended |
| `V-SET-06` | Tiền tố không hợp lệ | Settings | recommended |
| `V-TPL-01` | Vui lòng nhập tên mẫu | Template | recommended |
| `V-TPL-02` | Vui lòng nhập HTML | Template (custom HTML) | recommended |
| `V-TPL-03` | Lề không hợp lệ | Template | recommended |
| `V-TPL-04` | Mã màu không hợp lệ | Template | recommended |
| `V-TPL-05` | Mẫu phải có ít nhất một khối | Template | recommended |
| `V-AUTH-01` | Vui lòng nhập email và mật khẩu | Auth | recommended |
| `V-AUTH-02` | Email không hợp lệ | Auth | recommended |
| `V-AUTH-03` | Email hoặc mật khẩu không đúng | Auth | recommended |
| `V-USR-01` | Email đã được sử dụng | Users | recommended |
| `V-USR-02` | Số điện thoại không hợp lệ | Users | recommended |
| `V-USR-03` | Không thể vô hiệu hoá quản trị viên cuối cùng | Users | recommended |
| `V-USR-04` | Mật khẩu hiện tại không đúng | Users | recommended |
| `V-USR-05` | Mật khẩu phải ≥ 8 ký tự, gồm chữ và số | Users | recommended |
| `V-DISC-01` | Giảm giá vượt quá thành tiền | Discount | recommended |
| `V-DISC-02` | Giảm giá vượt quá tạm tính | Discount | recommended |
| `V-DISC-03` | Giảm giá không hợp lệ | Discount | recommended |

## Authentication / Authorization errors (HTTP 401 / 403)

| Code | Status | Message | Notes |
|---|---|---|---|
| `AUTH-01` | 401 | Email hoặc mật khẩu không đúng | Same message regardless of which is wrong |
| `AUTH-02` | 423 | Tài khoản tạm khoá. Vui lòng thử lại sau 30 phút. | After 5 fails in 15 min |
| `AUTH-03` | 403 | Tài khoản đã bị vô hiệu hoá. Liên hệ quản trị viên. | Inactive user |
| `AUTH-04` | 400 | Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. | Reset token invalid |
| `AUTH-05` | 401 | TOKEN_EXPIRED | Client should refresh |
| `AUTH-06` | 401 | UNAUTHENTICATED | No session |
| `AUTHZ-01` | 403 | FORBIDDEN | Missing permission |
| `AUTHZ-02` | 404 | NOT_FOUND | Cross-tenant ID attempt; do not leak existence |

## Concurrency / conflict errors (HTTP 409)

| Code | Message | Notes |
|---|---|---|
| `CONFLICT-VERSION` | Bản ghi đã được cập nhật bởi người khác | If-Match mismatch |
| `CONFLICT-UNIQUE` | Giá trị đã tồn tại | DB unique constraint |
| `CONFLICT-DELETE` | Không thể xoá: dữ liệu đang được tham chiếu | Hard-delete blocked by FK |

## Domain-rule errors (HTTP 422)

| Code | Message | Triggered by |
|---|---|---|
| `DOMAIN-DRAFT-PAYMENT` | Không thể thanh toán hóa đơn nháp | Mirror V-PAY-04 server-side |
| `DOMAIN-PAID-PAYMENT` | Hóa đơn đã được thanh toán | Mirror V-PAY-05 |
| `DOMAIN-QUOTE-LOCKED` | Báo giá không thể chỉnh sửa ở trạng thái này | Status ≠ draft |
| `DOMAIN-LAST-ADMIN` | Không thể vô hiệu hoá quản trị viên cuối cùng | BR-USR-03 |
| `DOMAIN-DEFAULT-TEMPLATE` | Không thể xoá mẫu mặc định | BR-TPL-05 |

## Rate-limiting / quota errors (HTTP 429)

| Code | Message |
|---|---|
| `RATE-LIMIT` | Quá nhiều yêu cầu, vui lòng thử lại sau |
| `EXPORT-QUOTA` | Đã đạt giới hạn xuất báo cáo |

## Server / infrastructure (HTTP 5xx)

| Code | Status | Message |
|---|---|---|
| `INTERNAL` | 500 | Đã có lỗi xảy ra, vui lòng thử lại |
| `UPSTREAM-PDF` | 502 | Không thể tạo PDF, vui lòng thử lại |
| `UPSTREAM-MAIL` | 502 | Không thể gửi email |
| `MAINTENANCE` | 503 | Hệ thống đang bảo trì |

---

## Cross-references

- Full validation rule list (with intended triggers): `qa/validation-rules.md`.
- Domain rule definitions: `domain-reconciliation/canonical-business-rules.md`.
- Security context for `AUTH-*`: `architecture/missing-authentication.md` + `gap-analysis/security-risks.md`.
