# Status Lifecycle — MVP v1

> State machine cho Invoice và Quotation. Backend service enforce; frontend chỉ hiển thị.

---

## 1. Invoice state machine

```
                                   (admin)
                            ┌──── void ◀──── any non-paid status
                            │
                            ▼
   (none) ──create draft──▶ draft ──finalize──▶ unpaid ──┬──payment(partial)──▶ partial ──payment(full)──▶ paid
                                                          │                                                ▲
                                                          └──payment(full)──────────────────────────────────┘

   isOverdue (derived): status ∈ {unpaid, partial} AND remainingBalance > 0 AND dueDate < today
```

---

## 2. Invoice — transition matrix

| From \ To | draft | unpaid | partial | paid | void |
|---|:---:|:---:|:---:|:---:|:---:|
| (none) | ✓ create with `status='draft'` | ✓ create with `status='unpaid'` (direct issue) | ✗ | ✗ | ✗ |
| draft | (no self-transition) | ✓ via `POST /invoices/:id/finalize` (allocate invoice number) | ✗ | ✗ | ✓ ADMIN only (rarely needed; usually delete the draft) |
| unpaid | ✗ | (no self) | ✓ via payment with amount < remaining | ✓ via payment with amount = remaining | ✓ ADMIN |
| partial | ✗ | ✗ | (no self — additional payment, status unchanged) | ✓ via payment closing balance | ✓ ADMIN |
| paid | ✗ | ✗ | ✗ | (terminal) | ✗ — không có refund trong MVP |
| void | ✗ | ✗ | ✗ | ✗ | (terminal) |

### Notes

- Number allocation: chỉ khi rời `draft` (finalize hoặc create-as-unpaid).
- Voided invoice giữ nguyên số.
- `paid` là terminal. Muốn sửa → ADMIN delete (soft) và tạo invoice mới.

---

## 3. Invoice — isOverdue flag

`isOverdue` là derived boolean, **không lưu trong DB**, tính tại read-time bởi backend service.

```typescript
isOverdue = (status === 'unpaid' || status === 'partial')
         && remainingBalance > 0
         && dueDate < today
```

Strict `<`: due hôm nay KHÔNG overdue.

| status | Có thể isOverdue? |
|---|---|
| draft | NO |
| unpaid | YES nếu dueDate < today |
| partial | YES |
| paid | NO |
| void | NO |

FE StatusBadge hiển thị label combined:

| status | isOverdue | Label (vi) | Pill colour |
|---|---|---|---|
| draft | — | "Nháp" | grey |
| unpaid | false | "Chưa thanh toán" | red-soft |
| unpaid | true | "Chưa thanh toán · Quá hạn" | red-strong |
| partial | false | "Thanh toán một phần" | orange |
| partial | true | "Thanh toán một phần · Quá hạn" | orange + red dot |
| paid | — | "Đã thanh toán" | green |
| void | — | "Đã huỷ" | grey-strike |

---

## 4. Invoice — action matrix

| Action | draft | unpaid | partial | paid | void |
|---|:---:|:---:|:---:|:---:|:---:|
| Xem | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sửa header (notes, dates) | ✓ | ✓ ACCOUNTANT/ADMIN | ✓ ACCOUNTANT/ADMIN | ✗ | ✗ |
| Sửa items | ✓ | ✗ (422) | ✗ (422) | ✗ | ✗ |
| Finalize | ✓ → unpaid | ✗ | ✗ | ✗ | ✗ |
| Add payment | ✗ (422) | ✓ | ✓ | ✗ (422) | ✗ |
| In | ✓ (in "BẢN NHÁP") | ✓ | ✓ | ✓ | ✓ (in "ĐÃ HUỶ") |
| Void | ✓ ADMIN | ✓ ADMIN | ✓ ADMIN | ✗ | ✗ |
| Soft delete | ✓ ADMIN | ✗ — dùng void | ✗ | ✗ | ✓ cleanup |

---

## 5. Quotation state machine

```
                                                        clone (tạo draft mới)
                                                  ┌────────────────────────────┐
                                                  │                            │
                                                  ▼                            │
   (none) ──create──▶ draft ──send──▶ sent ──accept──▶ accepted ──convert──┐   │
                                       │                                    ▼   │
                                       ├──reject──▶ rejected (terminal)  invoice tạo
                                       │                                  (status='unpaid')
                                       │                                  quotation lock
                                       └─ validUntil < today (derived) ──▶ isExpired = true
                                                                          (status vẫn 'sent')
```

---

## 6. Quotation — transition matrix

| From \ To | draft | sent | accepted | rejected |
|---|:---:|:---:|:---:|:---:|
| (none) | ✓ | ✗ | ✗ | ✗ |
| draft | (no self) | ✓ (allocate number) | ✗ | ✗ |
| sent | ✗ | (no self) | ✓ | ✓ |
| accepted | ✗ | ✗ | (no self — convert sets `convertedInvoiceId` nhưng status vẫn `accepted`) | ✗ |
| rejected | ✗ | ✗ | ✗ | (terminal) |

`expired` **không** là status value — là derived `isExpired` boolean.

---

## 7. Quotation — isExpired flag

```typescript
isExpired = (status === 'sent') && (validUntil < today)
```

| Status | Có thể isExpired? |
|---|---|
| draft | NO |
| sent | YES nếu validUntil < today |
| accepted | NO |
| rejected | NO |

Khi customer/sales attempt accept quotation đã expired → service trả 422 với mã `DOMAIN-QUOTE-EXPIRED`.

---

## 8. Quotation — action matrix

| Action | draft | sent (!expired) | sent (expired) | accepted | rejected |
|---|:---:|:---:|:---:|:---:|:---:|
| Sửa | ✓ | ✗ (422) | ✗ | ✗ | ✗ |
| Send | ✓ | (no — đã sent) | ✗ | ✗ | ✗ |
| Accept | ✗ | ✓ | ✗ (422) | (no) | ✗ |
| Reject | ✗ | ✓ | ✗ | ✗ | (no) |
| Clone | ✓ | ✓ | ✓ | ✓ | ✓ |
| Convert | ✗ | ✗ | ✗ | ✓ nếu `convertedInvoiceId IS NULL` | ✗ |
| Delete | ✓ ADMIN | ✗ | ✗ | ✗ | ✗ |

---

## 9. Forbidden transitions (server enforce, trả 422)

Service throw `BadRequestException` hoặc custom `DomainException`:

- `paid → anything` (except trong cùng paid) — không có refund
- `void → anything`
- `rejected → anything`
- `accepted → anything` (other than convert)
- `draft → partial | paid` (phải finalize trước)
- Add payment khi status là draft / void / paid

---

## 10. Invariants tied to status (test trong Jest)

| ID | Invariant |
|---|---|
| INV-S-1 | `status='paid' → remainingBalance = 0` |
| INV-S-2 | `status='partial' → 0 < paidAmount < total AND remainingBalance > 0` |
| INV-S-3 | `status='unpaid' → paidAmount = 0 AND remainingBalance = total` |
| INV-S-4 | `status='draft' → invoiceNumber IS NULL AND paidAmount = 0` |
| INV-S-5 | `status='void' → remainingBalance = 0` |
| INV-S-6 | `quotation.convertedInvoiceId IS NOT NULL → quotation.status = 'accepted'` |

---

## 11. Examples

### 11.1 Khách trả 2 đợt
```
draft → finalize → unpaid                    (cấp số HD-2026-001)
unpaid → addPayment(15M) → partial           (paid=15M, remaining=30M)
partial → addPayment(30M) → paid             (paid=45M, remaining=0, terminal)
```

### 11.2 Quá hạn không thanh toán
```
unpaid (issue 2026-04-01, due 2026-05-01, isOverdue=false)
→ today=2026-05-02 → unpaid (isOverdue=true, computed at read time)
```

Status không đổi. UI badge đổi từ "Chưa thanh toán" sang "Chưa thanh toán · Quá hạn".

### 11.3 Thanh toán một phần khi đã quá hạn
```
unpaid (due 2026-04-15) → today=2026-04-16 → unpaid + isOverdue=true
→ addPayment(10M) → partial + isOverdue=true
```

UI: "Thanh toán một phần · Quá hạn".

### 11.4 Admin huỷ hoá đơn đã thanh toán một phần
```
partial (paid=15M, remaining=30M)
→ POST /invoices/:id/void { reason: 'Huỷ theo yêu cầu khách' }
→ void (status='void', remainingBalance=0, paidAmount giữ nguyên 15M)
```

Note: payment cũ KHÔNG bị xoá. Audit ghi nhận qua console log (MVP không có audit DB).

### 11.5 Quotation expire rồi customer muốn chấp nhận
```
sent (validUntil=2026-05-18)
→ today=2026-05-20 → sent + isExpired=true
→ POST /quotations/:id/accept → 422 DOMAIN-QUOTE-EXPIRED
→ Sales clone → new draft → sửa → send mới
```

---

## 12. Cross-references

- `business-rules/canonical-rules.md` — CR-S-*, CR-Q-*, CR-OVR-* định nghĩa rule
- `business-rules/financial-formulas.md` — F-9 (calculateStatus), F-8 (isOverdue), F-10 (isExpired)
- `database/mongodb-schema.md` — `status` enum trên invoices/quotations
- `api/invoices.md`, `api/quotations.md` — endpoints drive các transitions
