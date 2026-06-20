import type { TemplateSchema, TemplateBlock, TemplateSampleData } from '../types/template';

// Convert schema to HTML
export function schemaToHTML(schema: TemplateSchema, sampleData: TemplateSampleData): string {
  const blocks = schema.blocks
    .filter((block) => block.visible)
    .map((block) => blockToHTML(block, sampleData, schema.primaryColor))
    .join('\n\n');

  let pageSizeStyle = 'A5 portrait; margin: 8mm;';
  let bodyFontSize = '11px';
  if (schema.paperSize === 'A4') {
    pageSizeStyle = 'A4 portrait; margin: 12mm;';
    bodyFontSize = '13px';
  } else if (schema.paperSize === 'K80') {
    pageSizeStyle = '80mm auto; margin: 4mm;';
    bodyFontSize = '10px';
  }

  // Generate serialized schema
  const schemaStr = JSON.stringify(schema);
  const base64Schema = btoa(unescape(encodeURIComponent(schemaStr)));

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>{{Ma_Hoa_Don}}</title>
  <style>
    @page { size: ${pageSizeStyle} }
    body { font-family: 'Arial', 'Times New Roman', serif; color: #000; font-size: ${bodyFontSize}; margin: 0; padding: 0; line-height: 1.3; }
    table { width: 100%; border-collapse: collapse; }
    img { max-width: 100%; }
  </style>
</head>
<body>
  <div style="padding: ${schema.margins.top}px ${schema.margins.right}px ${schema.margins.bottom}px ${schema.margins.left}px;">
    ${blocks}
  </div>
  <!-- SCHEMA_DATA: ${base64Schema} -->
</body>
</html>`;
}

// Extract schema from HTML
export function extractSchemaFromHTML(html: string): TemplateSchema | null {
  const match = html.match(/<!-- SCHEMA_DATA:\s*([A-Za-z0-9+/=]+)\s*-->/);
  if (!match) return null;
  try {
    const jsonStr = decodeURIComponent(escape(atob(match[1])));
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Lỗi giải mã schema từ HTML:', e);
    return null;
  }
}

function blockToHTML(block: TemplateBlock, data: TemplateSampleData, primaryColor: string): string {
  const baseStyle = `margin-top: ${block.style.marginTop || 0}px; margin-bottom: ${block.style.marginBottom || 0}px; padding-top: ${block.style.paddingTop || 0}px; padding-bottom: ${block.style.paddingBottom || 0}px;`;

  switch (block.type) {
    case 'header':
      return generateHeaderHTML(block, data, baseStyle);
    case 'invoice-title':
      return generateInvoiceTitleHTML(block, data, baseStyle, primaryColor);
    case 'customer-info':
      return generateCustomerInfoHTML(block, data, baseStyle);
    case 'invoice-meta':
      return generateInvoiceMetaHTML(block, data, baseStyle);
    case 'items-table':
      return generateItemsTableHTML(block, data, baseStyle, primaryColor);
    case 'totals':
      return generateTotalsHTML(block, data, baseStyle, primaryColor);
    case 'payment-info':
      return generatePaymentInfoHTML(block, data, baseStyle);
    case 'signature':
      return generateSignatureHTML(block, data, baseStyle);
    case 'footer':
      return generateFooterHTML(block, data, baseStyle);
    default:
      return '';
  }
}

function generateHeaderHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  const textAlign = block.layout === 'logo-center' ? 'center' : block.layout === 'logo-right' ? 'right' : 'left';
  
  return `<div style="${baseStyle} text-align: ${textAlign};">
  ${block.showCompanyName ? `<h1 style="color: ${block.style.color || '#1E88E5'}; margin: 0; font-size: ${block.style.fontSize || 24}px; font-weight: ${block.style.fontWeight || 'bold'};">{{Ten_Cong_Ty}}</h1>` : ''}
  ${block.showAddress ? `<p style="margin: 3px 0;">{{Dia_Chi_Cong_Ty}}</p>` : ''}
  ${block.showPhone || block.showEmail ? `<p style="margin: 3px 0;">${block.showPhone ? 'ĐT: {{So_Dien_Thoai_Cong_Ty}}' : ''}${block.showPhone && block.showEmail ? ' • ' : ''}${block.showEmail ? 'Email: {{Email_Cong_Ty}}' : ''}</p>` : ''}
  ${block.showTaxCode ? `<p style="margin: 3px 0;">MST: {{Ma_So_Thue_Cong_Ty}}</p>` : ''}
</div>`;
}

function generateInvoiceTitleHTML(block: any, data: TemplateSampleData, baseStyle: string, primaryColor: string): string {
  const borderStyle = block.showBorder ? `border-top: 1px dashed ${primaryColor}; border-bottom: 1px dashed ${primaryColor}; padding: 10px 0;` : '';
  
  return `<div style="${baseStyle} ${borderStyle} text-align: center;">
  <h2 style="margin: 0; font-size: ${block.style.fontSize || 24}px; font-weight: bold;">${block.title || 'HÓA ĐƠN BÁN HÀNG'}</h2>
  ${block.showInvoiceCode ? `<p style="margin: 6px 0; color: ${primaryColor}; font-weight: bold;">Số: {{Ma_Hoa_Don}}</p>` : ''}
</div>`;
}

function generateCustomerInfoHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  return `<div style="${baseStyle} font-size: ${block.style.fontSize || 11}px;">
  ${block.showName ? `<p style="margin: 3px 0;"><strong>Khách hàng:</strong> {{Khach_Hang}}</p>` : ''}
  ${block.showAddress ? `<p style="margin: 3px 0;"><strong>Địa chỉ:</strong> {{Dia_Chi_Khach_Hang}}</p>` : ''}
  ${block.showPhone ? `<p style="margin: 3px 0;"><strong>Điện thoại:</strong> {{So_Dien_Thoai_Khach_Hang}}</p>` : ''}
  ${block.showTaxCode ? `<p style="margin: 3px 0;"><strong>MST:</strong> {{Ma_So_Thue_Khach_Hang}}</p>` : ''}
</div>`;
}

function generateInvoiceMetaHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  if (block.layout === 'two-columns') {
    return `<div style="${baseStyle} display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: ${block.style.fontSize || 11}px;">
  <div>
    ${block.showCreatedDate ? `<p style="margin: 3px 0;"><strong>Ngày tạo:</strong> {{Ngay_Tao}}</p>` : ''}
  </div>
  <div>
    ${block.showDueDate ? `<p style="margin: 3px 0;"><strong>Hạn thanh toán:</strong> {{Ngay_Den_Han}}</p>` : ''}
  </div>
</div>`;
  } else {
    return `<div style="${baseStyle} font-size: ${block.style.fontSize || 11}px;">
  ${block.showCreatedDate ? `<p style="margin: 3px 0;"><strong>Ngày tạo:</strong> {{Ngay_Tao}}</p>` : ''}
  ${block.showDueDate ? `<p style="margin: 3px 0;"><strong>Hạn thanh toán:</strong> {{Ngay_Den_Han}}</p>` : ''}
</div>`;
  }
}

function generateItemsTableHTML(block: any, data: TemplateSampleData, baseStyle: string, primaryColor: string): string {
  const headerBg = block.headerColor || primaryColor;
  const headerText = block.headerTextColor || '#ffffff';
  const borderStyle = block.showBorders ? 'border: 1px solid #000;' : 'border-bottom: 1px dashed #666;';

  return `<table style="${baseStyle} width: 100%; border-collapse: collapse; margin: 10px 0; font-size: ${block.style.fontSize || 10}px;">
  ${block.showHeader ? `<thead>
    <tr style="background-color: ${headerBg}; color: ${headerText};">
      ${block.columns.stt ? `<th style="${borderStyle} padding: 5px; text-align: center;">STT</th>` : ''}
      ${block.columns.name ? `<th style="${borderStyle} padding: 5px; text-align: left;">Tên hàng</th>` : ''}
      ${block.columns.unit ? `<th style="${borderStyle} padding: 5px; text-align: center;">ĐVT</th>` : ''}
      ${block.columns.quantity ? `<th style="${borderStyle} padding: 5px; text-align: right;">SL</th>` : ''}
      ${block.columns.price ? `<th style="${borderStyle} padding: 5px; text-align: right;">Đơn giá</th>` : ''}
      ${block.columns.discount ? `<th style="${borderStyle} padding: 5px; text-align: right;">CK</th>` : ''}
      ${block.columns.tax ? `<th style="${borderStyle} padding: 5px; text-align: right;">Thuế</th>` : ''}
      ${block.columns.amount ? `<th style="${borderStyle} padding: 5px; text-align: right;">Thành tiền</th>` : ''}
    </tr>
  </thead>` : ''}
  <tbody>
    {{#items}}
    <tr>
      ${block.columns.stt ? `<td style="${borderStyle} padding: 5px; text-align: center;">{{STT}}</td>` : ''}
      ${block.columns.name ? `<td style="${borderStyle} padding: 5px; text-align: left;">{{Ten_Hang}}</td>` : ''}
      ${block.columns.unit ? `<td style="${borderStyle} padding: 5px; text-align: center;">{{Don_Vi}}</td>` : ''}
      ${block.columns.quantity ? `<td style="${borderStyle} padding: 5px; text-align: right;">{{So_Luong}}</td>` : ''}
      ${block.columns.price ? `<td style="${borderStyle} padding: 5px; text-align: right;">{{Don_Gia}}</td>` : ''}
      ${block.columns.discount ? `<td style="${borderStyle} padding: 5px; text-align: right;">{{Giam_Gia}}</td>` : ''}
      ${block.columns.tax ? `<td style="${borderStyle} padding: 5px; text-align: right;">{{Thue}}</td>` : ''}
      ${block.columns.amount ? `<td style="${borderStyle} padding: 5px; text-align: right; font-weight: bold;">{{Thanh_Tien}}</td>` : ''}
    </tr>
    {{/items}}
  </tbody>
</table>`;
}

function generateTotalsHTML(block: any, data: TemplateSampleData, baseStyle: string, primaryColor: string): string {
  const alignStyle = block.align === 'right' ? 'justify-content: flex-end;' : 'justify-content: flex-start;';
  const width = block.width || 240;

  return `<div style="${baseStyle} display: flex; ${alignStyle} font-size: ${block.style.fontSize || 10.5}px;">
  <div style="width: ${width}px;">
    ${block.showSubtotal ? `<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px dashed #ddd;">
      <span>Tổng tiền hàng:</span>
      <span>{{Tong_Tien}}</span>
    </div>` : ''}
    ${block.showDiscount ? `<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px dashed #ddd;">
      <span>Chiết khấu:</span>
      <span>-{{Chiet_Khau_Tong}}</span>
    </div>` : ''}
    ${block.showTax ? `<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px dashed #ddd;">
      <span>Thuế VAT:</span>
      <span>{{Thue}}</span>
    </div>` : ''}
    ${block.showShipping ? `<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px dashed #ddd;">
      <span>Phí vận chuyển:</span>
      <span>{{Phi_Van_Chuyen}}</span>
    </div>` : ''}
    ${block.showGrandTotal ? `<div style="display: flex; justify-content: space-between; padding: 4px 0; border-top: 1px dashed #000; border-bottom: 1px solid #000; font-size: ${ (block.style.fontSize || 10.5) + 1 }px; font-weight: bold; color: ${primaryColor};">
      <span>TỔNG CỘNG:</span>
      <span>{{Tong_Cong}}</span>
    </div>` : ''}
    ${block.showPaid ? `<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px dashed #ddd; color: #2e7d32;">
      <span>Đã thanh toán:</span>
      <span>{{Da_Thanh_Toan}}</span>
    </div>` : ''}
    ${block.showRemaining ? `<div style="display: flex; justify-content: space-between; padding: 3px 0; font-weight: bold; color: #ef6c00;">
      <span>Còn lại:</span>
      <span>{{Con_Lai}}</span>
    </div>` : ''}
    ${block.showInWords ? `<p style="margin-top: 6px; font-style: italic; font-size: ${ (block.style.fontSize || 10.5) - 0.5 }px; color: #444;">Số tiền bằng chữ: {{Tien_Bang_Chu}}</p>` : ''}
  </div>
</div>`;
}

function generatePaymentInfoHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  return `<div style="${baseStyle} font-size: ${block.style.fontSize || 10}px;">
  ${block.showBankInfo ? `<div style="border: 1px dashed #ccc; padding: 8px; border-radius: 4px; background: #fafafa; margin-bottom: 5px;">
    <p style="margin: 2px 0;"><strong>Thông tin tài khoản ngân hàng:</strong></p>
    <p style="margin: 2px 0;">Ngân hàng: MB Bank (Ngân hàng Quân Đội)</p>
    <p style="margin: 2px 0;">Số tài khoản: 190200888888</p>
    <p style="margin: 2px 0;">Chủ tài khoản: {{Ten_Cong_Ty}}</p>
  </div>` : ''}
  ${block.showQRCode ? `<div style="text-align: center; margin-top: 5px;">
    <p style="margin: 2px 0; font-style: italic; font-size: 9px;">Quét mã QR để chuyển khoản nhanh</p>
    <div style="display: inline-block; width: 90px; height: 90px; border: 1px solid #ccc; padding: 5px; background: #fff; margin-top: 3px;">[MÃ QR]</div>
  </div>` : ''}
</div>`;
}

function generateSignatureHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  if (block.layout === 'two-columns') {
    return `<div style="${baseStyle} display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center; font-size: ${block.style.fontSize || 10.5}px;">
  ${block.showSellerSignature ? `<div>
    <p style="margin: 0;"><strong>Người mua hàng</strong></p>
    <p style="margin: 2px 0 0 0; font-size: 9px; font-style: italic; color: #555;">(Ký, ghi rõ họ tên)</p>
  </div>` : '<div></div>'}
  ${block.showCustomerSignature ? `<div>
    <p style="margin: 0;"><strong>Người bán hàng</strong></p>
    <p style="margin: 2px 0 0 0; font-size: 9px; font-style: italic; color: #555;">(Ký, ghi rõ họ tên)</p>
  </div>` : '<div></div>'}
</div>`;
  } else {
    return `<div style="${baseStyle} text-align: center; font-size: ${block.style.fontSize || 10.5}px;">
  ${block.showSellerSignature ? `<div style="margin-bottom: 15px;">
    <p style="margin: 0;"><strong>Người mua hàng</strong></p>
    <p style="margin: 2px 0 0 0; font-size: 9px; font-style: italic; color: #555;">(Ký, ghi rõ họ tên)</p>
  </div>` : ''}
  ${block.showCustomerSignature ? `<div>
    <p style="margin: 0;"><strong>Người bán hàng</strong></p>
    <p style="margin: 2px 0 0 0; font-size: 9px; font-style: italic; color: #555;">(Ký, ghi rõ họ tên)</p>
  </div>` : ''}
</div>`;
  }
}

function generateFooterHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  return `<div style="${baseStyle} text-align: center; font-style: italic; color: #555; font-size: ${block.style.fontSize || 10}px;">
  ${block.showThankYou ? `<p style="margin: 3px 0;">Cảm ơn Quý khách đã mua hàng. Hẹn gặp lại!</p>` : ''}
  ${block.showTerms ? `<p style="margin: 5px 0 3px 0; font-size: 9px; color: #777;">Điều khoản: Hàng mua rồi vui lòng miễn đổi trả.</p>` : ''}
  ${block.customText ? `<p style="margin: 3px 0; font-weight: bold;">${block.customText}</p>` : ''}
</div>`;
}

// Detect if HTML contains custom code beyond what blocks can represent
export function isCustomHTML(html: string): boolean {
  // If it doesn't contain the SCHEMA_DATA comment, we treat it as custom HTML
  return !/<!-- SCHEMA_DATA:\s*([A-Za-z0-9+/=]+)\s*-->/.test(html);
}

// Validate HTML structure
export function validateHTML(html: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for balanced loop tags
  const itemsOpenCount = (html.match(/\{\{#items\}\}/g) || []).length;
  const itemsCloseCount = (html.match(/\{\{\/items\}\}/g) || []).length;
  
  if (itemsOpenCount !== itemsCloseCount) {
    errors.push('Vòng lặp {{#items}} không đầy đủ (thiếu tag đóng)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
