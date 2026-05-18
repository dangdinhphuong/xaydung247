# Module — Customer Management (Quản lý khách hàng)

## 1. Purpose
Maintain the B2B customer master used by invoicing and quotations. The screen also surfaces the **real-time current debt** per customer, computed from open invoices.

**Source:** `src/app/pages/CustomerManagement.tsx`, `src/app/data/mockData.ts`, `src/app/types.ts`.

---

## 2. Business description
Each merchant maintains a directory of recurring B2B buyers (construction companies, retailers, projects). When issuing an invoice, the seller picks the customer from this list; the customer's name, phone, address (and optionally tax code) are then **snapshot-copied** onto the invoice (see `pages/CreateInvoice.tsx` lines 144–146) — so subsequent edits to the customer record do not retroactively alter historical invoices.

The customer list also doubles as a **collection target list**: each row shows `currentDebt` so the merchant can immediately see who is in arrears.

---

## 3. Actors
- Administrator, Accountant, Sales: full read; create/edit allowed.
- Viewer: read only.

## 4. Preconditions
- User authenticated.

## 5. Trigger conditions
- Navigate to `/customers`.
- Selected from sidebar "Khách hàng" (desktop) or mobile bottom nav "Khách hàng".

---

## 6. Main workflow (list & search)
1. Page loads `customers` from master data (`mockData.ts`) and computes `currentDebt` for each by summing `remainingBalance` of their non-draft invoices (`store.getInvoices()` filtered by `customerId`).
2. Free-text search filters across **name**, **phone**, **email** (case-insensitive on name/email; substring on phone).
3. Render table (desktop) or card list (mobile would be added — currently desktop-only).
4. Per-row actions: 👁 View, ✏️ Edit (handlers not yet bound — gap to close).
5. "Thêm khách hàng" button opens (recommended) create-customer modal — handler not bound.

---

## 7. Alternative flows
- No search match → empty table body (no explicit empty-state copy — gap).
- Customer with `status='inactive'` is still listed; recommended toggle to filter inactive.

## 8. Exception flows
- None coded.

---

## 9. Form fields (recommended — Create/Edit customer)

| Field | Type | Required | Validation | Default | Editable | Business meaning |
|---|---|---|---|---|---|---|
| name | text | Yes | 2–200 chars | — | Yes | Legal entity name (used on invoice header) |
| phone | text | Yes | VN format (10 digits, leading 0) | — | Yes | Primary contact phone |
| email | email | Yes | RFC-5322 | — | Yes | Communication / future auto-send |
| address | text | Yes | ≤ 300 chars | — | Yes | Billing address (snapshot on invoice) |
| taxCode | text | No | VN MST: 10 digits, optionally `-` + 3 digits | — | Yes | Required for VAT-bearing invoices |
| status | enum | Yes | `active | inactive` | `active` | Yes | Disables future invoicing on inactive customers |

---

## 10. Business rules

| ID | Rule | Source |
|---|---|---|
| BR-CUST-01 | `currentDebt` is **derived** in real time; never stored on the customer row. | `CustomerManagement.tsx` lines 24–34 |
| BR-CUST-02 | Drafts are EXCLUDED from `currentDebt` (`status !== 'draft'`). | same |
| BR-CUST-03 | The phone field is treated as a contiguous numeric string for search (no normalisation). | `CustomerManagement.tsx` line 38 |
| BR-CUST-04 | Customer name/phone/address are **snapshot-copied** to the invoice at creation time. | `CreateInvoice.tsx` lines 144–146 |
| BR-CUST-05 | Tax code is optional; when present, it should appear on the invoice and on the customer-info template block. | `defaultTemplate.ts` `showTaxCode` flag |
| BR-CUST-06 | A customer with open invoices cannot be hard-deleted; soft-delete by `status='inactive'`. | Recommended |
| BR-CUST-07 | Inactive customers MUST NOT appear in the "Khách hàng" picker on `CreateInvoice` or `QuotationManagement`. | Recommended |
| BR-CUST-08 | `currentDebt > 0` is rendered in **orange** (`text-orange-600`); = 0 renders as `-`. | `CustomerManagement.tsx` lines 106–113 |

---

## 11. Validation rules

| Code | Trigger | Message |
|---|---|---|
| V-CUST-01 | Empty name | "Tên khách hàng là bắt buộc" |
| V-CUST-02 | Invalid phone | "Số điện thoại không hợp lệ" |
| V-CUST-03 | Invalid email | "Email không hợp lệ" |
| V-CUST-04 | Tax code format | "Mã số thuế không hợp lệ" |
| V-CUST-05 | Duplicate name+phone within tenant | "Khách hàng đã tồn tại" |

---

## 12. UI behaviors

- Page header: title + "Tổng cộng N khách hàng" + "Thêm khách hàng" CTA (blue, `#1E88E5`).
- Search box (width 64 desktop) with `Search` icon.
- Contact column shows two stacked rows with a `Phone` icon and a `Mail` icon.
- Address column is truncated with `max-w-xs truncate`.
- Status badge: `bg-green-100 text-green-800` for active; `bg-gray-100 text-gray-800` for inactive.

---

## 13. API contract (recommended)

| Verb | Path | Body | Response |
|---|---|---|---|
| GET    | `/api/customers?search=&status=` | — | `Customer[]` (with derived `currentDebt`) |
| GET    | `/api/customers/:id` | — | `Customer + invoices summary` |
| POST   | `/api/customers` | `{name, phone, email, address, taxCode?, status}` | `Customer` |
| PUT    | `/api/customers/:id` | partial | `Customer` |
| DELETE | `/api/customers/:id` | — | 204 (only if no invoices), else 409 |

---

## 14. Database impact
See `database/database-dictionary.md` table `customers`.
- Insert / update on this table.
- `invoices` and `quotations` reference `customer_id` (FK) AND keep denormalised `customer_name`, `customer_phone`, `customer_address` snapshots.

---

## 15. Permission rules
See `roles/roles-and-permissions.md` §4.

---

## 16. Notifications
- (Recommended) Toast on create/edit success.
- (Recommended) When a customer's `currentDebt` exceeds a configurable credit limit, system warns at invoice-create time.

---

## 17. Error cases

| Code | Trigger | UX |
|---|---|---|
| E-CUST-01 | Server error on save | Toast "Lưu khách hàng thất bại" |
| E-CUST-02 | Trying to delete a customer with invoices | Modal "Khách hàng đang có hoá đơn, không thể xoá. Hãy đặt trạng thái Không hoạt động." |

---

## 18. Edge cases

- Same legal entity registered twice with different phones → distinct customers; aggregation should be a future enhancement (de-dupe).
- A customer with only paid invoices should still appear, `currentDebt=0`.
- Bulk import via Excel — not implemented; recommended for production.
