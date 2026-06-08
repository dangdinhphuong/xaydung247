# Module — Dashboard

## Mục đích
Trang chủ sau login. Hiển thị 4 KPI + 5 hoá đơn gần nhất.

## Route
`/` (index của Layout)

## Actors
ADMIN, ACCOUNTANT, SALES, VIEWER (mọi role).

## Data source
`GET /api/dashboard` — backend tính bundle (xem `api/dashboard.md`).

Hoặc FE tự tính từ `GET /api/invoices?size=200` (chỉ phù hợp khi data nhỏ).

## UI sections

### Header
- "Tổng quan" + subtitle "Hoạt động kinh doanh"
- Mobile: sticky title

### 4 KPI cards (grid 4 cột desktop, 2 cột mobile)

| Card | Value | Icon | Color |
|---|---|---|---|
| Doanh thu tháng này | `formatCurrency(monthlyRevenue)` | DollarSign | green |
| Tổng công nợ phải thu | `formatCurrency(totalDebt)` | TrendingUp | orange |
| Hoá đơn chưa thanh toán | `unpaidCount` | FileText | blue |
| Hoá đơn quá hạn | `overdueCount` | AlertCircle | red |

### Recent invoices section

- Title "Hoá đơn gần đây" + button "Xem tất cả" → `/invoices`
- Desktop: table với columns: Mã HĐ, Khách hàng, Ngày tạo, Tổng tiền, Còn lại, Trạng thái
- Mobile: card list
- Click row → `/invoices/:id`

## Empty states
- Tenant mới chưa có invoice nào → 4 KPI = 0, recent table rỗng với CTA "Tạo hoá đơn đầu tiên" → `/invoices/create`

## Loading state
- 4 skeleton cards + table skeleton

## Implementation
- `useDashboard()` hook → `useQuery(['dashboard'])`.
- Invalidate khi mutation invoice/payment.
- Không có charts trong MVP (bỏ Line/Pie chart cũ).

## Bỏ khỏi v1
- ❌ Revenue trend chart (6 months)
- ❌ Debt distribution pie chart
- ❌ MoM trend chip
- ❌ Custom date range filter
