# QA Test Scenarios — Invoice Pro

> Comprehensive functional, regression, permission, and edge-case test scenarios. Use together with `validation-rules.md` and `security-test-cases.md`. Test IDs follow `TC-<MODULE>-<SEQ>`.

---

## 1. Test environment baseline

- Browser: Chromium-latest, iOS Safari 16+, Android Chrome 110+.
- Resolutions: 360×640 (mobile), 768×1024 (tablet), 1440×900 (desktop).
- Seed data: `src/app/data/mockData.ts` (8 invoices, 5 customers, 10 products, 5 payments, 2 quotations).
- Date when tests run is referred to as `TODAY`.
- All amounts in VND.

---

## 2. Authentication (recommended — not yet implemented)

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-AUTH-01 | Positive | Valid email/password | Redirect to last requested URL or `/` |
| TC-AUTH-02 | Negative | Wrong password (≤ 4 attempts) | Inline error "Email hoặc mật khẩu không đúng" |
| TC-AUTH-03 | Security | 5th wrong attempt within 15 min | Account locked 30 min (BR-AUTH-02) |
| TC-AUTH-04 | Negative | Inactive account | "Tài khoản đã bị vô hiệu hoá" |
| TC-AUTH-05 | Session | Open `/invoices` after token expiry | Redirect to `/login?from=/invoices` |
| TC-AUTH-06 | Logout | Click "Đăng xuất" | Cookie cleared, redirect to `/login` |
| TC-AUTH-07 | Reset | Use reset link past 30 min | "Liên kết không hợp lệ hoặc đã hết hạn" |

---

## 3. Dashboard

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-DASH-01 | Positive | Load `/` | 4 KPI cards rendered with formatted VND |
| TC-DASH-02 | Calc | `monthlyRevenue` matches Σ paidAmount where issueDate.month=current | exact match |
| TC-DASH-03 | Calc | `totalDebt` matches Σ remainingBalance | exact match (note BR-DASH-02 — drafts included today) |
| TC-DASH-04 | UX | Click "Xem tất cả" | navigate to `/invoices` |
| TC-DASH-05 | Mobile | Resize to 360px | sticky mobile header shows "Dashboard" |
| TC-DASH-06 | Edge | New tenant with zero invoices | all KPIs = 0; recent table empty (gap: no welcome state) |
| TC-DASH-07 | Edge | Trend "+12.5%" | hard-coded — flag bug, must be MoM |

---

## 4. Invoice list

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-INV-LST-01 | Positive | Load `/invoices` | table of 8 seed invoices |
| TC-INV-LST-02 | Search | "HD-2026-001" | only INV001 row |
| TC-INV-LST-03 | Search | "hoàng long" (case-insensitive) | invoices INV001 + INV004 |
| TC-INV-LST-04 | Filter | Status=overdue | only invoices with `status='overdue'` (after auto-recompute) |
| TC-INV-LST-05 | Mobile | Tap filter icon | bottom-sheet opens with status options |
| TC-INV-LST-06 | Mobile | "Đặt lại" | filter reverts to `all` |
| TC-INV-LST-07 | Action visibility | row with draft status | quick-pay icon NOT shown |
| TC-INV-LST-08 | Action visibility | row with paid status (remaining=0) | quick-pay icon NOT shown |
| TC-INV-LST-09 | Action visibility | row with partial status | quick-pay icon shown |
| TC-INV-LST-10 | Empty | Search "zzz" | "Không tìm thấy hóa đơn nào" |
| TC-INV-LST-11 | Bug | Click ✏️ edit icon | (currently no handler → gap) |
| TC-INV-LST-12 | Bug | Click "Xuất Excel" | (currently no handler → gap) |
| TC-INV-LST-13 | Visual | Mobile card with remaining > 0 | "Còn:" line in orange |

---

## 5. Create invoice

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-INV-CRT-01 | Positive | Fill all fields & 2 items → "Tạo hóa đơn" | toast "Tạo hóa đơn thành công!", navigate to detail, status=unpaid |
| TC-INV-CRT-02 | Positive | Same path with "Lưu nháp" | toast "Lưu nháp...", status=draft |
| TC-INV-CRT-03 | V-CI-01 | Submit without customer | toast.error "Vui lòng chọn khách hàng" |
| TC-INV-CRT-04 | V-CI-02 | No items added | toast.error "Vui lòng thêm ít nhất một sản phẩm" |
| TC-INV-CRT-05 | V-CI-03 | Item with quantity=0 | toast.error "Vui lòng điền đầy đủ thông tin sản phẩm" |
| TC-INV-CRT-06 | V-CI-03 | Item without product selected | toast.error V-CI-03 |
| TC-INV-CRT-07 | Calc | qty=10, price=100, discount=200 → lineTotal | 800 |
| TC-INV-CRT-08 | Calc | subtotal=1,000,000, discount=100k, tax=100k, shipping=50k → total | 1,050,000 |
| TC-INV-CRT-09 | Auto-fill | Select product PROD001 in a line | name "Xi măng PCB40 Hoàng Thạch", unitPrice 95000 |
| TC-INV-CRT-10 | Default | dueDate on load | today + 30 days |
| TC-INV-CRT-11 | UI | Remove all items | both submit buttons disabled |
| TC-INV-CRT-12 | Bug BR-CI-04 | Inspect invoice number on created invoice | likely `INV20260001` rather than `HD-2026-009` — flag |
| TC-INV-CRT-13 | Edge | Discount > qty×price (negative line total) | not blocked client-side (defect; recommend V-DISC-01) |
| TC-INV-CRT-14 | Edge | Negative tax/shipping via keyboard arrow | HTML min=0 prevents arrows but pasting "-100" works → defect |

---

## 6. Invoice detail

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-INV-DET-01 | Positive | Open `/invoices/INV001` | renders header, items, summary, payment history |
| TC-INV-DET-02 | 404 | Open `/invoices/INVxxx` | "Không tìm thấy hóa đơn" with back link |
| TC-INV-DET-03 | Visibility | Draft invoice | "Thêm thanh toán" NOT shown |
| TC-INV-DET-04 | Visibility | Paid invoice | "Thêm thanh toán" NOT shown |
| TC-INV-DET-05 | Visibility | Partial invoice | "Thêm thanh toán" shown (desktop + mobile bottom bar) |
| TC-INV-DET-06 | Display | Invoice with discount=0 | "Giảm giá" row hidden |
| TC-INV-DET-07 | Display | Mobile screen | 3-card KPI strip shown (Tổng HĐ / Đã TT / Còn lại) |
| TC-INV-DET-08 | Bug | Click "In" / "Tải PDF" | (no handler) |

---

## 7. Add payment

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-PAY-01 | Positive | INV001 remaining=30,100,000 → amount=10,000,000 cash | new payment row; status remains `partial`; remaining=20,100,000 |
| TC-PAY-02 | Positive | Pay exactly remaining → status flips to `paid` | "Thêm thanh toán..." CTA disappears |
| TC-PAY-03 | V-PAY-01 | amount=0 | inline error "Số tiền không hợp lệ" |
| TC-PAY-04 | V-PAY-01 | amount=-5 | inline error "Số tiền không hợp lệ" |
| TC-PAY-05 | V-PAY-02 | amount > remaining | inline error "Số tiền vượt quá số tiền còn lại (...)" |
| TC-PAY-06 | UI | method=bank_transfer | "Mã giao dịch" field appears |
| TC-PAY-07 | UI | method=cash | no reference field |
| TC-PAY-08 | UX | Cancel button | modal closes; no payment created |
| TC-PAY-09 | State | Invoice was `overdue`; pay full | status → `paid` |
| TC-PAY-10 | State | Invoice was `overdue` (partial+past-due); pay portion | status STAYS `overdue` per `calculateStatus` (not `partial`) — clarify with business |
| TC-PAY-11 | Edge | Two payments same second (Date.now collision) | IDs must be unique server-side (current `'PAY'+Date.now()` could collide) |

---

## 8. Quotation

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-Q-01 | Positive | Open `/quotations` | seed: QUOT001 (sent), QUOT002 (accepted) |
| TC-Q-02 | Search | "BG-2026-001" | only QUOT001 |
| TC-Q-03 | Status pill | QUOT001 | blue "Đã gửi" |
| TC-Q-04 | Status pill | QUOT002 | green "Đã chấp nhận" |
| TC-Q-05 | Empty | search "zzz" | "Không tìm thấy báo giá nào" |
| TC-Q-06 | Bug | Click "Tạo báo giá mới" | (no create page wired) — gap |

---

## 9. Debt management

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-DEBT-01 | Positive | Open `/debts` with seed data | summary cards + table; INV001 ($30.1M) and INV003 ($81M, overdue) contribute to CUST001/CUST003 |
| TC-DEBT-02 | Aging | INV003 dueDate=2026-02-20 vs TODAY=2026-05-18 → daysOverdue=87 → bucket 61+ | row CUST003 → "61+ ngày" column has 81,000,000 |
| TC-DEBT-03 | Filter | Customer with no debt (CUST004) | NOT in table |
| TC-DEBT-04 | Drilldown | Click eye on CUST001 | dialog with 4 metric cards + unpaid invoices table |
| TC-DEBT-05 | Drilldown | Click invoice link inside dialog | dialog closes, navigate to `/invoices/:id` |
| TC-DEBT-06 | Edge | Draft invoice INV008 with remaining > 0 | NOT counted (status filter) |
| TC-DEBT-07 | Inconsistency | Compare aging buckets here vs `/reports` | 3 buckets vs 4 buckets — flag |

---

## 10. Customer management

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-CUST-01 | Positive | Open `/customers` | 5 rows |
| TC-CUST-02 | Search | "0987654321" | only CUST002 row |
| TC-CUST-03 | Search | "minhtam" | only CUST002 (email match) |
| TC-CUST-04 | Display | currentDebt > 0 | orange formatted VND |
| TC-CUST-05 | Display | currentDebt = 0 | "-" |
| TC-CUST-06 | Status pill | active customer | green "Hoạt động" |
| TC-CUST-07 | Bug | "Thêm khách hàng" | no handler |

---

## 11. Product management

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-PROD-01 | Positive | Open `/products` desktop | 10 rows |
| TC-PROD-02 | Filter | Category "Cát" | 2 rows (PROD002, PROD006) |
| TC-PROD-03 | Filter | Search "xi măng" | PROD001 + PROD008 |
| TC-PROD-04 | Threshold | PROD009 stock=80 (<100) | stock cell red bold |
| TC-PROD-05 | Threshold | PROD001 stock=500 | stock cell default color |
| TC-PROD-06 | Mobile | Resize → 360px | card layout + FAB visible |
| TC-PROD-07 | Mobile filter | Open bottom sheet | category buttons rendered |
| TC-PROD-08 | Empty | Search "zzz" | "Không tìm thấy sản phẩm" + Package icon |
| TC-PROD-09 | Bug | "Thêm sản phẩm" | no handler |

---

## 12. Reports

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-RPT-01 | Positive | Open `/reports` | bar chart + top-5 table + aging table |
| TC-RPT-02 | Calc | Top-5 sorts desc by revenue (Σ paidAmount) | CUST002 (50M paid) likely #1 in seed |
| TC-RPT-03 | Calc | Aging percentages sum | 100% |
| TC-RPT-04 | Bug | Export buttons | no handlers |
| TC-RPT-05 | Inconsistency | Aging buckets vs /debts | report uses 4 buckets including `90+`; debts uses 3 |

---

## 13. Settings & Templates

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-SET-01 | Bug | Edit company name → "Lưu thay đổi" | no persistence (uncontrolled inputs) |
| TC-SET-02 | UX | Toggle "Tự động tính thuế" off | UI toggles; not wired |
| TC-TPL-01 | Positive | Open `/settings/templates` | grid with 3 templates; Mẫu cổ điển badged "Mặc định" |
| TC-TPL-02 | Action | Click "Sửa" on default | navigate `/settings/templates/1/edit` (Monaco HTML editor) |
| TC-TPL-03 | Action | Click "Trình thiết kế" | navigate `/settings/templates/new` (visual builder) |
| TC-TPL-04 | Preview | "Xem" | navigate to preview with sample data |
| TC-TPL-05 | Bug | "Đặt làm mặc định" | console.log only — no handler |

---

## 14. Routing & layout

| ID | Type | Scenario | Expected |
|---|---|---|---|
| TC-NAV-01 | Positive | Visit `/xyz` | 404 page "Không tìm thấy trang" + "Về trang chủ" |
| TC-NAV-02 | Mobile | Tap "Menu" tab (path `/menu`) | MobileMenu sheet opens (Layout uses useEffect on path) — **but** `/menu` is not in routes.ts → page 404 underneath. Bug to fix. |
| TC-NAV-03 | Layout | Resize from mobile to desktop | sidebar appears, bottom-nav hidden |
| TC-NAV-04 | Sidebar | Click collapse arrow | sidebar shrinks to 80px, labels hidden |

---

## 15. Production-readiness gaps (must-fix before launch)

| Ref | Gap |
|---|---|
| G-01 | No auth/RBAC layer. |
| G-02 | Several CRUD/Export/Print buttons have no handlers. |
| G-03 | Invoice numbering BR-CI-04 bug. |
| G-04 | Settings save not wired. |
| G-05 | `/menu` route not registered. |
| G-06 | Aging-bucket inconsistency between Debts and Reports. |
| G-07 | Negative-value injection in number inputs by paste. |
| G-08 | No empty/loading/error states across the app. |
| G-09 | No persistence (in-memory store). |
| G-10 | "+12.5%" trend on Dashboard is hard-coded. |
| G-11 | Drafts inflate `totalDebt` on dashboard. |
| G-12 | Payment ID collision risk with `Date.now()`. |

---

## 16. Concurrency scenarios (recommended)

| ID | Scenario | Expected |
|---|---|---|
| TC-CON-01 | Two users open same invoice; both add payments | Server MUST recompute and reject second if cumulative > total. |
| TC-CON-02 | Admin sets template A as default while another sets B | Last write wins; backend enforces single default per tenant. |
| TC-CON-03 | Two users finalise drafts that would share next invoice number | Backend allocates number atomically; no duplicate. |
| TC-CON-04 | User edits invoice mid-flight while colleague approves | Optimistic-locking via `updated_at`; second save returns 409. |
