# Workflow — Invoice (Order) Lifecycle

> "Order" in this product = **Invoice**. There is no separate sales-order entity.

**Sources:** `src/app/data/store.ts:calculateStatus / updateOverdueStatuses / addPayment`, `src/app/utils/invoiceCalculations.ts`, `src/app/pages/CreateInvoice.tsx`, `src/app/pages/InvoiceDetail.tsx`.

---

## 1. Status state machine

```
                    ┌──────────┐
   "Lưu nháp"  ───▶│  draft   │
                    └─────┬────┘
                          │ (optional) Finalize → unpaid
                          ▼
                    ┌──────────┐                          past due?
   "Tạo hóa đơn"──▶│  unpaid  │────────────────────────────────┐
                    └─────┬────┘                                │
                          │ payment recorded (amount < total)   │
                          ▼                                     ▼
                    ┌──────────┐  past due?            ┌──────────┐
                    │ partial  │────────────────────▶ │ overdue  │
                    └─────┬────┘                       └─────┬────┘
                          │ payment(s) close balance         │ payment(s) close balance
                          ▼                                  ▼
                    ┌──────────┐                       ┌──────────┐
                    │   paid   │ ◀──────────────────── │   paid   │
                    └──────────┘                       └──────────┘
                       (terminal)
```

Computed by `calculateStatus(total, paidAmount, dueDate, isDraft)`:
- `isDraft` → `draft`
- `remaining ≤ 0` → `paid`
- `paidAmount > 0 && remaining > 0` → `overdue` if past due else `partial`
- else `overdue` if past due else `unpaid`

`updateOverdueStatuses()` runs on every read and flips eligible invoices to `overdue` (it does not currently flip them back to `partial`/`unpaid` even after a payment, because `calculateStatus` is the authority — verify in the actual code path).

---

## 2. Allowed transitions

| From | To | Trigger | Guard |
|---|---|---|---|
| (none) | draft | "Lưu nháp" submit | passes V-CI-01..04 |
| (none) | unpaid | "Tạo hóa đơn" submit | passes V-CI-01..04 |
| draft | unpaid | Finalize action (recommended) | items.length ≥ 1 |
| unpaid | partial | payment.add with amount < remaining | not past due |
| unpaid | paid | payment.add with amount ≥ remaining | — |
| unpaid | overdue | system clock crosses `dueDate` while remaining > 0 | — |
| partial | paid | payment closes balance | — |
| partial | overdue | clock crosses dueDate | — |
| overdue | partial | (NOT supported by current `calculateStatus` — stays overdue while paid > 0) | — |
| overdue | paid | payment closes balance | — |
| paid | * | (none) | terminal |

> **Recommended additional states** for production: `void` (cancellation), `disputed` (customer challenged), `written-off` (uncollectable).

---

## 3. Create-invoice workflow (sequence)

1. User → `/invoices/create`.
2. UI initialises:
   - `issueDate = today`
   - `dueDate = today + 30 days`
   - `items = []`, `discount/tax/shipping = 0`.
3. User picks customer → blue info panel shows phone / address / taxCode.
4. User clicks "Thêm sản phẩm" → row appended.
5. User selects product (`updateItem('productId', value)` triggers auto-fill of `productName` and `unitPrice`).
6. User edits `quantity`, `discount`. `lineTotal = qty × price − discount` is recomputed on every keystroke.
7. (Loop step 4–6 for each line item.)
8. User edits invoice-level `discount`, `tax`, `shipping`. `total = Σ lineTotal − discount + tax + shipping` recomputed live.
9. User chooses:
   - **Lưu nháp** → `handleSubmit('draft')`.
   - **Tạo hóa đơn** → `handleSubmit('unpaid')`.
10. `handleSubmit`:
    - Validates V-CI-01..04 (toast.error on failure).
    - Resolves customer object; clones name/phone/address into the invoice.
    - Generates `invoiceNumber` (see BR-CI-04 in `modules/orders.md` for the bug).
    - Creates `Invoice` object with `paidAmount=0, remainingBalance=total, payments=[]`.
    - `store.addInvoice` (unshifts to head of array).
    - toast.success → navigate `/invoices/:id`.

---

## 4. Add-payment workflow (sequence)

1. User opens invoice detail.
2. CTA visible only when `remainingBalance > 0 && status !== 'draft'`.
3. Click → `PaymentModal` opens.
4. Defaults: `amount=''`, `paymentDate=today`, `method='cash'`, `reference=''`, `note=''`.
5. User fills `amount` (and `reference` for bank transfers).
6. Submit → validation V-PAY-01/02.
7. `onSubmit` → `InvoiceDetail.handleAddPayment` constructs `{id: 'PAY'+Date.now(), invoiceId, ...payment}` → `store.addPayment(newPayment)`.
8. `store.addPayment`:
   - Pushes to `payments[]`.
   - `newPaidAmount = old + amount`.
   - `newRemainingBalance = total − newPaidAmount`.
   - `newStatus = calculateStatus(total, newPaidAmount, dueDate)`.
   - `store.updateInvoice(..., {paidAmount, remainingBalance, status, payments: [...old, new]})`.
9. Detail page re-reads invoice via `store.getInvoice(id)` and re-renders.
10. toast.success "Thêm thanh toán thành công!".

---

## 5. Overdue auto-evaluation

- Trigger: `store.getInvoices()` and `store.getInvoice(id)` both call `updateOverdueStatuses()`.
- Logic: for every invoice with `remainingBalance > 0 && status !== 'draft'`, recompute status with `calculateStatus`. If different, write the new status in place.
- Time comparison: both `dueDate` and `today` are zeroed to local midnight (`setHours(0,0,0,0)`); strict `<` comparison — **due today is NOT overdue**.

---

## 6. Recommended additions

| ID | Recommendation |
|---|---|
| WF-INV-R-01 | Add explicit `void` transition. Only ADMIN; archive original; emit audit event. |
| WF-INV-R-02 | Add server-side nightly cron `fn_recompute_overdue()` for offline correctness. |
| WF-INV-R-03 | Add `editable` guard: once invoice is `partial`/`paid`, line items become read-only (only notes/dates editable). |
| WF-INV-R-04 | Add stock decrement on `unpaid` transition (configurable per business). |
| WF-INV-R-05 | Add "Send to customer" action (email PDF) once finalised. |
