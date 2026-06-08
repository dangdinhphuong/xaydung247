import type { AppSettings, Invoice } from '../types';
import { DEFAULT_INVOICE_TEMPLATE_HTML, prepareInvoiceTemplateData } from './invoiceTemplate';
import { renderTemplate } from './templateRenderer';

/** Bọc fragment HTML thành tài liệu A4 hoàn chỉnh (khi template không phải full HTML). */
function wrapFragment(inner: string): string {
  return `<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 12mm; }
  body { font-family: 'Times New Roman', serif; color: #000; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; }
  img { max-width: 100%; }
</style></head>
<body>${inner}</body></html>`;
}

/**
 * Render hóa đơn theo template trong settings rồi in (chỉ phần hóa đơn).
 * - Template rỗng/không hợp lệ → dùng mẫu mặc định.
 * - Dùng iframe ẩn để cô lập CSS và không in sidebar/navbar/nút bấm.
 */
export function buildInvoiceHtml(
  invoice: Invoice,
  settings?: Partial<AppSettings> | null,
): string {
  const raw = settings?.invoiceTemplateHtml?.trim();
  const template = raw && raw.length > 0 ? raw : DEFAULT_INVOICE_TEMPLATE_HTML;
  const data = prepareInvoiceTemplateData(invoice, settings);
  let html = renderTemplate(template, data);
  if (!html || !html.trim()) {
    // Fallback cứng nếu render ra rỗng
    html = renderTemplate(DEFAULT_INVOICE_TEMPLATE_HTML, data);
  }
  if (!/<html[\s>]/i.test(html)) html = wrapFragment(html);
  return html;
}

export function printInvoiceFromTemplate(
  invoice: Invoice,
  settings?: Partial<AppSettings> | null,
): void {
  const html = buildInvoiceHtml(invoice, settings);

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();

  let done = false;
  const triggerPrint = () => {
    if (done) return;
    done = true;
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      // Dọn iframe sau khi hộp thoại in đóng
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 1000);
    }
  };

  // Chờ tài liệu (gồm ảnh/style) render xong rồi in
  if (iframe.contentWindow) {
    iframe.contentWindow.onload = triggerPrint;
  }
  // Dự phòng nếu onload không kích hoạt sau document.write
  setTimeout(triggerPrint, 500);
}
