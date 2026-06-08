# Module — Template (HTML Invoice)

> **Cực kỳ đơn giản hoá.** Không còn module riêng, không có visual builder, không có template list.

## Vị trí
Tab "Mẫu hoá đơn" trong page `/settings`. Xem `modules/settings.md` §3.

## Cấu trúc
1 field duy nhất: `settings.invoiceTemplateHtml` (string HTML).

Lưu trong document `settings`, cập nhật qua `PATCH /api/settings`.

## Rendering

### Khi in invoice (`window.print()`)
1. FE `<PrintableInvoice invoice={...} settings={...} />` component:
   ```typescript
   function PrintableInvoice({ invoice, settings }) {
     const html = renderTemplate(settings.invoiceTemplateHtml, prepareData(invoice, settings))
     return <div className="print-only" dangerouslySetInnerHTML={{ __html: html }} />
   }
   ```
2. `renderTemplate(html, data)` dùng Handlebars browser-side:
   ```typescript
   import Handlebars from 'handlebars/dist/cjs/handlebars'
   export function renderTemplate(template: string, data: any): string {
     const compiled = Handlebars.compile(template)
     return compiled(data)
   }
   ```
3. `prepareData(invoice, settings)`:
   ```typescript
   {
     Ten_Cong_Ty: settings.companyName,
     Dia_Chi_Cong_Ty: settings.companyAddress,
     // ... rest
     Ma_Hoa_Don: invoice.invoiceNumber ?? 'NHÁP',
     Ngay_Tao: formatDate(invoice.issueDate),
     Khach_Hang: invoice.customerSnapshot.name,
     // ... rest
     items: invoice.items.map((it, idx) => ({
       STT: idx + 1,
       Ten_Hang: it.productName,
       Don_Vi: it.unit,
       So_Luong: it.quantity,
       Don_Gia: formatCurrency(it.unitPrice),
       Chiet_Khau: formatCurrency(it.discount),
       Thanh_Tien: formatCurrency(it.lineTotal),
     })),
     Tong_Cong: formatCurrency(invoice.total),
     Tien_Bang_Chu: numberToVietnameseWords(invoice.total),
   }
   ```

### Print stylesheet
`@media print` ẩn UI thường, show `.print-only` block. Xem `architecture/frontend-architecture.md` §12.

### Live preview trong Settings
- Settings page có 2 cột: textarea HTML | preview render
- Preview dùng `<iframe srcDoc={renderedHtml}>` để isolate CSS.
- Sample invoice data hardcoded trong code FE.

## Số tiền bằng chữ
Thư viện `vietnamese-number-to-words` hoặc tự viết hàm `numberToVietnameseWords(amount)`.

## Bỏ khỏi v1
- ❌ Visual block builder (drag-and-drop)
- ❌ Multiple templates / template switching
- ❌ Template versioning
- ❌ Per-tenant override (chỉ 1 template duy nhất)
- ❌ Server-side PDF render
- ❌ Server-side HTML sanitisation (single-tenant nội bộ)
