# Validation Rules — Full List

Tổng hợp mọi validation rule. Mỗi rule có:
- ID (`V-XXX-NN`)
- Module
- Trigger
- Error code + message
- Enforced ở DTO (D), Service (S), hoặc Frontend (F)

---

## Authentication / Users

| ID | Module | Trigger | Error code | Enforced |
|---|---|---|---|---|
| V-AUTH-01 | Auth | Empty email/password | `V-AUTH-01` "Vui lòng nhập email và mật khẩu" | D + F |
| V-AUTH-02 | Auth | Email không đúng RFC | `V-AUTH-02` "Email không hợp lệ" | D + F |
| V-USR-01 | Users | Email tồn tại trong tenant | `V-USR-01` "Email đã được sử dụng" | S |
| V-USR-02 | Users | Phone không match `^0\d{9,10}$` | `V-USR-02` "Số điện thoại không hợp lệ" | D + F |
| V-USR-05 | Users | Password < 8 hoặc thiếu chữ/số | `V-USR-05` "Mật khẩu phải ≥ 8 ký tự, gồm chữ và số" | D + F |

## Customers

| ID | Trigger | Error code | Enforced |
|---|---|---|---|
| V-CUST-01 | Empty name | `V-CUST-01` | D |
| V-CUST-02 | Invalid phone | `V-CUST-02` | D |
| V-CUST-03 | Invalid email | `V-CUST-03` | D |
| V-CUST-04 | Invalid tax code format | `V-CUST-04` | D |
| V-CUST-06 | Address > 300 chars | `V-CUST-06` | D |

## Products

| ID | Trigger | Error code | Enforced |
|---|---|---|---|
| V-PROD-01 | Empty name | `V-PROD-01` | D |
| V-PROD-02 | price < 0 | `V-PROD-02` | D |
| V-PROD-03 | stock < 0 | `V-PROD-03` | D |
| V-PROD-04 | Empty category | `V-PROD-04` | D |
| V-PROD-05 | Empty unit | `V-PROD-05` | D |

## Invoices

| ID | Trigger | Error code | Enforced |
|---|---|---|---|
| V-CI-01 | customerId empty | `V-CI-01` | D + F |
| V-CI-02 | items.length === 0 | `V-CI-02` | D + F |
| V-CI-03 | item missing productId / qty ≤ 0 / unitPrice < 0 | `V-CI-03` | D + F |
| V-CI-04 | customer không tồn tại | `V-CI-04` | S |
| V-CI-05 | dueDate < issueDate | `V-CI-05` | D + F |
| V-CI-06 | invoiceDiscount > subtotal | `V-CI-06` | S |
| V-CI-07 | tax/shipping/discount < 0 | `V-CI-07` | D |
| V-CI-08 | line discount > qty × unitPrice | `V-CI-08` | D + S |
| V-CI-09 | notes > 1000 chars | `V-CI-09` | D |

## Payments

| ID | Trigger | Error code | Enforced |
|---|---|---|---|
| V-PAY-01 | amount ≤ 0 | `V-PAY-01` | D + S |
| V-PAY-02 | amount > remainingBalance | `V-PAY-02` | S |
| V-PAY-03 | paymentDate > today + 1 | `V-PAY-03` | D + S |
| V-PAY-06 | bank_transfer/check thiếu reference | `V-PAY-06` | D + F |

## Quotations

| ID | Trigger | Error code | Enforced |
|---|---|---|---|
| V-Q-02 | validUntil < issueDate | `V-Q-02` | D + F |

## Settings

| ID | Trigger | Error code | Enforced |
|---|---|---|---|
| V-SET-01 | Empty companyName | `V-SET-01` | D |
| V-SET-02 | Invalid companyEmail | `V-SET-02` | D |
| V-SET-04 | defaultDueDays ∉ [0, 365] | `V-SET-04` | D |
| V-SET-05 | defaultTaxRate ∉ [0, 100] | `V-SET-05` | D |
| V-SET-06 | invoicePrefix không match `^[A-Z0-9-]+$` | `V-SET-06` | D |

---

## Domain errors (422)

Không phải validation kiểu DTO mà là business rule:

| Code | Trigger |
|---|---|
| DOMAIN-LAST-ADMIN | Demote/deactivate ADMIN cuối cùng còn active |
| DOMAIN-CUSTOMER-IN-USE | Soft-delete customer có invoice |
| DOMAIN-PRODUCT-IN-USE | Soft-delete product có invoice line |
| DOMAIN-DRAFT-PAYMENT | Add payment cho draft |
| DOMAIN-VOID-PAYMENT | Add payment cho void |
| DOMAIN-PAID-PAYMENT | Add payment cho paid (remaining=0) |
| DOMAIN-PAID-EXCEEDS-TOTAL | Post-recompute thấy sum payments > total (race condition 2 payments cùng lúc) |
| DOMAIN-LINES-LOCKED | Sửa items khi status != draft |
| DOMAIN-INVALID-STATE | Finalize non-draft / void paid / accept non-sent / convert non-accepted |
| DOMAIN-QUOTE-LOCKED | PATCH quotation khi status != draft |
| DOMAIN-QUOTE-EXPIRED | Accept quotation đã expired |
| DOMAIN-ALREADY-CONVERTED | Convert quotation đã có convertedInvoiceId |
| DOMAIN-CUSTOMER-DELETED | Convert quotation mà customer đã soft-delete |
| DOMAIN-CUSTOMER-INACTIVE | Convert quotation mà customer status='inactive' |

---

## Validation enforcement pattern

### Backend DTO (class-validator)

```typescript
// dto/create-invoice.dto.ts
export class CreateInvoiceItemDto {
  @IsString() productId: string

  @IsNumber()
  @IsPositive({ message: 'V-CI-03' })
  quantity: number

  @IsNumber()
  @Min(0, { message: 'V-CI-03' })
  unitPrice: number

  @IsNumber()
  @Min(0, { message: 'V-CI-07' })
  discount: number
}

export class CreateInvoiceDto {
  @IsString({ message: 'V-CI-01' })
  customerId: string

  @IsDateString({}, { message: 'V-CI-05' })
  issueDate: string

  @IsDateString({}, { message: 'V-CI-05' })
  dueDate: string

  @IsArray()
  @ArrayMinSize(1, { message: 'V-CI-02' })
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[]

  @IsNumber() @Min(0, { message: 'V-CI-07' })
  discount: number = 0

  @IsOptional() @IsNumber() @Min(0)
  tax?: number

  @IsNumber() @Min(0, { message: 'V-CI-07' })
  shipping: number = 0

  @IsOptional() @IsString() @MaxLength(1000, { message: 'V-CI-09' })
  notes?: string

  @IsIn(['draft', 'unpaid'])
  status: 'draft' | 'unpaid'
}
```

### Service business validation

```typescript
// invoices.service.ts
private validateLines(items: CreateInvoiceItemDto[]) {
  for (const it of items) {
    if (it.discount > it.quantity * it.unitPrice) {
      throw new BadRequestException({ code: 'V-CI-08', message: 'Giảm giá vượt quá thành tiền' })
    }
  }
}

private validateTotals(subtotal: number, discount: number) {
  if (discount > subtotal) {
    throw new BadRequestException({ code: 'V-CI-06', message: 'Giảm giá vượt quá tạm tính' })
  }
}
```

### Frontend Zod schema (share với BE qua packages/shared-types)

```typescript
// lib/schemas/invoice.ts
export const createInvoiceSchema = z.object({
  customerId: z.string().min(1, 'V-CI-01'),
  issueDate: z.string().date(),
  dueDate: z.string().date(),
  items: z.array(itemSchema).min(1, 'V-CI-02'),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).optional(),
  shipping: z.number().min(0).default(0),
  notes: z.string().max(1000).optional(),
  status: z.enum(['draft', 'unpaid']),
}).refine(
  data => new Date(data.dueDate) >= new Date(data.issueDate),
  { message: 'V-CI-05', path: ['dueDate'] }
)
```

FE map error code sang message tiếng Việt (xem `api/common-errors.md`).
