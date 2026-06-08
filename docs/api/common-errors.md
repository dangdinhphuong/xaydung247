# API — Common Errors Catalog

Mọi error response từ backend dùng shape sau:

```json
{
  "statusCode": 422,
  "message": "Không thể thanh toán hoá đơn nháp",
  "code": "DOMAIN-DRAFT-PAYMENT",
  "timestamp": "2026-05-18T10:00:00.000Z"
}
```

FE dùng `code` để map sang message tiếng Việt phù hợp. Fallback `message` nếu chưa có map.

---

## Authentication / Authorization (401, 403)

| Code | Status | Message |
|---|---|---|
| `AUTH-NEEDED` | 401 | Vui lòng đăng nhập |
| `AUTH-INVALID` | 401 | Email hoặc mật khẩu không đúng |
| `AUTH-INACTIVE` | 403 | Tài khoản đã bị vô hiệu hoá |
| `AUTH-FORBIDDEN` | 403 | Bạn không có quyền thực hiện hành động này |
| `AUTH-WRONG-PASSWORD` | 400 | Mật khẩu hiện tại không đúng |
| `EBADCSRFTOKEN` | 403 | CSRF token không hợp lệ — FE re-fetch /api/auth/csrf rồi retry |

---

## Validation (400)

### Auth / Users
| Code | Message |
|---|---|
| `V-AUTH-01` | Vui lòng nhập email và mật khẩu |
| `V-AUTH-02` | Email không hợp lệ |
| `V-USR-01` | Email đã được sử dụng |
| `V-USR-02` | Số điện thoại không hợp lệ |
| `V-USR-05` | Mật khẩu phải ≥ 8 ký tự, gồm chữ và số |

### Customers
| Code | Message |
|---|---|
| `V-CUST-01` | Tên khách hàng là bắt buộc |
| `V-CUST-02` | Số điện thoại không hợp lệ |
| `V-CUST-03` | Email không hợp lệ |
| `V-CUST-04` | Mã số thuế không hợp lệ |
| `V-CUST-06` | Địa chỉ vượt quá 300 ký tự |

### Products
| Code | Message |
|---|---|
| `V-PROD-01` | Tên sản phẩm là bắt buộc |
| `V-PROD-02` | Đơn giá không hợp lệ |
| `V-PROD-03` | Tồn kho không hợp lệ |
| `V-PROD-04` | Danh mục là bắt buộc |
| `V-PROD-05` | Đơn vị là bắt buộc |

### Invoices
| Code | Message |
|---|---|
| `V-CI-01` | Vui lòng chọn khách hàng |
| `V-CI-02` | Vui lòng thêm ít nhất một sản phẩm |
| `V-CI-03` | Vui lòng điền đầy đủ thông tin sản phẩm |
| `V-CI-04` | Không tìm thấy thông tin khách hàng |
| `V-CI-05` | Ngày đến hạn phải sau ngày tạo |
| `V-CI-06` | Giảm giá vượt quá tạm tính |
| `V-CI-07` | Giá trị không hợp lệ |
| `V-CI-08` | Giảm giá dòng vượt quá thành tiền |
| `V-CI-09` | Ghi chú vượt quá 1000 ký tự |

### Payments
| Code | Message |
|---|---|
| `V-PAY-01` | Số tiền không hợp lệ |
| `V-PAY-02` | Số tiền vượt quá số tiền còn lại |
| `V-PAY-03` | Ngày thanh toán không hợp lệ |
| `V-PAY-06` | Vui lòng nhập mã giao dịch cho chuyển khoản/séc |

### Quotations
| Code | Message |
|---|---|
| `V-Q-02` | Ngày hết hiệu lực phải lớn hơn hoặc bằng ngày tạo |

### Settings
| Code | Message |
|---|---|
| `V-SET-01` | Tên công ty là bắt buộc |
| `V-SET-02` | Email không hợp lệ |
| `V-SET-04` | Số ngày đến hạn không hợp lệ (0-365) |
| `V-SET-05` | Thuế suất phải nằm trong khoảng 0-100 |
| `V-SET-06` | Tiền tố không hợp lệ |

---

## Domain (422)

| Code | Message |
|---|---|
| `DOMAIN-LAST-ADMIN` | Không thể vô hiệu hoá quản trị viên cuối cùng |
| `DOMAIN-CUSTOMER-IN-USE` | Khách hàng đang có hoá đơn, không thể xoá |
| `DOMAIN-PRODUCT-IN-USE` | Sản phẩm đang được sử dụng trong hoá đơn, không thể xoá |
| `DOMAIN-DRAFT-PAYMENT` | Không thể thanh toán hoá đơn nháp |
| `DOMAIN-VOID-PAYMENT` | Không thể thanh toán hoá đơn đã huỷ |
| `DOMAIN-PAID-PAYMENT` | Hoá đơn đã được thanh toán đủ |
| `DOMAIN-PAID-EXCEEDS-TOTAL` | Tổng thanh toán vượt quá tổng hoá đơn (race condition — vui lòng tải lại) |
| `DOMAIN-LINES-LOCKED` | Không thể sửa sản phẩm khi hoá đơn đã phát hành |
| `DOMAIN-INVALID-STATE` | Hành động không hợp lệ ở trạng thái hiện tại |
| `DOMAIN-QUOTE-LOCKED` | Báo giá đã được gửi, không thể sửa |
| `DOMAIN-QUOTE-EXPIRED` | Báo giá đã hết hạn, vui lòng tạo báo giá mới |
| `DOMAIN-ALREADY-CONVERTED` | Báo giá đã được chuyển thành hoá đơn |
| `DOMAIN-CUSTOMER-DELETED` | Khách hàng đã bị xoá, không thể tạo hoá đơn từ báo giá |
| `DOMAIN-CUSTOMER-INACTIVE` | Khách hàng đã ngừng hoạt động, kích hoạt lại trước khi tạo hoá đơn |

---

## Not Found (404)

| Code | Message |
|---|---|
| `NOT_FOUND` | Không tìm thấy dữ liệu |

Default 404 không cần code, FE handle generic.

---

## Server (500)

| Code | Message |
|---|---|
| `INTERNAL` | Lỗi hệ thống, vui lòng thử lại |

FE log console + sonner toast.

---

## FE error handling pattern

```typescript
// src/app/lib/errorMessages.ts
const ERROR_MESSAGES: Record<string, string> = {
  'AUTH-INVALID': 'Email hoặc mật khẩu không đúng',
  'DOMAIN-DRAFT-PAYMENT': 'Không thể thanh toán hoá đơn nháp',
  // ...
}

export function getErrorMessage(err: any): string {
  const code = err?.response?.data?.code
  if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code]
  return err?.response?.data?.message ?? 'Đã có lỗi xảy ra'
}

// hooks/useInvoices.ts
useMutation({
  mutationFn: ...,
  onError: (err) => toast.error(getErrorMessage(err))
})
```
