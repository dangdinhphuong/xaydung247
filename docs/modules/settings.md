# Module — Settings

## Route
`/settings` (ADMIN: write; ACCOUNTANT: read)

## Data hooks
- `useSettings()` → `GET /api/settings`
- `useUpdateSettings()` → `PATCH /api/settings`

## UI sections

### 1. Thông tin công ty
| Field | Default |
|---|---|
| companyName | (seed) |
| companyTaxCode | (seed) |
| companyAddress | (seed) |
| companyPhone | (seed) |
| companyEmail | (seed) |

Button "Lưu thay đổi" — gọi PATCH.

### 2. Cài đặt hoá đơn
| Field | Default |
|---|---|
| invoicePrefix | "HD-" |
| quotationPrefix | "BG-" |
| defaultDueDays | 30 |
| defaultTaxRate | 10 |
| autoTax | true (switch) |

Button "Lưu thay đổi".

### 3. Mẫu hoá đơn (HTML)
- Monaco editor (đã có sẵn từ prototype) cho HTML editor — hoặc Codemirror, hoặc plain textarea cho MVP siêu đơn giản.
- Live preview pane bên phải: render template với sample data (hardcoded JSON).
- Placeholders supported (Handlebars-style):
  - Company: `{{Ten_Cong_Ty}}`, `{{Dia_Chi_Cong_Ty}}`, `{{So_Dien_Thoai_Cong_Ty}}`, `{{Email_Cong_Ty}}`, `{{Ma_So_Thue_Cong_Ty}}`
  - Invoice: `{{Ma_Hoa_Don}}`, `{{Ngay_Tao}}`, `{{Ngay_Den_Han}}`
  - Customer: `{{Khach_Hang}}`, `{{Dia_Chi_Khach_Hang}}`, `{{So_Dien_Thoai_Khach_Hang}}`, `{{Ma_So_Thue_Khach_Hang}}`
  - Amounts: `{{Tong_Tien}}`, `{{Chiet_Khau_Tong}}`, `{{Thue}}`, `{{Phi_Van_Chuyen}}`, `{{Tong_Cong}}`, `{{Da_Thanh_Toan}}`, `{{Con_Lai}}`, `{{Tien_Bang_Chu}}`
  - Items array: `{{#each items}} {{STT}} {{Ten_Hang}} {{Don_Vi}} {{So_Luong}} {{Don_Gia}} {{Chiet_Khau}} {{Thanh_Tien}} {{/each}}`
  - Notes: `{{#if Ghi_Chu}} {{Ghi_Chu}} {{/if}}`

Button "Lưu mẫu".

Default template (xem `database/seed-data.md` §6).

---

## Validation
- Inline qua react-hook-form + Zod, hiển thị error dưới input.

## Notes
- Không sanitize HTML trong MVP (single-tenant nội bộ, ADMIN tin được).
- Khi mở multi-tenant tương lai → dùng DOMPurify.
- Bỏ khỏi v1: notifications toggle, auto-email toggle, payment-reminder toggle.

## Trang KHÔNG có
- ❌ `/settings/templates` (template management module riêng) — gộp vào trang Settings dạng tab "Mẫu hoá đơn"
- ❌ `/settings/templates/new`, `/edit`, `/preview` — bỏ hoàn toàn
- ❌ Notification preferences
