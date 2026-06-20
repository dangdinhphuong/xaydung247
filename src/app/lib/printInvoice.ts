import type { AppSettings, Invoice } from '../types';
import {
  DEFAULT_INVOICE_TEMPLATE_A5,
  DEFAULT_INVOICE_TEMPLATE_A4,
  DEFAULT_INVOICE_TEMPLATE_K80,
  prepareInvoiceTemplateData,
} from './invoiceTemplate';
import { renderTemplate } from './templateRenderer';

/** Bọc fragment HTML thành tài liệu hoàn chỉnh phù hợp với khổ giấy. */
function wrapFragment(inner: string, paperSize: string = 'A5'): string {
  let pageSizeStyle = 'A5 portrait; margin: 8mm;';
  let bodyFontSize = '11px';
  if (paperSize === 'A4') {
    pageSizeStyle = 'A4 portrait; margin: 12mm;';
    bodyFontSize = '13px';
  } else if (paperSize === 'K80') {
    pageSizeStyle = '80mm auto; margin: 4mm;';
    bodyFontSize = '10px';
  }

  return `<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8">
<style>
  @page { size: ${pageSizeStyle} }
  body { font-family: 'Arial', 'Times New Roman', serif; color: #000; font-size: ${bodyFontSize}; margin: 0; padding: 0; }
  table { width: 100%; border-collapse: collapse; }
  img { max-width: 100%; }
</style></head>
<body>${inner}</body></html>`;
}

/**
 * Tiền xử lý mã HTML để convert các token KiotViet {Token} sang double-brace {{Token}} 
 * tương thích với template renderer của hệ thống.
 */
export function preprocessKiotVietTokens(html: string): string {
  if (!html) return '';
  let result = html;

  // 1. Tự động bao bọc thẻ <tr> chứa các token sản phẩm vào khối lặp {{#items}}...{{/items}}
  // Tìm bất kỳ thẻ <tr> nào chứa {Ten_Hang_Hoa} hoặc {Ten_Hang} hoặc {So_Luong} hoặc {Thanh_Tien}
  result = result.replace(/<tr\b[^>]*>(?:(?!<\/tr>)[\s\S])*(?:Ten_Hang_Hoa|Ten_Hang|Don_Gia_Chiet_Khau|So_Luong|Thanh_Tien)(?:(?!<\/tr>)[\s\S])*<\/tr>/gi, (match) => {
    // Nếu dòng này đã nằm sẵn trong loop items thì bỏ qua không bao bọc thêm
    if (/\{\{#items\}\}/i.test(result) && result.indexOf(match) > result.indexOf('{{#items}}')) {
      return match;
    }
    return `{{#items}}${match}{{/items}}`;
  });

  // 2. Map các token KiotViet về token Mustache nội bộ của hệ thống
  const tokenMap: Record<string, string> = {
    'Logo_Cua_Hang': 'Ten_Cong_Ty', // Có thể chèn logo dạng ảnh thay thế hoặc tên cửa hàng
    'Ten_Cua_Hang': 'Ten_Cong_Ty',
    'Dia_Chi_Chi_Nhanh': 'Dia_Chi_Cong_Ty',
    'Dien_Thoai_Chi_Nhanh': 'So_Dien_Thoai_Cong_Ty',
    'Tieu_De_In': 'Tieu_De_In',
    'Ma_Don_Hang': 'Ma_Hoa_Don',
    'Ngay': 'Ngay',
    'Thang': 'Thang',
    'Nam': 'Nam',
    'Khach_Hang': 'Khach_Hang',
    'So_Dien_Thoai': 'So_Dien_Thoai_Khach_Hang',
    'Dia_Chi_Khach_Hang': 'Dia_Chi_Khach_Hang',
    
    // Hàng hóa
    'Ten_Hang_Hoa': 'Ten_Hang',
    'Don_Gia_Chiet_Khau': 'Don_Gia',
    'So_Luong': 'So_Luong',
    'Thanh_Tien': 'Thanh_Tien',
    
    // Thanh toán
    'Tong_Tien_Hang': 'Tong_Tien',
    'Chiet_Khau_Hoa_Don': 'Chiet_Khau_Tong',
    'Tong_Cong': 'Tong_Cong',
    'Tong_Cong_Bang_Chu': 'Tien_Bang_Chu',
    'Ma_QR': 'Ma_QR',
  };

  // Thay thế {Token} bằng {{Token}}
  Object.entries(tokenMap).forEach(([kvToken, internalToken]) => {
    const regex = new RegExp(`\\{${kvToken}\\}`, 'g');
    result = result.replace(regex, `{{${internalToken}}}`);
  });

  return result;
}

/**
 * Render hóa đơn theo template trong settings rồi in (chỉ phần hóa đơn).
 * - Template rỗng/không hợp lệ → dùng mẫu mặc định theo khổ giấy.
 * - Dùng iframe ẩn để cô lập CSS và không in sidebar/navbar/nút bấm.
 */
export function buildInvoiceHtml(
  invoice: Invoice,
  settings?: Partial<AppSettings> | null,
): string {
  const paperSize = settings?.invoiceTemplatePaperSize ?? 'A5';
  const raw = settings?.invoiceTemplateHtml?.trim();
  const defaultTemplate = paperSize === 'A4'
    ? DEFAULT_INVOICE_TEMPLATE_A4
    : paperSize === 'K80'
      ? DEFAULT_INVOICE_TEMPLATE_K80
      : DEFAULT_INVOICE_TEMPLATE_A5;

  let template = raw && raw.length > 0 ? raw : defaultTemplate;
  
  // Áp dụng tiền xử lý token KiotViet
  template = preprocessKiotVietTokens(template);

  const data = prepareInvoiceTemplateData(invoice, settings);
  let html = renderTemplate(template, data);
  if (!html || !html.trim()) {
    // Fallback cứng nếu render ra rỗng
    html = renderTemplate(defaultTemplate, data);
  }
  if (!/<html[\s>]/i.test(html)) html = wrapFragment(html, paperSize);
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
