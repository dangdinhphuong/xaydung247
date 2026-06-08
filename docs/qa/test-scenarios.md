# QA Test Scenarios — MVP v1

Test cases ưu tiên cho QA / Jest integration. Mỗi case có ID, type, expected behavior.

---

## 1. Authentication

| ID | Type | Scenario | Expected |
|---|---|---|---|
| AUTH-01 | Positive | Login email + password đúng | Set cookie, return user |
| AUTH-02 | Negative | Sai password | 401 AUTH-INVALID |
| AUTH-03 | Negative | Account inactive | 403 AUTH-INACTIVE |
| AUTH-04 | Positive | Logout | Cookie cleared, session destroyed |
| AUTH-05 | Positive | GET /auth/me khi đã login | Return user |
| AUTH-06 | Negative | GET /auth/me khi chưa login | 401 AUTH-NEEDED |
| AUTH-07 | Negative | POST mutation thiếu CSRF token | 403 EBADCSRFTOKEN |
| AUTH-08 | Positive | Change password đúng currentPassword | 204, password updated |
| AUTH-09 | Negative | Change password sai currentPassword | 400 AUTH-WRONG-PASSWORD |

---

## 2. RBAC

| ID | Scenario | Expected |
|---|---|---|
| RBAC-01 | SALES tạo invoice với status='unpaid' | 403 AUTH-FORBIDDEN |
| RBAC-02 | SALES tạo invoice draft | 201 OK |
| RBAC-03 | ACCOUNTANT POST /api/users | 403 |
| RBAC-04 | VIEWER POST /api/invoices/:id/payments | 403 |
| RBAC-05 | SALES PATCH invoice của user khác | 404 (ownership) |
| RBAC-06 | ADMIN deactivate last admin | 422 DOMAIN-LAST-ADMIN |
| RBAC-07 | VIEWER GET /api/invoices | 200 (đọc OK) |

---

## 3. Invoice CRUD

| ID | Scenario | Expected |
|---|---|---|
| INV-01 | Create draft với 2 items | 201, invoiceNumber=null, status='draft' |
| INV-02 | Create direct unpaid | 201, invoiceNumber='HD-YYYY-NNN', status='unpaid' |
| INV-03 | Create không customer | 400 V-CI-01 |
| INV-04 | Create không items | 400 V-CI-02 |
| INV-05 | Create với quantity=0 | 400 V-CI-03 |
| INV-06 | Create với discount > qty*price | 400 V-CI-08 |
| INV-07 | Create với dueDate < issueDate | 400 V-CI-05 |
| INV-08 | Finalize draft | 200, status='unpaid', number allocated |
| INV-09 | Finalize non-draft | 422 DOMAIN-INVALID-STATE |
| INV-10 | PATCH items khi status=unpaid | 422 DOMAIN-LINES-LOCKED |
| INV-11 | PATCH notes khi status=partial | 200 |
| INV-12 | Void unpaid invoice | 200, status='void', remaining=0 |
| INV-13 | Void paid invoice | 422 DOMAIN-INVALID-STATE |
| INV-14 | Delete draft | 204 |
| INV-15 | Delete unpaid | 422 |
| INV-16 | List với search='HD-2026' | Return matching |
| INV-17 | List với isOverdue=true | Return only overdue |
| INV-18 | GET detail với id sai | 404 |
| INV-19 | Atomic invoice number: 2 inserts cùng năm | Số khác nhau |
| INV-20 | Tax auto = round(taxBase × rate / 100) | Server computed đúng |

---

## 4. Payment

| ID | Scenario | Expected |
|---|---|---|
| PAY-01 | Add payment hợp lệ trên unpaid | 201, status='partial' nếu chưa đủ, 'paid' nếu đủ |
| PAY-02 | Add payment trên draft | 422 DOMAIN-DRAFT-PAYMENT |
| PAY-03 | Add payment trên paid | 422 DOMAIN-PAID-PAYMENT |
| PAY-04 | Add payment trên void | 422 DOMAIN-VOID-PAYMENT |
| PAY-05 | amount > remainingBalance | 400 V-PAY-02 |
| PAY-06 | amount = 0 | 400 V-PAY-01 |
| PAY-07 | amount < 0 | 400 V-PAY-01 |
| PAY-08 | method=bank_transfer thiếu reference | 400 V-PAY-06 |
| PAY-09 | method=cash không cần reference | OK |
| PAY-10 | paymentDate = today+2 | 400 V-PAY-03 |
| PAY-11 | Sau add payment, paidAmount = Σ payments | INV-4 hold |
| PAY-12 | Sau pay full, status='paid', remaining=0 | OK |
| PAY-13 | List payments của invoice | Return all, sorted by paymentDate desc |

---

## 5. Customer CRUD

| ID | Scenario | Expected |
|---|---|---|
| CUST-01 | Create OK | 201, code='CUST00001' |
| CUST-02 | Create thiếu name | 400 V-CUST-01 |
| CUST-03 | Phone sai format | 400 V-CUST-02 |
| CUST-04 | List với search | Match name/phone/email |
| CUST-05 | List default exclude inactive | OK |
| CUST-06 | Soft delete customer có invoice | 422 DOMAIN-CUSTOMER-IN-USE |
| CUST-07 | Soft delete customer không invoice | 204 |
| CUST-08 | GET :id/aging | Return 4 buckets |
| CUST-09 | SALES PATCH customer của user khác | 404 |

---

## 6. Product CRUD

| ID | Scenario | Expected |
|---|---|---|
| PROD-01 | Create OK | 201, code='PROD00001' |
| PROD-02 | Create price < 0 | 400 V-PROD-02 |
| PROD-03 | Delete product có invoice line | 422 DOMAIN-PRODUCT-IN-USE |
| PROD-04 | GET /categories | Return distinct list |

---

## 7. Quotation

| ID | Scenario | Expected |
|---|---|---|
| Q-01 | Create draft | 201, status='draft', quotationNumber=null |
| Q-02 | Send draft | 200, status='sent', number allocated |
| Q-03 | Send non-draft | 422 DOMAIN-INVALID-STATE |
| Q-04 | Accept sent (chưa expired) | 200, status='accepted' |
| Q-05 | Accept expired | 422 DOMAIN-QUOTE-EXPIRED |
| Q-06 | Reject sent | 200, status='rejected' |
| Q-07 | Convert accepted | 201 với invoice mới |
| Q-08 | Convert non-accepted | 422 DOMAIN-INVALID-STATE |
| Q-09 | Convert đã converted | 422 DOMAIN-ALREADY-CONVERTED |
| Q-10 | Clone bất kỳ status | 201, new draft với items copied |
| Q-11 | PATCH non-draft | 422 DOMAIN-QUOTE-LOCKED |
| Q-12 | Delete non-draft | 422 |
| Q-13 | validUntil < issueDate | 400 V-Q-02 |
| Q-14 | isExpired field derived khi list | Đúng |

---

## 8. Settings

| ID | Scenario | Expected |
|---|---|---|
| SET-01 | GET settings (ACCOUNTANT) | 200 OK |
| SET-02 | PATCH (ADMIN) | 200 |
| SET-03 | PATCH (ACCOUNTANT) | 403 |
| SET-04 | invoicePrefix='hd-' (lowercase) | 400 V-SET-06 |
| SET-05 | defaultDueDays = 400 | 400 V-SET-04 |
| SET-06 | defaultTaxRate = -10 | 400 V-SET-05 |

---

## 9. Dashboard

| ID | Scenario | Expected |
|---|---|---|
| DASH-01 | GET /dashboard (mọi role) | 200 với 4 KPI + recent |
| DASH-02 | monthlyRevenue = Σ payments tháng này | Đúng |
| DASH-03 | totalDebt = Σ remaining open invoices | Drafts excluded |
| DASH-04 | overdueCount = số invoice isOverdue | Đúng theo derived |
| DASH-05 | recentInvoices = top 5 by createdAt desc | Đúng |

---

## 10. Invariants (Jest unit tests)

| ID | Invariant |
|---|---|
| INV-1 | `subtotal = Σ items.lineTotal` |
| INV-2 | `lineTotal = qty * price - discount >= 0` |
| INV-3 | `total = subtotal - discount + tax + shipping` |
| INV-4 | `paidAmount = Σ payments.amount` |
| INV-5 | `0 ≤ paidAmount ≤ total` |
| INV-6 | `remainingBalance = total - paidAmount` |
| INV-7 | `status = calculateStatus(total, paid, draft, void)` |
| INV-S-1 | `status=paid → remaining=0` |
| INV-S-4 | `status=draft → invoiceNumber=null` |

---

## 11. E2E (Supertest)

1. Login as ADMIN.
2. Create customer → success.
3. Create product → success.
4. Create draft invoice → success.
5. Finalize → invoiceNumber allocated.
6. Add payment 50% → status=partial.
7. Add payment 50% → status=paid, remaining=0.
8. GET dashboard → KPIs reflect changes.
9. Logout.

---

## 12. Out of scope tests
- ❌ Load test (chỉ MVP, ≤ 5 users đồng thời)
- ❌ Cross-tenant isolation (single-tenant)
- ❌ Audit log integrity
- ❌ Email delivery
- ❌ PDF generation server-side
