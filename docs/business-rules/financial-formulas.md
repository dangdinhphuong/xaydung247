# Financial Formulas — MVP v1

> Mọi công thức tài chính. Backend NestJS service và frontend (preview) MUST implement giống hệt.

**Money type:** number (VND nguyên, không decimal).
**Rounding:** `Math.round()` (về số nguyên gần nhất).
**Time zone:** server chạy ở `Asia/Ho_Chi_Minh` (set qua `TZ=Asia/Ho_Chi_Minh` env hoặc Docker).
**Hôm nay:** `new Date()` ở server.

---

## F-1 · Line total

```typescript
lineTotal = quantity * unitPrice - discount
```

- `quantity > 0`, `unitPrice ≥ 0`, `discount ≥ 0`.
- Invariant: `lineTotal ≥ 0` → `discount ≤ quantity * unitPrice`.
- Validate trong DTO + recompute trong service.

---

## F-2 · Subtotal

```typescript
subtotal = items.reduce((sum, it) => sum + it.lineTotal, 0)
```

Server tính lại từ items, **không trust** subtotal từ FE.

---

## F-3 · Tax (auto)

```typescript
taxBase = subtotal - invoiceDiscount

if (autoTax && taxNotProvided) {
  tax = Math.round(taxBase * defaultTaxRate / 100)
} else {
  tax = providedTax  // operator override
}
```

`defaultTaxRate` từ `settings.defaultTaxRate` (số nguyên 0–100, ví dụ 10 cho 10%).

---

## F-4 · Total

```typescript
total = subtotal - invoiceDiscount + tax + shipping
```

`invoiceDiscount ≥ 0 AND ≤ subtotal`. `shipping ≥ 0`. `tax ≥ 0`.

---

## F-5 · Paid amount

```typescript
paidAmount = payments.reduce((sum, p) => sum + p.amount, 0)
```

MVP không có reversal payment. Cộng dồn đơn giản.

Sau mỗi `POST /invoices/:id/payments`, service:
1. Insert payment vào collection `payments`.
2. Query lại all payments của invoice → tính `paidAmount`.
3. `invoice.paidAmount = paidAmount`, `invoice.remainingBalance = total - paidAmount`.
4. `invoice.status = calculateStatus(total, paidAmount, false, false)`.
5. Save invoice.

---

## F-6 · Remaining balance

```typescript
remainingBalance = total - paidAmount
```

`0 ≤ remainingBalance ≤ total`.

---

## F-7 · Aging bucket (per invoice, tính FE-side)

```typescript
function bucket(invoice, today): '0-30' | '31-60' | '61-90' | '90+' {
  const daysPastDue = Math.floor((today.getTime() - invoice.dueDate.getTime()) / 86400000)
  if (daysPastDue <= 30) return '0-30'
  if (daysPastDue <= 60) return '31-60'
  if (daysPastDue <= 90) return '61-90'
  return '90+'
}
```

Bucket `0-30` bao gồm cả invoice chưa đến hạn (daysPastDue ≤ 0).

Per-customer aggregation:

```typescript
function customerAging(invoices, today) {
  const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 }
  for (const inv of invoices) {
    if (inv.status === 'unpaid' || inv.status === 'partial') {
      if (inv.remainingBalance > 0) {
        buckets[bucket(inv, today)] += inv.remainingBalance
      }
    }
  }
  return buckets
}
```

Tính FE-side trong Debt management page hoặc trong service helper `GET /customers/:id/aging`.

---

## F-8 · isOverdue (per invoice)

```typescript
isOverdue = (status === 'unpaid' || status === 'partial')
         && remainingBalance > 0
         && dueDate < today  // strict <
```

Service `InvoicesService.findAll()` map từng invoice thêm field `isOverdue`:

```typescript
const today = new Date()
today.setHours(0, 0, 0, 0)
return invoices.map(inv => ({
  ...inv.toObject(),
  isOverdue: (inv.status === 'unpaid' || inv.status === 'partial')
          && inv.remainingBalance > 0
          && inv.dueDate < today
}))
```

---

## F-9 · calculateStatus

```typescript
function calculateStatus(total, paidAmount, isDraft, isVoid): InvoiceStatus {
  if (isVoid) return 'void'
  if (isDraft) return 'draft'
  if (paidAmount === 0) return 'unpaid'
  if (paidAmount < total) return 'partial'
  return 'paid'
}
```

Dùng trong:
- `POST /invoices` (khi tạo): `isDraft=true` cho draft, `isDraft=false` cho finalize.
- `POST /invoices/:id/finalize`: `isDraft=false`.
- `POST /invoices/:id/payments`: tính lại sau khi cập nhật paidAmount.
- `POST /invoices/:id/void`: `isVoid=true`.

---

## F-10 · isQuotationExpired

```typescript
isQuotationExpired = (status === 'sent') && (validUntil < today)  // strict <
```

Service `QuotationsService.findAll()` map thêm field `isExpired`. Không cron, không auto-flip status.

Lưu ý: Khi customer cố accept một quotation đã expired (qua endpoint `POST /quotations/:id/accept`), service check `isExpired` trước, trả 422 nếu true.

---

## F-11 · Dashboard KPIs (tính FE-side)

FE gọi `GET /invoices?limit=200` (hoặc tự pagination), nhận về list invoices đầy đủ. Tính 4 KPI:

```typescript
const today = new Date()
const thisMonth = today.getMonth()
const thisYear = today.getFullYear()

// KPI 1: Doanh thu tháng này (cash basis = paid in this month)
// FE cần fetch /payments nữa OR tính từ paidAmount của invoices in this month
const monthlyRevenue = invoices
  .filter(i => i.issueDate.getMonth() === thisMonth && i.issueDate.getFullYear() === thisYear)
  .reduce((sum, i) => sum + i.paidAmount, 0)

// KPI 2: Tổng công nợ phải thu
const totalDebt = invoices
  .filter(i => i.status === 'unpaid' || i.status === 'partial')
  .reduce((sum, i) => sum + i.remainingBalance, 0)

// KPI 3: Số hoá đơn chưa thanh toán
const unpaidCount = invoices.filter(i => i.status === 'unpaid' || i.status === 'partial').length

// KPI 4: Số hoá đơn quá hạn
const overdueCount = invoices.filter(i => i.isOverdue).length
```

Khi data lớn (>10k invoices), backend cung cấp endpoint helper `GET /dashboard` trả về bundle:

```json
{
  "monthlyRevenue": 285000000,
  "totalDebt": 98000000,
  "unpaidCount": 42,
  "overdueCount": 9,
  "recentInvoices": [Invoice, ...×5]
}
```

Backend cũng tính FE-style (filter + reduce), không có aggregation phức tạp.

---

## F-12 · Invoice number allocation

```typescript
async function allocateInvoiceNumber(year: number): Promise<string> {
  const settings = await this.settingsService.get()
  const prefix = settings.invoicePrefix  // 'HD-'

  const counter = await this.counterModel.findOneAndUpdate(
    { _id: `invoice-${year}` },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  )

  const padded = String(counter.seq).padStart(3, '0')
  return `${prefix}${year}-${padded}`  // 'HD-2026-009'
}
```

`findOneAndUpdate` với `upsert: true` là **atomic** trong MongoDB single-document operation. An toàn cho concurrent inserts.

Cùng cơ chế cho quotation, dùng `_id: \`quotation-${year}\``.

---

## Rounding & precision

- Money: số nguyên VND. `Math.round()` ở mỗi bước cuối tính tax.
- `quantity`: decimal, lưu `Number` trong Mongo.
- Không dùng decimal library cho MVP — `Number` JS đủ độ chính xác cho VND (max safe int 2^53).
- Khi sum 100k invoice × 100M VND = 10^13 < 2^53 = 9×10^15 → an toàn.

---

## Cross-references

- `business-rules/canonical-rules.md` — CR-* gọi các F-* trên.
- `business-rules/status-lifecycle.md` — state machine dùng F-9.
- `database/mongodb-schema.md` — collections lưu các giá trị này.
- `api/invoices.md`, `api/payments.md` — endpoints implement.
