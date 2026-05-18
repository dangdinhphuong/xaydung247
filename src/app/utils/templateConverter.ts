import type { TemplateSchema, TemplateBlock, TemplateSampleData } from '../types/template';

// Convert schema to HTML
export function schemaToHTML(schema: TemplateSchema, sampleData: TemplateSampleData): string {
  const blocks = schema.blocks
    .filter((block) => block.visible)
    .map((block) => blockToHTML(block, sampleData, schema.primaryColor))
    .join('\n\n');

  return `<div style="padding: ${schema.margins.top}px ${schema.margins.right}px ${schema.margins.bottom}px ${schema.margins.left}px; font-family: Inter, sans-serif;">
${blocks}
</div>`;
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
  ${block.showCompanyName ? `<h1 style="color: ${block.style.color || '#1E88E5'}; margin: 0; font-size: ${block.style.fontSize || 24}px; font-weight: ${block.style.fontWeight || 'bold'};">{Ten_Cong_Ty}</h1>` : ''}
  ${block.showAddress ? `<p style="margin: 5px 0;">{Dia_Chi_Cong_Ty}</p>` : ''}
  ${block.showPhone || block.showEmail ? `<p style="margin: 5px 0;">${block.showPhone ? 'ĐT: {So_Dien_Thoai_Cong_Ty}' : ''}${block.showPhone && block.showEmail ? ' • ' : ''}${block.showEmail ? 'Email: {Email_Cong_Ty}' : ''}</p>` : ''}
  ${block.showTaxCode ? `<p style="margin: 5px 0;">MST: {Ma_So_Thue_Cong_Ty}</p>` : ''}
</div>`;
}

function generateInvoiceTitleHTML(block: any, data: TemplateSampleData, baseStyle: string, primaryColor: string): string {
  const borderStyle = block.showBorder ? `border-top: 2px solid ${primaryColor}; border-bottom: 2px solid ${primaryColor}; padding: 15px 0;` : '';
  
  return `<div style="${baseStyle} ${borderStyle} text-align: center;">
  <h2 style="margin: 0; font-size: ${block.style.fontSize || 24}px; font-weight: bold;">${block.title || 'HÓA ĐƠN BÁN HÀNG'}</h2>
  ${block.showInvoiceCode ? `<p style="margin: 10px 0; color: ${primaryColor}; font-weight: bold;">{Ma_Hoa_Don}</p>` : ''}
</div>`;
}

function generateCustomerInfoHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  return `<div style="${baseStyle}">
  ${block.showName ? `<p><strong>Khách hàng:</strong> {Khach_Hang}</p>` : ''}
  ${block.showAddress ? `<p><strong>Địa chỉ:</strong> {Dia_Chi_Khach_Hang}</p>` : ''}
  ${block.showPhone ? `<p><strong>Điện thoại:</strong> {So_Dien_Thoai}</p>` : ''}
  ${block.showTaxCode ? `<p><strong>MST:</strong> {Ma_So_Thue_Khach}</p>` : ''}
</div>`;
}

function generateInvoiceMetaHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  if (block.layout === 'two-columns') {
    return `<div style="${baseStyle} display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
  <div>
    ${block.showCreatedDate ? `<p><strong>Ngày tạo:</strong> {Ngay_Tao}</p>` : ''}
  </div>
  <div>
    ${block.showDueDate ? `<p><strong>Ngày đến hạn:</strong> {Ngay_Den_Han}</p>` : ''}
  </div>
</div>`;
  } else {
    return `<div style="${baseStyle}">
  ${block.showCreatedDate ? `<p><strong>Ngày tạo:</strong> {Ngay_Tao}</p>` : ''}
  ${block.showDueDate ? `<p><strong>Ngày đến hạn:</strong> {Ngay_Den_Han}</p>` : ''}
</div>`;
  }
}

function generateItemsTableHTML(block: any, data: TemplateSampleData, baseStyle: string, primaryColor: string): string {
  const headerBg = block.headerColor || primaryColor;
  const headerText = block.headerTextColor || '#ffffff';
  const borderStyle = block.showBorders ? 'border: 1px solid #ddd;' : '';

  return `<table style="${baseStyle} width: 100%; border-collapse: collapse; margin: 20px 0;">
  ${block.showHeader ? `<thead>
    <tr style="background-color: ${headerBg}; color: ${headerText};">
      ${block.columns.stt ? `<th style="${borderStyle} padding: 10px; text-align: left;">STT</th>` : ''}
      ${block.columns.name ? `<th style="${borderStyle} padding: 10px; text-align: left;">Tên hàng</th>` : ''}
      ${block.columns.unit ? `<th style="${borderStyle} padding: 10px; text-align: center;">ĐVT</th>` : ''}
      ${block.columns.quantity ? `<th style="${borderStyle} padding: 10px; text-align: right;">SL</th>` : ''}
      ${block.columns.price ? `<th style="${borderStyle} padding: 10px; text-align: right;">Đơn giá</th>` : ''}
      ${block.columns.discount ? `<th style="${borderStyle} padding: 10px; text-align: right;">CK</th>` : ''}
      ${block.columns.tax ? `<th style="${borderStyle} padding: 10px; text-align: right;">Thuế</th>` : ''}
      ${block.columns.amount ? `<th style="${borderStyle} padding: 10px; text-align: right;">Thành tiền</th>` : ''}
    </tr>
  </thead>` : ''}
  <tbody>
    {{#Items}}
    <tr>
      ${block.columns.stt ? `<td style="${borderStyle} padding: 8px;">{STT}</td>` : ''}
      ${block.columns.name ? `<td style="${borderStyle} padding: 8px;">{Ten_Hang}</td>` : ''}
      ${block.columns.unit ? `<td style="${borderStyle} padding: 8px; text-align: center;">{Don_Vi}</td>` : ''}
      ${block.columns.quantity ? `<td style="${borderStyle} padding: 8px; text-align: right;">{So_Luong}</td>` : ''}
      ${block.columns.price ? `<td style="${borderStyle} padding: 8px; text-align: right;">{Don_Gia}</td>` : ''}
      ${block.columns.discount ? `<td style="${borderStyle} padding: 8px; text-align: right;">{Chiet_Khau}</td>` : ''}
      ${block.columns.tax ? `<td style="${borderStyle} padding: 8px; text-align: right;">{Thue}</td>` : ''}
      ${block.columns.amount ? `<td style="${borderStyle} padding: 8px; text-align: right;"><strong>{Thanh_Tien}</strong></td>` : ''}
    </tr>
    {{/Items}}
  </tbody>
</table>`;
}

function generateTotalsHTML(block: any, data: TemplateSampleData, baseStyle: string, primaryColor: string): string {
  const alignStyle = block.align === 'right' ? 'justify-content: flex-end;' : 'justify-content: flex-start;';
  const width = block.width || 300;

  return `<div style="${baseStyle} display: flex; ${alignStyle}">
  <div style="width: ${width}px;">
    ${block.showSubtotal ? `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd;">
      <span>Tạm tính:</span>
      <span>{Tong_Tien}</span>
    </div>` : ''}
    ${block.showDiscount ? `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd;">
      <span>Chiết khấu:</span>
      <span>{Chiet_Khau}</span>
    </div>` : ''}
    ${block.showTax ? `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd;">
      <span>Thuế:</span>
      <span>{Thue}</span>
    </div>` : ''}
    ${block.showGrandTotal ? `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 2px solid ${primaryColor}; font-size: 18px; font-weight: bold; color: ${primaryColor};">
      <span>TỔNG CỘNG:</span>
      <span>{Tong_Cong}</span>
    </div>` : ''}
    ${block.showPaid ? `<div style="display: flex; justify-content: space-between; padding: 8px 0; color: green;">
      <span>Đã thanh toán:</span>
      <span>{Da_Thanh_Toan}</span>
    </div>` : ''}
    ${block.showRemaining ? `<div style="display: flex; justify-content: space-between; padding: 8px 0; font-weight: bold; color: orange;">
      <span>Còn lại:</span>
      <span>{Con_Lai}</span>
    </div>` : ''}
    ${block.showInWords ? `<p style="margin-top: 10px; font-style: italic; color: #666;">Bằng chữ: {Tien_Bang_Chu}</p>` : ''}
  </div>
</div>`;
}

function generatePaymentInfoHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  return `<div style="${baseStyle}">
  ${block.showBankInfo ? `<div>
    <p><strong>Thông tin chuyển khoản:</strong></p>
    <p>Ngân hàng: [Tên ngân hàng]</p>
    <p>Số tài khoản: [Số TK]</p>
    <p>Chủ TK: {Ten_Cong_Ty}</p>
  </div>` : ''}
  ${block.showQRCode ? `<div style="margin-top: 10px;">
    <p>[Mã QR thanh toán]</p>
  </div>` : ''}
</div>`;
}

function generateSignatureHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  if (block.layout === 'two-columns') {
    return `<div style="${baseStyle} display: grid; grid-template-columns: 1fr 1fr; gap: 40px; text-align: center;">
  ${block.showSellerSignature ? `<div>
    <p><strong>Người bán hàng</strong></p>
    <p style="margin-top: 60px; color: #999;">(Ký và ghi rõ họ tên)</p>
  </div>` : '<div></div>'}
  ${block.showCustomerSignature ? `<div>
    <p><strong>Khách hàng</strong></p>
    <p style="margin-top: 60px; color: #999;">(Ký và ghi rõ họ tên)</p>
  </div>` : '<div></div>'}
</div>`;
  } else {
    return `<div style="${baseStyle} text-align: center;">
  ${block.showSellerSignature ? `<div style="margin-bottom: 30px;">
    <p><strong>Người bán hàng</strong></p>
    <p style="margin-top: 60px; color: #999;">(Ký và ghi rõ họ tên)</p>
  </div>` : ''}
  ${block.showCustomerSignature ? `<div>
    <p><strong>Khách hàng</strong></p>
    <p style="margin-top: 60px; color: #999;">(Ký và ghi rõ họ tên)</p>
  </div>` : ''}
</div>`;
  }
}

function generateFooterHTML(block: any, data: TemplateSampleData, baseStyle: string): string {
  return `<div style="${baseStyle} text-align: center; font-style: italic; color: #666;">
  ${block.showThankYou ? `<p>Cảm ơn quý khách đã tin tưởng sử dụng sản phẩm của chúng tôi!</p>` : ''}
  ${block.showTerms ? `<p style="margin-top: 10px; font-size: 12px;">Điều khoản: Vui lòng kiểm tra hàng hóa khi nhận. Không chấp nhận đổi trả sau 7 ngày.</p>` : ''}
  ${block.customText ? `<p style="margin-top: 10px;">${block.customText}</p>` : ''}
</div>`;
}

// Detect if HTML contains custom code beyond what blocks can represent
export function isCustomHTML(html: string): boolean {
  // Simple heuristic: if HTML contains script tags, complex CSS, or non-standard structures
  const hasScript = /<script/i.test(html);
  const hasStyle = /<style/i.test(html);
  const hasComplexStructures = /<iframe|<embed|<object/i.test(html);
  
  return hasScript || hasStyle || hasComplexStructures;
}

// Validate HTML structure
export function validateHTML(html: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for balanced loop tags
  const itemsOpenCount = (html.match(/\{\{#Items\}\}/g) || []).length;
  const itemsCloseCount = (html.match(/\{\{\/Items\}\}/g) || []).length;
  
  if (itemsOpenCount !== itemsCloseCount) {
    errors.push('Vòng lặp {{#Items}} không đầy đủ (thiếu tag đóng)');
  }

  // Check for basic HTML structure
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const parserError = doc.querySelector('parsererror');
    
    if (parserError) {
      errors.push('Cú pháp HTML không hợp lệ');
    }
  } catch (e) {
    errors.push('Lỗi phân tích HTML');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
