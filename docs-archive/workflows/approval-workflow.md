# Workflow — Approvals & Document State Machines

> Invoice Pro does not currently implement an **explicit approval chain** (no "submitted-for-approval" state). This document maps every document state machine in the system (Invoice, Quotation) and proposes a recommended approval extension.

---

## 1. Invoice state machine

See `workflows/order-workflow.md` for full detail. Summary:

```
   draft ─▶ unpaid ─┬─▶ partial ─┬─▶ paid (terminal)
                    │           │
                    └─▶ overdue ─┘
                          ▲
                          │ time passes & remaining > 0
```

| Status | Allowed actions | Next status | Restrictions |
|---|---|---|---|
| draft | edit, delete (admin), finalize | unpaid | cannot receive payment; not counted in receivables |
| unpaid | add payment, edit (recommend lock items), void (admin) | partial / paid / overdue / void | — |
| partial | add payment, void (admin) | paid / overdue | items become read-only |
| overdue | add payment | partial / paid | same |
| paid | view, print, refund (future) | (terminal) | — |

---

## 2. Quotation state machine

```
                    ┌────────┐
   create ────────▶│ draft  │
                    └───┬────┘
                        │ "Send to customer"
                        ▼
                    ┌────────┐    Customer rejects     ┌──────────┐
                    │  sent  │────────────────────────▶│ rejected │ (terminal)
                    └───┬────┘                          └──────────┘
                        │ Customer accepts                    ▲
                        ▼                                     │
                    ┌──────────┐   convert to invoice    locked
                    │ accepted │─────────────────────▶ (links via converted_invoice_id)
                    └──────────┘
                        │ valid_until passed without acceptance
                        ▼
                    ┌──────────┐
                    │ expired  │ (terminal — recreate via clone)
                    └──────────┘
```

| Status | Allowed actions | Next status | Restrictions |
|---|---|---|---|
| draft | edit, send, delete | sent / deleted | cannot convert |
| sent | mark accepted / rejected, resend, clone | accepted / rejected / expired | items locked |
| accepted | convert to invoice, clone | (converted) | one-time conversion |
| rejected | clone | — | terminal |
| expired | clone | — | terminal |

---

## 3. Recommended approval extension (production)

For larger shops the owner may want a **two-step finalize**: a SALES user creates the invoice, an ACCOUNTANT/ADMIN approves it before it becomes a receivable.

### 3.1 Extended invoice states

```
draft ──submit──▶ pending_approval ──approve──▶ unpaid ──▶ (rest of lifecycle)
                          │
                          └──reject──▶ draft (with rejection note)
```

### 3.2 Approval entity

| Field | Type | Notes |
|---|---|---|
| id | UUID | — |
| invoice_id | UUID | FK |
| submitted_by | UUID | user |
| submitted_at | TIMESTAMPTZ | — |
| reviewed_by | UUID | nullable until decision |
| reviewed_at | TIMESTAMPTZ | — |
| decision | enum | `approved | rejected` |
| comment | TEXT | required when rejected |

### 3.3 Permission

| Action | ADMIN | ACCOUNTANT | SALES | VIEWER |
|---|---|---|---|---|
| Submit for approval | ✓ | ✓ | ✓ | — |
| Approve | ✓ | ✓ | — | — |
| Reject | ✓ | ✓ | — | — |
| Skip approval (auto-approve own) | ✓ (with audit) | — | — | — |

### 3.4 Configuration
A tenant-level setting `require_invoice_approval: boolean` (default false to preserve current behavior). Optional `approval_threshold_amount` — only require approval if `total > threshold`.

---

## 4. Cross-cutting decision points

### 4.1 "Allowed to add payment?"
```
allow = invoice.status != 'draft'
     AND invoice.remaining_balance > 0
     AND user has Payment:create permission
```
(`InvoiceDetail.tsx` enforces the first two; backend MUST enforce the third.)

### 4.2 "Allowed to edit invoice?"
```
draft       → all fields editable by creator (and ADMIN/ACCOUNTANT)
unpaid      → header + notes editable; items frozen (recommended); ADMIN can void
partial/paid/overdue → only notes editable; ADMIN can void
```
*Current build does not enforce any item-edit lock — gap.*

### 4.3 "Allowed to convert quotation?"
```
allow = quotation.status == 'accepted'
     AND quotation.converted_invoice_id IS NULL
     AND user has Invoice:create permission
```

### 4.4 "Show overdue badge?"
```
isOverdue = invoice.remaining_balance > 0
         AND invoice.status != 'draft'
         AND today > invoice.due_date  (strict)
```

---

## 5. Notification triggers (recommended)

| Event | Recipients | Channel |
|---|---|---|
| invoice.finalize | customer (if email known + auto_email ON) | email (PDF attached) |
| invoice.overdue | tenant ACCOUNTANTs + ADMINs | in-app + email |
| invoice.payment_received | invoice.created_by + ACCOUNTANTs | in-app |
| invoice.submitted_for_approval | tenant ACCOUNTANTs + ADMINs | in-app |
| invoice.approved / rejected | invoice.created_by | in-app |
| quotation.expiring (3 days before validUntil) | sales owner | in-app |
| quotation.accepted | sales owner + ACCOUNTANTs | in-app |

---

## 6. Audit-log mapping

Each state transition MUST produce an audit-log row:

```
{
  action: "invoice.status_change",
  resource_type: "invoice",
  resource_id,
  before: { status: "unpaid" },
  after:  { status: "partial" },
  cause:  { type: "payment.create", payment_id: "..." }
}
```
