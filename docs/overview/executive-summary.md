# Executive Summary — Invoice Pro MVP v1

## Sản phẩm

Phần mềm quản lý hoá đơn web cho cửa hàng vật liệu xây dựng Việt Nam. Triển khai **on-premise** (1 shop = 1 instance), không phải SaaS.

## Mục tiêu kinh doanh

1. Xuất hoá đơn bán hàng cho khách (in / PDF).
2. Theo dõi công nợ khách hàng theo aging (0–30, 31–60, 61–90, 90+ ngày).
3. Ghi nhận thanh toán nhiều đợt cho 1 hoá đơn.
4. Quản lý danh mục khách hàng và sản phẩm.
5. Lập báo giá, chuyển báo giá sang hoá đơn.
6. Dashboard tổng quan: doanh thu tháng, công nợ, hoá đơn chưa thanh toán, hoá đơn quá hạn.

## Đối tượng người dùng

| Role | Mô tả |
|---|---|
| ADMIN (Quản trị viên) | Chủ shop, full quyền + sửa settings + xoá |
| ACCOUNTANT (Kế toán) | Tạo hoá đơn, ghi nhận thanh toán, xem báo giá, xem công nợ |
| SALES (Nhân viên kinh doanh) | Lập báo giá, xem khách hàng/sản phẩm |
| VIEWER (Người xem) | Chỉ xem dashboard + công nợ |

## Phạm vi MVP v1

### Tính năng giữ
- Đăng nhập / Đăng xuất (session cookie)
- Dashboard 4 KPI + 5 hoá đơn gần nhất (tính FE-side)
- Quản lý hoá đơn: list, tạo, chi tiết, thêm thanh toán
- Quản lý khách hàng: list, tạo, sửa
- Quản lý sản phẩm: list, tạo, sửa
- Quản lý báo giá: list, tạo, chuyển sang hoá đơn
- Cài đặt: thông tin công ty, prefix hoá đơn, default due-days, default tax-rate, template HTML
- In hoá đơn (`window.print()`)
- Xuất Excel (SheetJS browser-side)

### Tính năng KHÔNG có trong v1
- Multi-tenant / SaaS — chỉ 1 shop / 1 instance
- Báo cáo nâng cao (chỉ có 4 KPI ở Dashboard)
- Notifications / email / reminders
- Audit log
- File attachments
- Inventory tracking (stock chỉ là field hiển thị)
- Coupon / promotion engine
- Server-side PDF generation
- Cron jobs
- Bulk import Excel

## Stack kỹ thuật

| Layer | Tech |
|---|---|
| FE | React 18 + Vite + TanStack Query + Tailwind + Radix UI |
| BE | NestJS + Mongoose + class-validator |
| DB | MongoDB 6+ standalone |
| Auth | Session cookie HttpOnly + CSRF token |
| Deploy | Docker Compose, on-prem (1 server) |

## Triết lý

- Simple-first, ít layer, ít abstraction.
- Backend = CRUD thuần. Logic phức tạp ở FE.
- Không tối ưu hoá sớm. Có production traffic rồi tính tiếp.

## Success criteria

| Tiêu chí | Mục tiêu |
|---|---|
| Tạo 1 hoá đơn 8 dòng | ≤ 60s |
| Ghi nhận 1 thanh toán | ≤ 15s |
| Dashboard load | ≤ 2s với 10k hoá đơn |
| Số người dùng đồng thời | ≤ 5 (1 shop) |
| Số hoá đơn / năm | ≤ 50k |

## Out of scope (sẽ có ở v2+ nếu có nhu cầu)

- Multi-tenant SaaS
- Notifications + email
- Audit log
- Reports module
- Server-side PDF
- Inventory tracking
- Coupons
