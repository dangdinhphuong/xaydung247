# Module — Quotation Management (Quản lý báo giá)

**Source:** `src/app/pages/QuotationManagement.tsx`, `src/app/types.ts:Quotation`, `src/app/data/mockData.ts`.

---

## 1. Purpose
Issue and track sales quotations (price offers) prior to a confirmed sale. A quotation has a validity window and a lifecycle ending in either acceptance (typically converted into an invoice) or rejection / expiry.

## 2. Business description
Customers in the VLXD industry routinely request quotes for project-scale orders before placing the actual purchase. Each quotation is given a code (e.g. `BG-2026-002`), captures line items at agreed prices for a specific validity period, and is tracked until accepted / rejected / expired.

## 3. Actors
ADMIN, ACCOUNTANT, SALES — full CRUD.
VIEWER — read.

## 4. Trigger conditions
- Sidebar → "Báo giá".
- (Recommended) "Convert to Invoice" CTA on accepted quotations.

## 5. Submodules / routes
| Route | Purpose |
|---|---|
| `/quotations` | Quotation list |
| `/quotations/new` *(recommended)* | Create quotation |
| `/quotations/:id` *(recommended)* | Detail / convert / mark sent / mark accepted |

---

## 6. Data model

`Quotation` (see `types.ts`):
```
id, quotationNumber, customerId, customerName, issueDate, validUntil,
status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired',
items: InvoiceItem[], total, notes?
```

> Note: `Quotation` shares the `InvoiceItem` shape (productId/qty/unitPrice/discount/lineTotal). It does NOT carry tax / shipping / discount at the document level — pricing is a single `total`. Reconcile with business if VAT-bearing quotes are required.

---

## 7. Status lifecycle

| Status | Label | Pill | Meaning |
|---|---|---|---|
| `draft` | Nháp | grey | Editable, not communicated to customer |
| `sent` | Đã gửi | blue | Communicated; awaiting response |
| `accepted` | Đã chấp nhận | green | Customer confirmed → eligible for conversion to invoice |
| `rejected` | Đã từ chối | red | Customer declined |
| `expired` | Hết hạn | orange | `validUntil < today` and no acceptance |

See `workflows/approval-workflow.md` for the diagram.

---

## 8. List view

### 8.1 Columns
| Column | Meaning | Sortable | Filterable | Searchable | Visibility |
|---|---|---|---|---|---|
| Mã báo giá | `quotationNumber` | (rec.) | — | ✅ | always |
| Khách hàng | `customerName` | (rec.) | — | ✅ | always |
| Ngày tạo | `issueDate` | (rec.) | — | — | always |
| Hiệu lực đến | `validUntil` | (rec.) | — | — | always |
| Tổng tiền | `total` | (rec.) | — | — | always |
| Trạng thái | `status` badge | — | (rec.) | — | always |
| Thao tác | view / edit | — | — | — | always |

### 8.2 Empty state
"Không tìm thấy báo giá nào".

### 8.3 Search
Free text against `quotationNumber` and `customerName` (case-insensitive).

---

## 9. Create / Edit form (recommended)

| Field | Type | Required | Validation | Default | Editable | Business meaning |
|---|---|---|---|---|---|---|
| customerId | select | Yes | exists | — | Yes | Buyer |
| issueDate | date | Yes | — | today | Yes | Document date |
| validUntil | date | Yes | `> issueDate` | today + 30 days | Yes | Offer validity |
| notes | textarea | No | ≤ 1000 chars | — | Yes | Terms / conditions |
| items[] | repeatable | Yes | ≥ 1 item | — | Yes | See line-item rules below |

Line item: identical to invoice (`productId`, `quantity > 0`, `unitPrice > 0`, `discount ≥ 0`, computed `lineTotal`).

Submission paths:
- "Lưu nháp" → `status='draft'`.
- "Tạo & gửi" → `status='sent'` (and recommended email send).

---

## 10. Business rules

| ID | Rule |
|---|---|
| BR-Q-01 | A quotation MUST have at least one line item before it can move past `draft`. |
| BR-Q-02 | `validUntil` MUST be ≥ `issueDate`. |
| BR-Q-03 | A quotation in `sent` status automatically transitions to `expired` when `validUntil < today` (recommended nightly job + on-read evaluation, mirroring `updateOverdueStatuses` pattern). |
| BR-Q-04 | A quotation in `accepted` status MAY be converted into an invoice; on conversion, line items are copied verbatim and the quotation is locked (not editable). |
| BR-Q-05 | Once `accepted` or `rejected`, a quotation cannot be re-sent — it must be **cloned** to a new draft. |
| BR-Q-06 | Quotation number format (inferred from seed `BG-2026-002`) = `'BG-' + YYYY + '-' + 3-digit seq` per year, configurable in Settings. |
| BR-Q-07 | Customer name is snapshot-copied at issue time (consistent with invoices). |

---

## 11. Validation rules

| Code | Trigger | Message |
|---|---|---|
| V-Q-01 | No customer | "Vui lòng chọn khách hàng" |
| V-Q-02 | Validity ≤ issue date | "Ngày hết hiệu lực phải lớn hơn ngày tạo" |
| V-Q-03 | No line items | "Vui lòng thêm ít nhất một sản phẩm" |
| V-Q-04 | Invalid line | "Vui lòng điền đầy đủ thông tin sản phẩm" |

---

## 12. UI behaviors

- Status badge colours hard-coded in `statusConfig`:
  - draft: `bg-gray-100 text-gray-700`
  - sent: `bg-blue-100 text-blue-700`
  - accepted: `bg-green-100 text-green-700`
  - rejected: `bg-red-100 text-red-700`
  - expired: `bg-orange-100 text-orange-700`
- Quotation number rendered in primary blue (`#1E88E5`).

---

## 13. API contract (recommended)

| Verb | Path | Body | Response |
|---|---|---|---|
| GET    | `/api/quotations?search=&status=` | — | `Quotation[]` |
| GET    | `/api/quotations/:id` | — | `Quotation` |
| POST   | `/api/quotations` | full body | `Quotation` |
| PUT    | `/api/quotations/:id` | partial (only when `draft`) | `Quotation` |
| POST   | `/api/quotations/:id/send` | — | `Quotation` (status → sent) |
| POST   | `/api/quotations/:id/accept` | — | `Quotation` |
| POST   | `/api/quotations/:id/reject` | `{reason?}` | `Quotation` |
| POST   | `/api/quotations/:id/convert` | — | `Invoice` (status='unpaid'); quotation locked |

---

## 14. Permission rules
See `roles/roles-and-permissions.md`.

## 15. Notifications (recommended)
- On send → email customer with quotation PDF.
- On accept / reject by customer (via signed link) → notify sales owner.
- On `expired` flip → notify owner.

## 16. Audit log (recommended)
`quotation.create`, `quotation.update`, `quotation.send`, `quotation.accept`, `quotation.reject`, `quotation.expire`, `quotation.convert`.

## 17. Edge cases
- A customer might accept a quotation **after** expiry — business decision: revive (`expired → sent → accepted`) or require a new quote? Default: require new quote.
- Converting the same accepted quotation twice → reject; the conversion endpoint MUST be idempotent and store `convertedInvoiceId`.
