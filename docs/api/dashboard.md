# API — Dashboard

Helper endpoint cho Dashboard page. Backend tính bundle giống FE-style (filter + reduce), không có aggregation phức tạp.

## GET `/api/dashboard`

- **Roles:** ADMIN, ACCOUNTANT, SALES, VIEWER

### Response 200
```json
{
  "monthlyRevenue": 285000000,
  "totalDebt": 98000000,
  "unpaidCount": 42,
  "overdueCount": 9,
  "recentInvoices": [Invoice, Invoice, Invoice, Invoice, Invoice]
}
```

### Tính toán trong service

```typescript
const today = new Date()
const thisMonth = today.getMonth()
const thisYear = today.getFullYear()
const startOfMonth = new Date(thisYear, thisMonth, 1)
const startOfNextMonth = new Date(thisYear, thisMonth + 1, 1)

// 1. Monthly revenue = sum payments in current month
const monthlyPayments = await this.paymentModel
  .find({ paymentDate: { $gte: startOfMonth, $lt: startOfNextMonth } })
  .lean()
const monthlyRevenue = monthlyPayments.reduce((s, p) => s + p.amount, 0)

// 2. Total debt = sum remainingBalance over open invoices
const openInvoices = await this.invoiceModel
  .find({ status: { $in: ['unpaid', 'partial'] }, deletedAt: null })
  .lean()
const totalDebt = openInvoices.reduce((s, i) => s + i.remainingBalance, 0)

// 3. Unpaid count
const unpaidCount = openInvoices.length

// 4. Overdue count (tính derived isOverdue)
const todayStart = new Date()
todayStart.setHours(0, 0, 0, 0)
const overdueCount = openInvoices.filter(i =>
  i.remainingBalance > 0 && new Date(i.dueDate) < todayStart
).length

// 5. Recent invoices (top 5 by createdAt)
const recentInvoices = await this.invoiceModel
  .find({ deletedAt: null })
  .sort({ createdAt: -1 })
  .limit(5)
  .lean()
const recentInvoicesWithFlag = this.attachIsOverdue(recentInvoices)

return { monthlyRevenue, totalDebt, unpaidCount, overdueCount, recentInvoices: recentInvoicesWithFlag }
```

### Errors
- 401 / 403 standard.

### Notes
- Không cache. Mỗi request tính lại. MVP scale thấp OK.
- Khi data lớn (>50k invoices), optimize bằng Mongo aggregation hoặc tạo summary collection (v2).
- FE invalidate `['dashboard']` khi mutation invoice/payment.
