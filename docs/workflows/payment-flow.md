# Workflow — Payment Flow

## Sequence diagram (text)

```
User                     PaymentModal              FE Hook              NestJS                   MongoDB
 │                            │                       │                    │                        │
 │ Click "Thêm TT"            │                       │                    │                        │
 ├───────────────────────────▶│                       │                    │                        │
 │                            │ Open                  │                    │                        │
 │ Fill form (amount, ...)    │                       │                    │                        │
 │ Submit                     │                       │                    │                        │
 ├───────────────────────────▶│                       │                    │                        │
 │                            │ Validate (Zod)        │                    │                        │
 │                            │ Disable submit btn    │                    │                        │
 │                            ├──────────────────────▶│                    │                        │
 │                            │                       │ POST .../payments  │                        │
 │                            │                       ├───────────────────▶│                        │
 │                            │                       │                    │ Check status / amount  │
 │                            │                       │                    │ insert payment         │
 │                            │                       │                    ├───────────────────────▶│
 │                            │                       │                    │ find all payments      │
 │                            │                       │                    ├───────────────────────▶│
 │                            │                       │                    │ recompute paidAmount   │
 │                            │                       │                    │ update invoice         │
 │                            │                       │                    ├───────────────────────▶│
 │                            │                       │ {payment, invoice} │                        │
 │                            │                       │◀───────────────────┤                        │
 │                            │                       │ Invalidate queries │                        │
 │                            │                       │ Toast success      │                        │
 │                            │◀──────────────────────┤                    │                        │
 │                            │ Close modal           │                    │                        │
 │ See updated invoice        │                       │                    │                        │
 │◀───────────────────────────┤                       │                    │                        │
```

## Server-side logic (NestJS)

```typescript
// payments.service.ts
async addPayment(invoiceId: string, dto: AddPaymentDto, userId: string) {
  // 1. Load invoice
  const invoice = await this.invoiceModel.findOne({ _id: invoiceId, deletedAt: null })
  if (!invoice) throw new NotFoundException()

  // 2. Domain checks
  if (invoice.status === 'draft') throw new UnprocessableEntityException({ code: 'DOMAIN-DRAFT-PAYMENT' })
  if (invoice.status === 'void')  throw new UnprocessableEntityException({ code: 'DOMAIN-VOID-PAYMENT' })
  if (invoice.remainingBalance === 0) throw new UnprocessableEntityException({ code: 'DOMAIN-PAID-PAYMENT' })

  // 3. Value validation (DTO đã làm phần lớn, double-check business)
  if (dto.amount > invoice.remainingBalance) {
    throw new BadRequestException({ code: 'V-PAY-02', message: `Số tiền vượt quá ${invoice.remainingBalance}` })
  }

  // 4. Insert payment
  const payment = await this.paymentModel.create({
    invoiceId: invoice._id,
    amount: dto.amount,
    paymentDate: dto.paymentDate,
    method: dto.method,
    reference: dto.reference,
    note: dto.note,
    createdBy: userId,
  })

  // 5. Recompute từ DB (KHÔNG dùng invoice.paidAmount += amount trên memory)
  const allPayments = await this.paymentModel.find({ invoiceId: invoice._id }).lean()
  const paidAmount = allPayments.reduce((s, p) => s + p.amount, 0)

  // 6. Post-recompute guard (H-4): chống race condition 2 payment đồng thời
  if (paidAmount > invoice.total) {
    this.logger.warn(
      `[Payment race] invoice=${invoice._id} total=${invoice.total} paidAmount=${paidAmount} ` +
      `paymentJustInserted=${payment._id} amount=${dto.amount}. ` +
      `Admin cần xoá payment dư hoặc void invoice + tạo lại.`
    )
    throw new UnprocessableEntityException({
      code: 'DOMAIN-PAID-EXCEEDS-TOTAL',
      message: 'Tổng thanh toán vượt quá tổng hoá đơn (race condition). Vui lòng tải lại và thử lại.',
    })
  }

  const remainingBalance = invoice.total - paidAmount
  const newStatus = paidAmount >= invoice.total ? 'paid' : 'partial'

  // 7. Update invoice
  invoice.paidAmount = paidAmount
  invoice.remainingBalance = remainingBalance
  invoice.status = newStatus
  await invoice.save()

  // 8. Attach isOverdue derived field
  const today = new Date(); today.setHours(0,0,0,0)
  const isOverdue = (newStatus === 'unpaid' || newStatus === 'partial')
                 && remainingBalance > 0
                 && invoice.dueDate < today

  return { payment, invoice: { ...invoice.toObject(), isOverdue } }
}
```

## Race condition handling

**Vấn đề:** 2 ACCOUNTANT trả cùng 1 invoice cùng lúc.

**Hành vi MVP (không transaction):**
- Cả 2 request đều load invoice với cùng `remainingBalance = X`.
- Cả 2 pass validation `amount ≤ X`.
- Cả 2 insert payment.
- Cả 2 recompute `paidAmount` từ DB — cả 2 đều thấy 2 payments mới → sum đúng.
- **Step 6 post-recompute guard (H-4)** detect `paidAmount > total` → throw 422 cho request đến sau (request đến trước đã commit OK).
- Payment dư vẫn nằm trong DB collection — admin xoá thủ công bằng script ops, hoặc void invoice + tạo lại. Log warning đã ghi để alert.

**Mitigation FE:** disable submit button khi `mutation.isPending` (TanStack Query).

**Hệ quả với guard mới:**
- Request đến trước: 200 OK, status partial/paid bình thường.
- Request đến sau: 422 DOMAIN-PAID-EXCEEDS-TOTAL, FE hiển thị toast yêu cầu user reload.
- Payment dư trong DB — không tự rollback (MVP không có transaction). Admin cleanup.

**Khi cần chặt chẽ hơn (v2):** dùng Mongo replica set + `session.withTransaction()` + `findOneAndUpdate` với condition `remainingBalance >= amount` để atomic reject ngay lúc check.

## Notification
- Không có notifications trong MVP. Toast success "Thêm thanh toán thành công!" là feedback duy nhất.

## Audit
- Không có audit DB-level. NestJS Logger ghi `[Payment] invoice X paid Y by user Z` xuất stdout, capture qua docker logs.

## Invariants kiểm tra (Jest)
- INV-4: `paidAmount = Σ payments.amount` (sau add payment)
- INV-5: `paidAmount ≤ total`
- INV-6: `remainingBalance = total − paidAmount`
- INV-7: status consistent với `calculateStatus()`
