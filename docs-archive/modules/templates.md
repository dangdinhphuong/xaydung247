# Module — Invoice Template Management (Mẫu hóa đơn)

**Source:**
- `src/app/pages/TemplateList.tsx`
- `src/app/pages/TemplateBuilder.tsx`
- `src/app/pages/TemplateEditor.tsx`
- `src/app/pages/TemplateEditorVisual.tsx`
- `src/app/pages/InvoicePreview.tsx`
- `src/app/types/template.ts`
- `src/app/utils/defaultTemplate.ts`
- `src/app/utils/templateConverter.ts`
- `src/app/components/BlockLibrary.tsx`, `BlockSettings.tsx`, `VisualBlock.tsx`, `TemplatePreview.tsx`

---

## 1. Purpose
Let the merchant fully customise the printable / PDF invoice layout — branding (logo, colour), structure (which blocks appear, in what order), column visibility on the items table, and (for power users) raw HTML.

## 2. Business description
Each shop has its own legal name, MST, contact details, signature lines, and required disclaimers. Rather than ship a single hard-coded layout, Invoice Pro models the invoice as a **schema of blocks** (`TemplateSchema → TemplateBlock[]`). A drag-and-drop **visual builder** assembles the blocks; an **HTML editor** lets a developer paste fully custom markup that uses variable placeholders (`Ten_Cong_Ty`, `Khach_Hang`, `Tong_Cong` …).

A merchant may have many templates but only one is the **default** (used when issuing/printing an invoice).

## 3. Actors
ADMIN only (write). All roles may preview.

## 4. Routes
| Route | Component | Purpose |
|---|---|---|
| `/settings/templates` | `TemplateList` | Card grid of templates with thumbnails |
| `/settings/templates/new` | `TemplateBuilder` | New template — visual block editor |
| `/settings/templates/:id/edit` | `TemplateEditorVisual` | HTML editor with live preview |
| `/settings/templates/:id/preview` | `InvoicePreview` | Standalone preview of a template populated with sample data |

---

## 5. Data model

### 5.1 `TemplateSchema`

| Field | Type | Required | Meaning |
|---|---|---|---|
| id | string | Yes | Template id |
| name | string | Yes | Display name ("Mẫu cổ điển", "Mẫu hiện đại"…) |
| version | string | Yes | Free-text version label (e.g. `'1.0'`) |
| paperSize | enum | Yes | `A4 | A5` (UI may also show `A6 | Thermal`) |
| orientation | enum | Yes | `portrait | landscape` |
| margins | object | Yes | `{top, right, bottom, left}` in mm |
| primaryColor | string | Yes | Hex; default `#1E88E5` |
| blocks | `TemplateBlock[]` | Yes | Ordered list (defines layout) |
| customHTML | string | No | Raw HTML when `isCustomHTML=true` |
| isCustomHTML | boolean | No | Switch to HTML mode |

### 5.2 `TemplateBlock` union (per `types/template.ts`)

| Block | Configurable fields |
|---|---|
| `header` | layout (`logo-left|center|right`), `showLogo`, `showCompanyName`, `showAddress`, `showPhone`, `showEmail`, `showTaxCode` |
| `invoice-title` | `title` (e.g. "HÓA ĐƠN BÁN HÀNG"), `showInvoiceCode`, `showBorder` |
| `customer-info` | `showName`, `showAddress`, `showPhone`, `showTaxCode` |
| `invoice-meta` | `showCreatedDate`, `showDueDate`, `showSalesperson`, `layout` |
| `items-table` | per-column toggles: `stt, name, unit, quantity, price, discount, tax, amount`; `showHeader`, `showBorders`, `headerColor`, `headerTextColor` |
| `totals` | `align`, `showSubtotal`, `showDiscount`, `showTax`, `showShipping`, `showGrandTotal`, `showPaid`, `showRemaining`, `showInWords`, `width` |
| `payment-info` | `showBankInfo`, `showQRCode` |
| `signature` | `showSellerSignature`, `showCustomerSignature`, `layout` |
| `footer` | `showThankYou`, `showTerms`, `customText` |

Every block carries: `id`, `visible`, and a `style` object (`marginTop/Bottom`, `paddingTop/Bottom`, `fontSize`, `fontWeight`, `textAlign`, `color`, `backgroundColor`).

### 5.3 `TemplateSampleData`
Vietnamese-labelled placeholder dictionary used for previewing and (recommended) the variable system in the HTML editor: `Ten_Cong_Ty`, `Dia_Chi_Cong_Ty`, `So_Dien_Thoai_Cong_Ty`, `Email_Cong_Ty`, `Ma_So_Thue_Cong_Ty`, `Khach_Hang`, `So_Dien_Thoai`, `Dia_Chi_Khach_Hang`, `Ma_So_Thue_Khach`, `Ma_Hoa_Don`, `Ngay_Tao`, `Ngay_Den_Han`, `Tong_Tien`, `Chiet_Khau`, `Thue`, `Phi_Van_Chuyen`, `Tong_Cong`, `Da_Thanh_Toan`, `Con_Lai`, `Tien_Bang_Chu`, plus `items[]` with `{STT, Ten_Hang, Don_Vi, So_Luong, Don_Gia, Chiet_Khau, Thue, Thanh_Tien}`.

---

## 6. Workflows

### 6.1 List templates
1. Render card grid; each card shows a paper-aspect thumbnail.
2. Badges: green "Mặc định" if `isDefault`, blue "Đang dùng" if `isActive`.
3. Per-card actions: **Xem** (preview), **Sửa** (edit), **Copy** (clone), **Đặt làm mặc định** (if not already).

### 6.2 Visual builder (`TemplateBuilder` / `TemplateBuilder.tsx`)
1. Left pane: block library (draggable).
2. Center: canvas — drop, reorder via drag (react-dnd), toggle visibility, delete.
3. Right pane: block settings (per-block fields above).
4. Top toolbar: paper size + orientation + margins + primary colour + Save.

### 6.3 HTML editor (`TemplateEditorVisual.tsx`)
1. Two-pane Monaco editor + live preview.
2. User edits raw HTML using `{{Variable_Name}}` placeholders.
3. Saving sets `isCustomHTML=true` and stores the markup in `customHTML`.

### 6.4 Preview
- `InvoicePreview` renders the template populated with `sampleData` from `defaultTemplate.ts`.

---

## 7. Business rules

| ID | Rule |
|---|---|
| BR-TPL-01 | Exactly one template per tenant is `isDefault=true`. Setting another default automatically demotes the previous one. |
| BR-TPL-02 | The default template is used when generating PDF / printing an invoice. |
| BR-TPL-03 | A template MUST contain at least one `header`, `items-table`, and `totals` block when active. |
| BR-TPL-04 | When `isCustomHTML=true`, the block list is ignored at render time; `customHTML` is rendered with placeholder substitution. |
| BR-TPL-05 | Templates cannot be hard-deleted while they are the default; user must first set another as default. |
| BR-TPL-06 | `primaryColor` cascades to header background, items-table header background, and totals "Tổng cộng" colour. |
| BR-TPL-07 | Paper size + orientation define the preview viewport (e.g. A4 portrait ≈ 210 × 297 mm). |

---

## 8. Form fields (per-block) — see §5 above.

## 9. Validation rules

| Code | Trigger | Message |
|---|---|---|
| V-TPL-01 | Empty template name on save | "Vui lòng nhập tên mẫu" |
| V-TPL-02 | Custom HTML mode but `customHTML` empty | "Vui lòng nhập HTML" |
| V-TPL-03 | Margins < 0 or > paper-size limit | "Lề không hợp lệ" |
| V-TPL-04 | Invalid hex colour | "Mã màu không hợp lệ" |

## 10. UI behaviors
- Cards in the list show a stylised wireframe thumbnail (gray bars) — production should render an actual screenshot.
- "Trình thiết kế" / "Chỉnh sửa HTML" CTAs in desktop header point to the two editor modes.
- Mobile: fixed bottom CTA "Tạo mẫu mới".

## 11. API contract (recommended)

| Verb | Path | Body | Response |
|---|---|---|---|
| GET    | `/api/templates` | — | `Template[]` |
| GET    | `/api/templates/:id` | — | `Template` |
| POST   | `/api/templates` | full schema | `Template` |
| PUT    | `/api/templates/:id` | partial | `Template` |
| POST   | `/api/templates/:id/clone` | — | `Template` |
| POST   | `/api/templates/:id/set-default` | — | `Template` |
| DELETE | `/api/templates/:id` | — | 204 / 409 if default |
| POST   | `/api/templates/:id/render` | `{invoiceId}` | HTML or PDF stream |

## 12. Permission rules
Only `ADMIN` writes; all roles can preview the default template.

## 13. Edge cases
- Switching `isCustomHTML` ON then OFF must keep both forms (HTML and blocks) without data loss.
- A template referenced by historical invoices SHOULD be versioned — newer edits should NOT alter the rendering of past printed invoices (recommendation: snapshot rendered HTML/PDF on invoice issue).
- Unknown placeholder in `customHTML` → render the literal token (do not throw).
