# Workflow — Quotation Conversion

## Mục đích
Chuyển 1 quotation đã `accepted` thành invoice mới (status='unpaid').

## Endpoint
`POST /api/quotations/:id/convert` (ADMIN, ACCOUNTANT).

## Preconditions
- `quotation.status === 'accepted'`
- `quotation.convertedInvoiceId === null`

## Sequence

```
User              QuotationDetail         FE Hook            NestJS                    MongoDB
 │                      │                    │                  │                         │
 │ Click "Chuyển HĐ"    │                    │                  │                         │
 ├─────────────────────▶│ Open confirm modal │                  │                         │
 │ Confirm              │                    │                  │                         │
 ├─────────────────────▶│                    │                  │                         │
 │                      │ Disable btn        │                  │                         │
 │                      ├───────────────────▶│                  │                         │
 │                      │                    │ POST .../convert │                         │
 │                      │                    ├─────────────────▶│                         │
 │                      │                    │                  │ load quotation          │
 │                      │                    │                  ├────────────────────────▶│
 │                      │                    │                  │ check status='accepted' │
 │                      │                    │                  │ check !converted        │
 │                      │                    │                  │ load current customer   │
 │                      │                    │                  ├────────────────────────▶│
 │                      │                    │                  │ allocate invoiceNumber  │
 │                      │                    │                  ├────────────────────────▶│
 │                      │                    │                  │ insert invoice          │
 │                      │                    │                  ├────────────────────────▶│
 │                      │                    │                  │ update quotation        │
 │                      │                    │                  ├────────────────────────▶│
 │                      │                    │ { invoice }      │                         │
 │                      │                    │◀─────────────────┤                         │
 │                      │                    │ Invalidate quer. │                         │
 │                      │                    │ Toast            │                         │
 │                      │◀───────────────────┤                  │                         │
 │                      │ Navigate /invoices/:newId             │                         │
 │◀─────────────────────┤                    │                  │                         │
```

## Server-side logic

```typescript
// quotations.service.ts
async convert(quotationId: string, userId: string) {
  // 1. Load quotation
  const quotation = await this.quotationModel.findOne({ _id: quotationId, deletedAt: null })
  if (!quotation) throw new NotFoundException()

  // 2. Domain checks
  if (quotation.status !== 'accepted') {
    throw new UnprocessableEntityException({ code: 'DOMAIN-INVALID-STATE', message: 'Chỉ báo giá đã chấp nhận mới được chuyển' })
  }
  if (quotation.convertedInvoiceId) {
    throw new UnprocessableEntityException({ code: 'DOMAIN-ALREADY-CONVERTED', message: 'Báo giá đã được chuyển thành hoá đơn' })
  }

  // 3. Reload current customer (CR-CONV-04: KHÔNG dùng snapshot cũ trong quotation)
  // Lý do: customer có thể đã đổi địa chỉ/SĐT/MST giữa lúc accept và convert.
  // Hoá đơn mới phải dùng thông tin customer hiện tại để đúng pháp lý/giao hàng.
  const customer = await this.customersService.findById(quotation.customerId.toString())
  if (!customer || customer.deletedAt) {
    throw new UnprocessableEntityException({
      code: 'DOMAIN-CUSTOMER-DELETED',
      message: 'Khách hàng đã bị xoá. Không thể tạo hoá đơn từ báo giá này.',
    })
  }
  if (customer.status === 'inactive') {
    throw new UnprocessableEntityException({
      code: 'DOMAIN-CUSTOMER-INACTIVE',
      message: 'Khách hàng đã ngừng hoạt động. Kích hoạt lại trước khi tạo hoá đơn.',
    })
  }

  // 4. Allocate invoice number
  const year = new Date().getFullYear()
  const invoiceNumber = await this.counters.allocateInvoiceNumber(year)

  // 5. Compute defaults
  const settings = await this.settingsService.get()
  const today = new Date()
  const dueDate = new Date(today.getTime() + settings.defaultDueDays * 86400000)

  // 6. Build invoice document
  const invoice = await this.invoiceModel.create({
    invoiceNumber,
    customerId: customer._id,
    customerSnapshot: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      taxCode: customer.taxCode,
    },
    issueDate: today,
    dueDate,
    status: 'unpaid',
    items: quotation.items.map(it => ({
      productId: it.productId,
      productName: it.productName,
      unit: it.unit,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      discount: it.discount,
      lineTotal: it.lineTotal,
    })),
    subtotal: quotation.subtotal,
    discount: quotation.discount,
    tax: quotation.tax,
    shipping: quotation.shipping,
    total: quotation.total,
    paidAmount: 0,
    remainingBalance: quotation.total,
    notes: `Từ báo giá ${quotation.quotationNumber}\n${quotation.notes ?? ''}`,
    createdBy: userId,
  })

  // 7. Update quotation
  quotation.convertedInvoiceId = invoice._id
  await quotation.save()

  return { invoice }
}
```

## Failure modes

### Failure 1: Step 7 (update quotation) fail
- Invoice mới đã insert OK.
- Quotation `convertedInvoiceId` chưa được set.
- Hậu quả: nếu user retry → service throw `DOMAIN-ALREADY-CONVERTED` (sai!), hoặc tạo invoice thứ 2.
- **Mitigation MVP:** ADMIN check log, manual `db.quotations.updateOne(...)` set convertedInvoiceId; hoặc xoá invoice orphan.
- **v2 fix:** dùng Mongo transaction `withTransaction()` (yêu cầu replica set).

### Failure 2: Step 4 (allocate number) thành công nhưng step 6 (insert invoice) fail
- Counter đã `$inc`. Số bị skip.
- Hậu quả: gap số. Chấp nhận được (số legal, không trùng).

### Failure 3: User double-click "Chuyển HĐ"
- Request 1 đang process, request 2 đến.
- Cả 2 đều load quotation với `status='accepted', convertedInvoiceId=null`.
- Cả 2 pass domain check.
- Cả 2 allocate invoice number → 2 số khác nhau.
- Cả 2 insert invoice → 2 invoice mồ côi với 1 link.
- **Mitigation FE:** disable button sau click đầu (đã có pattern trong useMutation `isPending`).

### Failure 4: Customer bị deactivate/xoá giữa lúc accept và convert
- Sales accept quotation hôm 18/05. ADMIN deactivate customer hôm 19/05. Sales click convert hôm 20/05.
- Step 3 reload customer → thấy `status='inactive'` hoặc `deletedAt != null`.
- Throw 422 `DOMAIN-CUSTOMER-INACTIVE` hoặc `DOMAIN-CUSTOMER-DELETED`.
- FE hiển thị message phù hợp → user liên hệ admin kích hoạt lại customer rồi retry.

### Failure 5: Snapshot quotation cũ vs customer hiện tại
- KHÔNG dùng `quotation.customerSnapshot` để tạo invoice — vì có thể stale.
- Step 3 reload customer hiện tại → snapshot mới vào invoice.
- Hệ quả: invoice mới có thông tin khách hàng cập nhật nhất, không phải bản chốt khi báo giá. Nếu khách yêu cầu invoice theo địa chỉ cũ → admin sửa lại customer trước khi convert.

## Idempotency
Không có Idempotency-Key trong MVP. Chấp nhận race rare.

## Audit
NestJS Logger: `[QuotationConvert] quotation X → invoice Y by user Z`.

## Post-convert state
- Quotation: `status='accepted'`, `convertedInvoiceId=<invoiceId>`. Lock edit (PATCH 422).
- Invoice: `status='unpaid'`, có invoiceNumber. Có thể edit notes/dates, không edit items.
- Convert lần 2 → 422 `DOMAIN-ALREADY-CONVERTED`. Click "Sao chép" để tạo quotation mới rồi convert.

## FE invalidation
- `['quotations']`
- `['quotation', quotationId]`
- `['invoices']`
- `['invoice', newInvoiceId]` (TanStack Query sẽ fetch khi navigate)
- `['dashboard']`
