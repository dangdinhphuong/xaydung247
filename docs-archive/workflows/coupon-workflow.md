# Workflow — Discount Handling (No Coupon Engine in this build)

> The product **does not implement a coupon / promo-code engine**. Discount is modelled as a **per-line absolute VND amount** plus an **invoice-level absolute VND amount**. This document captures (a) how discounts work today and (b) a recommended coupon-workflow design for the production roadmap.

---

## 1. Current discount workflow (as implemented)

### 1.1 Line-level discount
- Field: `InvoiceItem.discount: number` (VND, absolute).
- Source: manually entered by the user in `CreateInvoice.tsx` "Giảm giá" column.
- Computation: `lineTotal = quantity × unitPrice − discount`.
- Validation: HTML `min="0"`; no upper bound. Negative line totals are NOT blocked client-side.

### 1.2 Invoice-level discount
- Field: `Invoice.discount: number` (VND, absolute).
- Source: manual entry in the "Giảm giá" input on the summary card.
- Computation: `total = subtotal − discount + tax + shipping`.

### 1.3 Visibility
- In detail view, the "Giảm giá" row in the totals breakdown is hidden when value = 0.
- In template renderings, `TotalsBlock.showDiscount` controls whether the row appears on the printed invoice.

### 1.4 Business rules

| ID | Rule |
|---|---|
| BR-DISC-01 | Discounts are **always absolute VND**, never percentages, in the current model. |
| BR-DISC-02 | Line-level discount is the seller's manual concession on that line. |
| BR-DISC-03 | Invoice-level discount is applied **after** tax-base subtotal (i.e. before tax is added). Verify whether this matches Vietnamese VAT practice (it currently does: `total = subtotal − discount + tax + shipping`; if tax must be computed on the **discounted** subtotal, document this is the de-facto behavior). |
| BR-DISC-04 | Tax is **entered as an amount**, not derived from `taxRate`. The Settings page has a `taxRate` field that is NOT wired into create-invoice — gap to close. |

### 1.5 Recommended validations (production)

| Code | Trigger | Message |
|---|---|---|
| V-DISC-01 | `line.discount > line.quantity × line.unitPrice` | "Giảm giá vượt quá thành tiền" |
| V-DISC-02 | `invoice.discount > invoice.subtotal` | "Giảm giá vượt quá tạm tính" |
| V-DISC-03 | `invoice.discount < 0` | "Giảm giá không hợp lệ" |

---

## 2. Recommended coupon engine (future)

If the business wants codifiable promotions later:

### 2.1 Entities

| Entity | Purpose |
|---|---|
| `coupons` | Definition of a promotion: code, type, value, validity window, usage limits, eligibility. |
| `coupon_redemptions` | Append-only ledger of every redemption: coupon_id, invoice_id, customer_id, applied_amount, redeemed_at, user_id. |

### 2.2 Coupon definition fields

| Field | Type | Notes |
|---|---|---|
| code | string | Customer-visible (e.g. `TET2026`) |
| name | string | Internal label |
| type | enum | `percentage` (0–100), `fixed` (VND), `free-shipping` |
| value | number | depends on type |
| min_invoice_amount | number | Eligibility floor |
| valid_from, valid_to | date | Validity window |
| usage_limit_total | int | Global cap |
| usage_limit_per_customer | int | Per-customer cap |
| eligible_customer_ids | uuid[] | NULL = all |
| eligible_product_ids | uuid[] | NULL = all |
| status | enum | `draft`, `active`, `paused`, `expired` |

### 2.3 Lifecycle

```
draft ──publish──▶ active ──pause──▶ paused ──resume──▶ active
                       │                                   │
                       └──── valid_to passed ──────────────┘
                                       │
                                       ▼
                                    expired (terminal)
```

### 2.4 Apply-at-create workflow
1. User enters / picks a coupon code on `CreateInvoice`.
2. Server validates: code exists, status=`active`, today in `[valid_from, valid_to]`, eligible customer, eligible products in cart, min_invoice_amount met, usage limits not exhausted.
3. Compute discount amount: `percentage` → `subtotal × value/100`, `fixed` → `min(value, subtotal)`, `free-shipping` → `shipping=0`.
4. Apply to invoice; record `coupon_redemptions` row.
5. Lock the redemption when invoice transitions out of `draft`.

### 2.5 Validation messages

| Code | Trigger | Message |
|---|---|---|
| V-CPN-01 | Code not found | "Mã không tồn tại" |
| V-CPN-02 | Code expired | "Mã đã hết hạn" |
| V-CPN-03 | Not yet active | "Mã chưa có hiệu lực" |
| V-CPN-04 | Below min amount | "Đơn hàng chưa đạt giá trị tối thiểu" |
| V-CPN-05 | Customer not eligible | "Khách hàng không thuộc nhóm áp dụng" |
| V-CPN-06 | Usage limit reached | "Mã đã hết lượt sử dụng" |
| V-CPN-07 | Per-customer limit reached | "Bạn đã sử dụng hết lượt cho mã này" |

### 2.6 Permission rules
- ADMIN: full CRUD on coupons.
- ACCOUNTANT / SALES: apply existing coupons at create time.
- VIEWER: read coupons.

### 2.7 Reporting
- Redemptions per coupon (count, total discount given, net revenue).
- Top redeemed coupons.
- Forecast vs. actual coupon spend.

---

## 3. Until the coupon engine is built

The line-level and invoice-level absolute-VND discount inputs serve as the primary mechanism for any promotional / negotiated concession. Document each concession in the invoice `notes` field for audit clarity (recommend a structured prefix like `KM:` for promotion-driven discounts).
