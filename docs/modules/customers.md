# Module — Customers

## Routes
- `/customers` — list
- `/customers/new` — create
- `/customers/:id/edit` — edit
- `/debts` — public debt management view (riêng module, share data customer)

## Data hooks
- `useCustomers(filters)` → `GET /api/customers`
- `useCustomer(id)` → `GET /api/customers/:id`
- `useCreateCustomer()` → `POST /api/customers`
- `useUpdateCustomer(id)` → `PATCH /api/customers/:id`
- `useDeleteCustomer(id)` → `DELETE /api/customers/:id`
- `useCustomerAging(id)` → `GET /api/customers/:id/aging`

---

## CustomerManagement page (`/customers`)

### UI
- Header: count + "Thêm khách hàng" CTA (ADMIN/ACCOUNTANT/SALES)
- Search box (search name/phone/email)
- Status filter dropdown
- Desktop table: Tên · Liên hệ (phone + email) · Địa chỉ · MST · Công nợ hiện tại · Trạng thái · Thao tác
- Mobile cards
- Row actions: View detail → modal hoặc redirect / Edit / Soft-delete (ADMIN)

### Công nợ hiện tại
- Tính FE-side từ `useCustomerAging(id)` cho mỗi row → quá nhiều API calls.
- Tốt hơn: backend trả `currentDebt` luôn trong customer object khi list (summary calc nhẹ).
- MVP: chấp nhận 5–10 customers list → mỗi row call aging riêng OK; nếu nhiều → backend optimize sau.

### Empty state
"Chưa có khách hàng nào" + CTA "Thêm khách hàng"

---

## CustomerForm page (`/customers/new`, `/customers/:id/edit`)

### Form fields
| Field | Type | Required | Validation |
|---|---|---|---|
| name | text | ✓ | 2–200 |
| phone | text | ✓ | VN phone |
| email | email | ✓ | RFC-5322 |
| address | textarea | ✓ | ≤ 300 |
| taxCode | text | — | optional |
| status | select | ✓ | active/inactive |

### Submit
- Create → POST, redirect `/customers`
- Update → PATCH, redirect `/customers`
- Cancel → back to `/customers`

### Form library
react-hook-form + Zod.

---

## DebtManagement page (`/debts`)

### Mục đích
Tổng hợp công nợ theo customer.

### UI
- Summary cards: Tổng công nợ · Số khách hàng có nợ · Số HĐ quá hạn
- Table: Khách hàng · Tổng nợ · Số HĐ chưa TT · HĐ quá hạn · 0-30 ngày · 31-60 ngày · 61-90 ngày · 90+ ngày · Thao tác (eye → drilldown)
- Drilldown dialog (Radix Dialog): chi tiết hoá đơn open của customer

### Data
- Fetch `useCustomers()` rồi loop call `useCustomerAging(id)` cho mỗi customer.
- Hoặc backend cung cấp endpoint `GET /api/debts/summary` (helper) — MVP optional, nếu cần optimize.

### Filter
- Mặc định chỉ show customer có nợ (`currentDebt > 0`).
- Toggle "Hiển thị tất cả khách hàng".

### Empty state
"Không có công nợ"
