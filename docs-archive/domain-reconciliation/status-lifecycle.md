# Status Lifecycle — Canonical State Machines

> **SINGLE SOURCE OF TRUTH for every status transition in Invoice Pro.** This file defines the canonical state machines for invoices and quotations. Every backend service, frontend badge, audit-log producer, and report MUST conform.

**Status enums fixed by this document** — adding a value requires a new ADR.

- `Invoice.status ∈ { draft | unpaid | partial | paid | void }`
- `Invoice.isOverdue ∈ { true | false }` — **derived flag**, NOT part of status (resolves RULE-004 / CR-S-02).
- `Quotation.status ∈ { draft | sent | accepted | rejected | expired }`

---

## 1. Invoice state machine

```
                                       (admin)
                                  ┌───── void ◀─── any non-paid status
                                  │
                                  │ (admin void)
                                  ▼
                  ┌────────────────────────────────────────┐
   (none) ──draft create──▶  draft  ───finalize──▶  unpaid  ────────────────────────┐
                                                       │                            │
                                       (none) ──direct create──▶                    │
                                                       │                            │
                                                       │ payment (partial)          │ payment (full)
                                                       ▼                            ▼
                                                    partial ───── payment (full) ─▶ paid (terminal)
                                                       │
                                                       │ (admin void)               (admin void allowed)
                                                       ▼                            (FORBIDDEN once paid;
                                                      void                           use refund flow — v2)

   Derived flag (NOT a status):  isOverdue = (status ∈ {unpaid, partial})
                                             AND remaining_balance > 0
                                             AND due_date < today_tenant_tz
```

---

## 2. Invoice — transition matrix

Legend:
- ✓ = allowed
- ✗ = forbidden (server returns 422)
- Cell value = trigger / permission token / audit action.

| From \ To | draft | unpaid | partial | paid | void |
|---|:---:|:---:|:---:|:---:|:---:|
| **(none)** | ✓ `Invoice:create:draft` · audit `invoice.create` | ✓ `Invoice:create:final` · audit `invoice.create` + number allocation | ✗ | ✗ | ✗ |
| **draft** | (no self-transition) | ✓ `Invoice:create:final` via finalize endpoint · audit `invoice.finalize` + number allocation | ✗ (must go through unpaid first) | ✗ | ✓ ADMIN `Invoice:void` · audit `invoice.void` |
| **unpaid** | ✗ | (no self) | ✓ via `Payment:create` with `amount < remainingBalance` · audit `payment.create` + `invoice.status_change` | ✓ via `Payment:create` with `amount ≥ remainingBalance` (single payment closes) · audit `payment.create` + `invoice.status_change` | ✓ ADMIN — emits reversal payments to zero out the receivable |
| **partial** | ✗ | ✗ | (no self — additional partial payment keeps status; only `paid_amount` and `remaining_balance` change) | ✓ via `Payment:create` closing balance · audit `payment.create` + `invoice.status_change` | ✓ ADMIN — emits reversal payments |
| **paid** | ✗ | ✗ | ✗ | (terminal) | ✗ — once paid, must use a future `refund` flow (out of scope v1) |
| **void** | ✗ | ✗ | ✗ | ✗ | (terminal) |

### 2.1 Notes

- **Single-payment close:** `unpaid → paid` is possible without passing through `partial` if the very first payment closes the balance.
- **Status function:** all transitions above use `calculateStatus(total, paidAmount, isDraft, isVoid)` defined in `financial-formulas.md` F-18.
- **Atomicity:** payment INSERT + invoice UPDATE (`paid_amount`, `remaining_balance`, `status`) + audit row are one transaction.
- **Concurrency:** payment service takes a row-level lock (`SELECT … FOR UPDATE`) on the invoice row to serialize concurrent payments.
- **Number allocation:** happens on first transition out of `draft` (i.e. finalize or direct create as `unpaid`). Drafts have `invoice_number IS NULL` (CR-NUM-06).

---

## 3. Invoice — isOverdue flag

The `isOverdue` boolean is **independent of status**:

```
isOverdue = (status IN ('unpaid','partial'))
            AND (remaining_balance > 0)
            AND (due_date < today_tenant_tz)
```

| Status | Can isOverdue = true? | Comment |
|---|---|---|
| draft | NO | Drafts are not receivables. |
| unpaid | YES | If past due. |
| partial | YES | If past due — does NOT collapse into a separate "overdue" status. |
| paid | NO | |
| void | NO | |

### 3.1 When is isOverdue evaluated?

| Moment | Behaviour |
|---|---|
| On every `GET /invoices`, `GET /invoices/:id`, `GET /debts/*`, `GET /dashboard/summary` | Live recompute in SQL using `today_tenant_tz`. |
| Nightly cron at 00:05 Asia/Ho_Chi_Minh | `UPDATE invoices SET is_overdue_cached = ... WHERE ...`. For every row whose cached value changes, emit `invoice.status_change` audit row with `cause_json = {type:'cron.overdue_scan'}`. |
| On `payment.create` that closes balance | `isOverdue` becomes false; emit audit. |
| On `invoice.void` | `isOverdue` becomes false; emit audit. |

### 3.2 UI surface

`StatusBadge` renders one of these combined labels:

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

## 4. Invoice — allowed action matrix

| Action | draft | unpaid | partial | paid | void |
|---|:---:|:---:|:---:|:---:|:---:|
| View / read | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit header (notes, dates) | ✓ | ✓ (ACCOUNTANT, ADMIN) | ✓ (ACCOUNTANT, ADMIN) | ✗ | ✗ |
| Edit items (add/remove/change) | ✓ | ✗ — 422 `DOMAIN-LINES-LOCKED` | ✗ | ✗ | ✗ |
| Finalize | ✓ → unpaid | ✗ | ✗ | ✗ | ✗ |
| Add payment | ✗ — 422 `DOMAIN-DRAFT-PAYMENT` | ✓ | ✓ | ✗ — 422 `DOMAIN-PAID-PAYMENT` | ✗ |
| Print / PDF | ✓ (marks "BẢN NHÁP") | ✓ | ✓ | ✓ | ✓ (marks "ĐÃ HUỶ") |
| Void (ADMIN) | ✓ (rarely used; usually just delete the draft) | ✓ | ✓ | ✗ — use refund (v2) | ✗ |
| Soft delete | ✓ (ADMIN) | ✗ — only via void | ✗ | ✗ | ✓ (cleanup) |
| Convert from quotation → produces this invoice | always starts as `unpaid` | n/a | n/a | n/a | n/a |

---

## 5. Quotation state machine

```
                                                           (clone any non-draft → new draft)
                                                          ┌────────────────────────────┐
                                                          │                            │
                                                          ▼                            │
   (none) ──create──▶  draft  ────send────▶  sent  ─────────accept──────▶  accepted ───┘
                       │       (number       │                                  │
                       │        allocated)   │                                  │
                       │                     ├─ reject ─▶ rejected (terminal)   │
                       │                     │                                  │ convert (idempotent)
                       │                     └─ valid_until < today ─▶ expired  │ — sets converted_invoice_id
                       │                                            (terminal)  │ — quotation stays 'accepted',
                       │                                                        │   locked from edits
                       │ delete (only when draft)                               ▼
                       └───────────────────────────────────────────▶ new invoice (status='unpaid')
```

---

## 6. Quotation — transition matrix

| From \ To | draft | sent | accepted | rejected | expired |
|---|:---:|:---:|:---:|:---:|:---:|
| **(none)** | ✓ `Quotation:create` · audit `quotation.create` | ✗ | ✗ | ✗ | ✗ |
| **draft** | (no self) | ✓ `Quotation:send` · allocates number · audit `quotation.send` | ✗ | ✗ | ✗ |
| **sent** | ✗ | (no self) | ✓ `Quotation:accept` · audit `quotation.accept` | ✓ `Quotation:reject` · audit `quotation.reject` | ✓ system via cron OR on-read · audit `quotation.expire` |
| **accepted** | ✗ | ✗ | (no self — `converted_invoice_id` set on conversion but status stays `accepted`) | ✗ | ✗ |
| **rejected** | ✗ | ✗ | ✗ | (terminal) | ✗ |
| **expired** | ✗ | ✗ | ✗ — must clone to draft and resend | ✗ | (terminal) |

Clone action (any non-draft → new draft) is `Quotation:create` and is **not** a state transition of the original.

---

## 7. Quotation — allowed action matrix

| Action | draft | sent | accepted | rejected | expired |
|---|:---:|:---:|:---:|:---:|:---:|
| Edit | ✓ | ✗ — 422 `DOMAIN-QUOTE-LOCKED` | ✗ | ✗ | ✗ |
| Send | ✓ | (no — already sent) | ✗ | ✗ | ✗ |
| Accept | ✗ | ✓ | (no) | ✗ | ✗ |
| Reject | ✗ | ✓ | ✗ | (no) | ✗ |
| Clone | ✓ | ✓ | ✓ | ✓ | ✓ |
| Convert | ✗ | ✗ | ✓ if `converted_invoice_id IS NULL` (idempotent) | ✗ | ✗ |
| Delete | ✓ (ADMIN, only when draft) | ✗ | ✗ | ✗ | ✗ |

---

## 8. Quotation — expiry rule

```
isExpired(quotation) = (status = 'sent') AND (valid_until < today_tenant_tz)
```

- Strict `<`. A quotation valid through today is NOT expired today.
- Nightly cron at 00:05 Asia/Ho_Chi_Minh flips `sent → expired` for all matches.
- `GET /quotations`, `GET /quotations/:id` also opportunistically perform the same update.
- Once expired, accepting requires the customer to request a clone.

---

## 9. State transitions to audit (canonical event names)

| Event | Trigger | Payload (cause_json) |
|---|---|---|
| `invoice.create` | POST /invoices | none / `{from_quotation_id}` if from convert |
| `invoice.update` | PATCH /invoices/:id | before/after diff |
| `invoice.finalize` | POST /invoices/:id/finalize | `{allocated_number}` |
| `invoice.status_change` | payment commits OR cron flips overdue cache | `{type: 'payment.create' | 'cron.overdue_scan' | 'invoice.void', payment_id?}` |
| `invoice.void` | POST /invoices/:id/void | `{reason, reversed_payment_ids[]}` |
| `invoice.delete` | DELETE /invoices/:id | none |
| `payment.create` | POST /invoices/:id/payments | `{payment_id, amount, method}` |
| `quotation.create` | POST /quotations | none |
| `quotation.update` | PATCH /quotations/:id | before/after diff |
| `quotation.send` | POST /quotations/:id/send | `{allocated_number, email_to?}` |
| `quotation.accept` | POST /quotations/:id/accept | `{accepted_by: 'admin' | 'customer_via_public_link'}` |
| `quotation.reject` | POST /quotations/:id/reject | `{reason?}` |
| `quotation.expire` | system (cron / on-read) | `{trigger: 'cron' | 'on_read'}` |
| `quotation.convert` | POST /quotations/:id/convert | `{invoice_id}` |
| `quotation.clone` | POST /quotations/:id/clone | `{new_quotation_id}` |

---

## 10. Combined-label rendering rules (frontend)

The StatusBadge component is the **only** UI surface that renders status. It accepts `(status, isOverdue)` and looks up the row in §3.2. Other components MUST NOT render their own status strings — colours and labels are centralised here to avoid drift (resolves RULE-016).

```ts
interface StatusBadgeProps {
  status:    'draft'|'unpaid'|'partial'|'paid'|'void';
  isOverdue: boolean;
  variant?:  'invoice'|'quotation';  // default 'invoice'
}
```

For quotations, the props collapse to a single `status` value (no isOverdue) and the label map is:

| status | Label (vi) | Colour |
|---|---|---|
| draft | Nháp | grey |
| sent | Đã gửi | blue |
| accepted | Đã chấp nhận | green |
| rejected | Đã từ chối | red |
| expired | Hết hạn | orange |

---

## 11. Forbidden transitions (server must reject with 422)

The server MUST enforce these regardless of FE state:

- `paid → anything` except `paid` (i.e. nothing — already terminal).
- `void → anything`.
- `rejected → anything`.
- `expired → anything` except via clone (which is a new entity).
- `draft → partial | paid` skipping `unpaid` (must finalize first; payment-on-draft forbidden).
- `accepted → rejected` (customer changed mind: operator must clone & re-send).
- Any transition initiated by a role that lacks the required permission token (see §2 matrix).
- Any transition where `If-Match` precondition fails (409 `CONFLICT-VERSION`).

---

## 12. Invariants tied to status (test in CI)

| ID | Invariant |
|---|---|
| INV-S-1 | `status = 'paid' → remaining_balance = 0` |
| INV-S-2 | `status = 'partial' → 0 < paid_amount < total AND remaining_balance > 0` |
| INV-S-3 | `status = 'unpaid' → paid_amount = 0 AND remaining_balance = total` |
| INV-S-4 | `status = 'draft' → invoice_number IS NULL AND paid_amount = 0` |
| INV-S-5 | `status = 'void' → remaining_balance = 0 AND there exists a reversal payment for every prior non-reversal payment` |
| INV-S-6 | `quotation.converted_invoice_id IS NOT NULL → quotation.status = 'accepted'` |
| INV-S-7 | A new payment is rejected if `invoice.status IN ('draft','void','paid')` (mirrors action matrix). |

---

## 13. State-change examples

### 13.1 Customer pays in two instalments

```
draft → unpaid                     (operator finalizes)
unpaid + payment(15M) → partial    (paid=15M, remaining=30M)
partial + payment(30M) → paid      (paid=45M, remaining=0)
```

### 13.2 Invoice goes overdue without payment

```
unpaid (issue 2026-04-01, due 2026-05-01, isOverdue=false)
  ↓
  ⏳ cron 2026-05-02 00:05
  ↓
unpaid (isOverdue=true)            — STATUS DID NOT CHANGE; isOverdue flipped; audit emitted
```

UI badge changes from "Chưa thanh toán" (red-soft) to "Chưa thanh toán · Quá hạn" (red-strong).

### 13.3 Partial payment past due

```
unpaid (due 2026-04-15) → ⏳ cron 2026-04-16 → unpaid + isOverdue=true
unpaid + payment(10M) → partial + isOverdue=true   (status flipped to partial, overdue retained)
```

UI: "Thanh toán một phần · Quá hạn".

### 13.4 Quotation expires while a customer is deciding

```
sent (validUntil 2026-05-18)
  ↓ no action by customer
  ⏳ cron 2026-05-19 00:05
  ↓
expired
```

Customer attempts to accept on 2026-05-20 via public link → 422 `DOMAIN-QUOTE-LOCKED` with message "Báo giá đã hết hạn, vui lòng yêu cầu báo giá mới". Sales clones → new draft → re-sends.

### 13.5 Admin voids a partially-paid invoice

```
partial (paid=15M, remaining=30M)
  ↓ POST /invoices/:id/void {reason: 'Hủy đơn theo yêu cầu khách hàng'}
  ↓ TX: insert reversal payment(15M) + UPDATE invoice SET status='void', remaining=0
void
```

Two payments now exist on the invoice: original 15M + reversal 15M. `paid_amount = 0`, `remaining_balance = 0`. Audit `invoice.void` carries `cause_json = {reason, reversed_payment_ids: [<originalId>]}`.

---

## 14. Cross-references

- `domain-reconciliation/canonical-business-rules.md` — CR-S-*, CR-Q-*, CR-OVR-* defining the rules implemented here.
- `domain-reconciliation/financial-formulas.md` — F-18 (calculateStatus), F-14 (isOverdue), F-15 (isQuotationExpired).
- `database/database-dictionary.md` — `invoices.status` and `quotations.status` CHECK enums; `is_overdue_cached` column.
- `api-contracts/invoices.md`, `api-contracts/quotations.md` — endpoints that drive the transitions.
- `workflows/order-workflow.md`, `workflows/quotation-workflow.md` — narrative descriptions of the lifecycles (now superseded by this file for normative meaning; narrative docs retained for storytelling).
