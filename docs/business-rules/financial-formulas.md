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

**CANONICAL pattern — KHÔNG dùng cách nào khác:**

Sau mỗi `POST /invoices/:id/payments`, service:
1. Insert payment vào collection `payments`.
2. **Query lại toàn bộ payments của invoice** (`paymentModel.find({ invoiceId }).lean()`) — KHÔNG dùng `invoice.paidAmount += dto.amount` trên memory.
3. `paidAmount = sum(allPayments.amount)`.
4. **Post-recompute guard (H-4):** nếu `paidAmount > invoice.total` → có race condition (2 payment đồng thời pass validation ban đầu). Throw 422 `DOMAIN-PAID-EXCEEDS-TOTAL`. Payment vừa insert vẫn nằm trong DB → log warning, admin xử lý thủ công (xoá payment dư bằng script ops hoặc void invoice + tạo lại). KHÔNG tự rollback (không có transaction).
5. `invoice.paidAmount = paidAmount`, `invoice.remainingBalance = invoice.total - paidAmount`.
6. `invoice.status = calculateStatus(invoice.total, paidAmount, false, false)`.
7. Save invoice.

**Lý do recompute từ DB:** chống race condition nhẹ — nếu 2 request đồng thời, mỗi request query DB cuối cùng đều thấy đủ payments của cả 2 → sum đúng. Pattern `invoice.paidAmount += amount` trên memory dễ overwrite lẫn nhau.

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

  let counter
  try {
    counter = await this.counterModel.findOneAndUpdate(
      { _id: `invoice-${year}` },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    )
  } catch (err: any) {
    // E11000 duplicate key: 2 concurrent upserts cùng insert doc đầu tiên,
    // 1 trong 2 fail. Retry 1 lần — lúc này doc đã tồn tại, $inc thường.
    if (err?.code === 11000) {
      counter = await this.counterModel.findOneAndUpdate(
        { _id: `invoice-${year}` },
        { $inc: { seq: 1 } },
        { new: true }  // KHÔNG upsert ở retry
      )
      if (!counter) throw err  // không expect — rethrow để alert
    } else {
      throw err
    }
  }

  const padded = String(counter.seq).padStart(3, '0')
  return `${prefix}${year}-${padded}`  // 'HD-2026-009'
}
```

**Race condition note:** `findOneAndUpdate` với `upsert: true` là **atomic single-document op**, nhưng khi 2 request đồng thời đến lúc counter doc chưa tồn tại, cả 2 cùng thử upsert → 1 trong 2 sẽ throw `E11000 duplicate key`. Code trên catch + retry 1 lần. Sau lần insert đầu tiên thành công, mọi `$inc` về sau là pure atomic — không cần retry.

**Alternative đơn giản hơn:** seed sẵn `{ _id: 'invoice-<currentYear>', seq: 0 }` vào collection `counters` trong `pnpm seed` để loại bỏ hoàn toàn race upsert đầu năm. Mỗi đầu năm mới, admin (hoặc seed migration) thêm row năm tiếp theo.

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
