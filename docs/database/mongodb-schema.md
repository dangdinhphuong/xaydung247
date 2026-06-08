# MongoDB Schema — MVP v1

Database name: `invoicepro`
Engine: MongoDB 6+ standalone (không replica set, không sharding).

Mỗi collection được khai báo qua Mongoose schema trong `apps/backend/src/<module>/schemas/`. File này là spec; code schema phải khớp.

---

## 1. Collection: `users`

Người dùng hệ thống. ADMIN seed 1 user đầu tiên.

```typescript
{
  _id: ObjectId,
  email: string,           // unique
  passwordHash: string,    // bcrypt
  fullName: string,
  phone?: string,
  role: 'ADMIN' | 'ACCOUNTANT' | 'SALES' | 'VIEWER',
  status: 'active' | 'inactive',  // default 'active'
  lastLoginAt?: Date,
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
- `{ email: 1 }` unique
- `{ role: 1, status: 1 }`

---

## 2. Collection: `customers`

```typescript
{
  _id: ObjectId,
  code: string,            // 'CUST001', auto-generated server-side
  name: string,
  phone: string,
  email: string,
  address: string,
  taxCode?: string,
  status: 'active' | 'inactive',  // default 'active'
  deletedAt?: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
- `{ code: 1 }` unique
- `{ name: 'text', phone: 'text', email: 'text' }` text index for search
- `{ status: 1, deletedAt: 1 }`

**Notes:** `currentDebt` KHÔNG lưu — tính derived (xem CR-C-03).

---

## 3. Collection: `products`

```typescript
{
  _id: ObjectId,
  code: string,            // 'PROD001'
  name: string,
  category: string,        // free text
  unit: string,            // 'bao', 'm³', 'viên', 'kg', etc.
  price: number,           // VND
  stock: number,           // chỉ để hiển thị, không decrement
  description?: string,
  status: 'active' | 'inactive',
  deletedAt?: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
- `{ code: 1 }` unique
- `{ category: 1, status: 1 }`
- `{ name: 'text', description: 'text' }`

---

## 4. Collection: `invoices`

Embed `items[]` trong cùng document (single-document atomic update).

```typescript
{
  _id: ObjectId,
  invoiceNumber: string | null,  // null cho draft, 'HD-2026-001' khi finalize
  customerId: ObjectId,           // ref customers
  customerSnapshot: {             // snapshot tại thời điểm tạo
    name: string,
    phone: string,
    address: string,
    taxCode?: string,
  },
  issueDate: Date,
  dueDate: Date,
  status: 'draft' | 'unpaid' | 'partial' | 'paid' | 'void',
  items: [
    {
      _id: ObjectId,              // mongo tự sinh cho subdocument
      productId?: ObjectId,       // optional cho ad-hoc
      productName: string,        // snapshot
      unit: string,               // snapshot
      quantity: number,
      unitPrice: number,
      discount: number,           // VND absolute
      lineTotal: number,          // server-computed
    }
  ],
  subtotal: number,
  discount: number,               // invoice-level
  tax: number,
  shipping: number,
  total: number,
  paidAmount: number,
  remainingBalance: number,
  notes?: string,
  voidReason?: string,            // khi status='void'
  createdBy: ObjectId,            // ref users
  deletedAt?: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
- `{ invoiceNumber: 1 }` **unique sparse** — `sparse: true` bắt buộc vì draft có `invoiceNumber=null`; nếu thiếu `sparse`, nhiều draft cùng `null` sẽ trigger duplicate key error.
- `{ deletedAt: 1, status: 1, createdAt: -1 }` — index chính cho list query (default filter deletedAt=null, sort createdAt desc)
- `{ customerId: 1, status: 1, deletedAt: 1 }` — cho customer detail summary + debt aggregation
- `{ createdBy: 1 }` — cho SALES ownership filter

**Mongoose schema declaration (BẮT BUỘC):**
```typescript
@Prop({ type: String, default: null, unique: true, sparse: true })
invoiceNumber: string | null
```
hoặc khai trong `SchemaFactory`:
```typescript
InvoiceSchema.index({ invoiceNumber: 1 }, { unique: true, sparse: true })
```

**Notes:**
- `customerSnapshot` đảm bảo invoice in ra giữ nguyên thông tin khách hàng dù sau này khách hàng đổi địa chỉ.
- `items[]` embed — query/update đơn giản, atomic single-doc.
- Không có `isOverdue` field — tính tại read-time (xem F-8).

---

## 5. Collection: `payments`

Tách collection riêng để dễ list / filter theo ngày thanh toán.

```typescript
{
  _id: ObjectId,
  invoiceId: ObjectId,        // ref invoices
  amount: number,
  paymentDate: Date,
  method: 'cash' | 'bank_transfer' | 'check' | 'other',
  reference?: string,
  note?: string,
  createdBy: ObjectId,
  createdAt: Date,
}
```

**Indexes:**
- `{ invoiceId: 1, paymentDate: -1 }`
- `{ paymentDate: -1 }`             # cho dashboard tính monthlyRevenue

**Notes:**
- Append-only. Không update, không delete trong MVP.
- Không có `deletedAt`.

---

## 6. Collection: `quotations`

```typescript
{
  _id: ObjectId,
  quotationNumber: string | null,  // null cho draft, 'BG-2026-001' khi send
  customerId: ObjectId,
  customerSnapshot: {
    name: string,
    phone: string,
    address: string,
    taxCode?: string,
  },
  issueDate: Date,
  validUntil: Date,
  status: 'draft' | 'sent' | 'accepted' | 'rejected',
  items: [
    {
      _id: ObjectId,
      productId?: ObjectId,
      productName: string,
      unit: string,
      quantity: number,
      unitPrice: number,
      discount: number,
      lineTotal: number,
    }
  ],
  subtotal: number,
  discount: number,
  tax: number,
  shipping: number,
  total: number,
  notes?: string,
  convertedInvoiceId?: ObjectId | null,  // ref invoices, set khi convert
  rejectReason?: string,
  createdBy: ObjectId,
  deletedAt?: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
- `{ quotationNumber: 1 }` **unique sparse** — bắt buộc `sparse: true` vì draft có `null`. Khai như invoice:
  ```typescript
  QuotationSchema.index({ quotationNumber: 1 }, { unique: true, sparse: true })
  ```
- `{ deletedAt: 1, status: 1, createdAt: -1 }`
- `{ customerId: 1, status: 1, deletedAt: 1 }`
- `{ createdBy: 1 }`

**Notes:** `expired` không phải status value — tính derived (xem F-10).

---

## 7. Collection: `settings`

Chỉ 1 document duy nhất. Khởi tạo bằng seed.

```typescript
{
  _id: ObjectId,                    // fixed singleton, dùng _id = 'main' hoặc ObjectId
  // Company
  companyName: string,
  companyTaxCode: string,
  companyAddress: string,
  companyPhone: string,
  companyEmail: string,
  // Invoice
  invoicePrefix: string,            // default 'HD-'
  quotationPrefix: string,          // default 'BG-'
  defaultDueDays: number,           // default 30
  defaultTaxRate: number,           // default 10 (10%)
  autoTax: boolean,                 // default true
  // Template
  invoiceTemplateHtml: string,      // HTML với {{placeholders}}
  // Audit
  updatedAt: Date,
  updatedBy?: ObjectId,
}
```

**Indexes:** không cần (chỉ 1 document).

**Singleton enforcement:** `SettingsService.get()` query first, nếu không có thì throw "settings not seeded". `SettingsService.update()` chỉ update doc đầu tiên.

---

## 8. Collection: `counters`

Atomic sequence cho invoice/quotation numbering.

```typescript
{
  _id: string,             // 'invoice-2026', 'quotation-2026'
  seq: number,             // 1, 2, 3, ...
  updatedAt: Date,
}
```

**Indexes:** none (`_id` đã unique).

**Usage:** xem `business-rules/financial-formulas.md` F-12 cho code đầy đủ (kèm retry E11000).

**Race condition note:**
- `findOneAndUpdate` với `$inc` trên doc đã tồn tại = **atomic**, không bao giờ trùng seq.
- Khi 2 request đồng thời thử upsert lần đầu (doc chưa tồn tại), 1 trong 2 throw `E11000 duplicate key`. F-12 catch + retry 1 lần.
- **Khuyến nghị:** seed sẵn `{ _id: 'invoice-<currentYear>', seq: 0 }` và `{ _id: 'quotation-<currentYear>', seq: 0 }` để loại bỏ race upsert đầu năm. Đầu năm mới, admin chạy script thêm row năm tiếp theo (hoặc trong seed sau upgrade).

---

## 9. Collection: `sessions`

Managed by `connect-mongo`. Schema do library tự define:

```typescript
{
  _id: string,             // session ID
  expires: Date,
  session: string,         // JSON serialized session data (chứa userId)
}
```

**Indexes:** library tự create `{ expires: 1 }` với TTL.

---

## 10. Quan hệ giữa collections (ER text)

```
users ─┬─ creates ──▶ invoices.createdBy
       ├─ creates ──▶ payments.createdBy
       ├─ creates ──▶ quotations.createdBy
       └─ updates ──▶ settings.updatedBy

customers ──referenced by──▶ invoices.customerId (snapshotted)
                          └▶ quotations.customerId (snapshotted)

products ──optionally ref──▶ invoices.items[].productId (snapshotted)
                          └▶ quotations.items[].productId (snapshotted)

invoices ──ref by──▶ payments.invoiceId
         ──ref by──▶ quotations.convertedInvoiceId (after convert)

settings — standalone, 1 doc
counters — standalone
sessions — managed by connect-mongo
```

## 11. Soft delete pattern

Mọi query trong service tự động add filter `{ deletedAt: null }`:

```typescript
async findAll() {
  return this.model.find({ deletedAt: null })
}

async softDelete(id) {
  return this.model.updateOne({ _id: id }, { deletedAt: new Date() })
}
```

Có thể dùng Mongoose middleware `pre('find')` để tự add filter (recommended để đỡ quên).

Collections có soft-delete: `customers`, `products`, `invoices`, `quotations`.
Collections KHÔNG có: `users` (dùng `status='inactive'`), `payments` (append-only), `settings`, `counters`, `sessions`.

## 12. Backup

`mongodump` mỗi đêm qua cron host:

```bash
0 2 * * * docker exec invoicepro_mongo mongodump --db invoicepro --out /backup/$(date +\%Y\%m\%d)
```

Out of scope MVP detail; team ops setup.

## 13. Migration

MVP không có migration framework (như Prisma Migrate hoặc Mongo MigrateDB).

Lý do: schema thay đổi ít trong MVP. Khi cần đổi:
1. Document thay đổi trong commit message.
2. Viết script `apps/backend/scripts/migrations/YYYY-MM-DD-description.ts` chạy bằng `pnpm migrate`.
3. Migration script là 1 hàm async nhận `MongoClient`, làm thay đổi cần thiết, idempotent.

Khi schema phức tạp hơn → switch sang `migrate-mongo` library.

## 14. Sample documents (cho QA test)

Xem `database/seed-data.md`.

## 15. Out of scope

- ❌ Multi-tenant (không có `tenantId`)
- ❌ Audit log collection
- ❌ Notifications collection
- ❌ File attachments / GridFS
- ❌ Search index server-side (text index Mongo đủ cho MVP)
- ❌ Materialized views / aggregation pipelines phức tạp
- ❌ Sharding key planning
- ❌ Change streams
