/**
 * Mẫu in hóa đơn mặc định (HTML + Handlebars/Mustache-style placeholders).
 * Dùng khi seed settings lần đầu. Mặc định là khổ A5.
 */
export const DEFAULT_INVOICE_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>{{Ma_Hoa_Don}}</title>
  <style>
    @page { size: A5 portrait; margin: 8mm; }
    body { font-family: 'Arial', 'Times New Roman', sans-serif; color: #000; font-size: 11px; margin: 0; padding: 0; line-height: 1.3; }
    .header { text-align: center; margin-bottom: 10px; }
    .header h1 { margin: 0 0 3px 0; font-size: 14px; text-transform: uppercase; font-weight: bold; }
    .header div { font-size: 10px; color: #333; }
    .title { text-align: center; margin: 12px 0 6px 0; }
    .title h2 { margin: 0; font-size: 15px; font-weight: bold; }
    .title div { font-size: 10px; font-style: italic; }
    .info { margin-bottom: 8px; font-size: 10.5px; }
    .info table { width: 100%; border: none; }
    .info td { padding: 2px 0; border: none; }
    table.items-table { width: 100%; max-width: 100%; box-sizing: border-box; border-collapse: collapse; margin: 8px 0; font-size: 10px; word-break: break-word; table-layout: fixed; }
    table.items-table th, table.items-table td { border: 1px solid #000; padding: 4px; word-break: break-word; }
    table.items-table th { background: #f2f2f2; font-weight: bold; text-align: center; }
    .totals { width: 100%; margin-top: 8px; font-size: 10.5px; }
    .totals table { width: 240px; margin-left: auto; border-collapse: collapse; }
    .totals td { padding: 2px 4px; border: none; }
    .totals .label { text-align: right; }
    .totals .value { text-align: right; font-weight: bold; }
    .grand-total { border-top: 1px dashed #000; font-size: 12px; font-weight: bold; padding-top: 4px !important; }
    .word-amount { margin-top: 8px; font-style: italic; font-size: 10px; }
    .footer-thanks { text-align: center; margin-top: 12px; font-size: 10px; font-style: italic; }
    .signature { display: flex; justify-content: space-between; margin-top: 25px; text-align: center; font-size: 10.5px; }
    .signature-col { width: 45%; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{Ten_Cong_Ty}}</h1>
    <div>Địa chỉ: {{Dia_Chi_Cong_Ty}}</div>
    <div>Điện thoại: {{So_Dien_Thoai_Cong_Ty}}</div>
    {{#Ma_So_Thue_Cong_Ty}}<div>MST: {{Ma_So_Thue_Cong_Ty}}</div>{{/Ma_So_Thue_Cong_Ty}}
  </div>

  <div class="title">
    <h2>HÓA ĐƠN BÁN HÀNG</h2>
    <div>Số: {{Ma_Hoa_Don}} · Ngày: {{Ngay_Tao}}</div>
  </div>

  <div class="info">
    <table>
      <tr>
        <td style="width: 60%;"><strong>Khách hàng:</strong> {{Khach_Hang}}</td>
        <td style="width: 40%; text-align: right;"><strong>SĐT:</strong> {{So_Dien_Thoai_Khach_Hang}}</td>
      </tr>
      <tr>
        <td colspan="2"><strong>Địa chỉ:</strong> {{Dia_Chi_Khach_Hang}}</td>
      </tr>
      {{#Ghi_Chu}}
      <tr>
        <td colspan="2"><strong>Ghi chú:</strong> {{Ghi_Chu}}</td>
      </tr>
      {{/Ghi_Chu}}
    </table>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 8%;">STT</th>
        <th>Tên hàng</th>
        <th style="width: 12%; text-align: right;">SL</th>
        <th style="width: 20%; text-align: right;">Đơn giá</th>
        <th style="width: 25%; text-align: right;">Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      {{#items}}
      <tr>
        <td style="text-align: center;">{{STT}}</td>
        <td>{{Ten_Hang}}</td>
        <td style="text-align: right;">{{So_Luong}}</td>
        <td style="text-align: right;">{{Don_Gia}}</td>
        <td style="text-align: right;">{{Thanh_Tien}}</td>
      </tr>
      {{/items}}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td class="label">Tổng tiền hàng:</td><td class="value">{{Tong_Tien}}</td></tr>
      {{#Chiet_Khau_Tong}}<tr><td class="label">Chiết khấu:</td><td class="value">-{{Chiet_Khau_Tong}}</td></tr>{{/Chiet_Khau_Tong}}
      {{#Thue}}<tr><td class="label">Thuế VAT:</td><td class="value">{{Thue}}</td></tr>{{/Thue}}
      {{#Phi_Van_Chuyen}}<tr><td class="label">Phí vận chuyển:</td><td class="value">{{Phi_Van_Chuyen}}</td></tr>{{/Phi_Van_Chuyen}}
      <tr><td class="label grand-total">TỔNG CỘNG:</td><td class="value grand-total">{{Tong_Cong}}</td></tr>
      <tr><td class="label">Đã thanh toán:</td><td class="value">{{Da_Thanh_Toan}}</td></tr>
      <tr><td class="label">Còn lại:</td><td class="value">{{Con_Lai}}</td></tr>
    </table>
  </div>

  <div class="word-amount">Số tiền bằng chữ: {{Tien_Bang_Chu}}</div>

  {{#Ten_Ngan_Hang}}
  <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 8px; font-size: 10px; line-height: 1.4;">
    <table style="width: 100%; border: none; border-collapse: collapse;">
      <tr>
        <td style="vertical-align: top; border: none; padding: 0; text-align: left;">
          <strong>Thông tin thanh toán:</strong><br>
          Ngân hàng: {{Ten_Ngan_Hang}} {{#Chi_Nhanh_Ngan_Hang}}({{Chi_Nhanh_Ngan_Hang}}){{/Chi_Nhanh_Ngan_Hang}}<br>
          Số tài khoản: <strong>{{So_Tai_Khoan}}</strong><br>
          Chủ tài khoản: {{Chu_Tai_Khoan}}<br>
          {{#Noi_Dung_Chuyen_Khoan}}Nội dung: <em>{{Noi_Dung_Chuyen_Khoan}}</em>{{/Noi_Dung_Chuyen_Khoan}}
        </td>
        {{#Ma_QR}}
        <td style="width: 100px; text-align: right; vertical-align: top; border: none; padding: 0;">
          {{{Ma_QR}}}
        </td>
        {{/Ma_QR}}
      </tr>
    </table>
  </div>
  {{/Ten_Ngan_Hang}}
  {{^Ten_Ngan_Hang}}
    {{#Ma_QR}}
    <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 8px; text-align: right;">
      {{{Ma_QR}}}
    </div>
    {{/Ma_QR}}
  {{/Ten_Ngan_Hang}}

  <div class="signature">
    <div class="signature-col">
      <strong>Người mua hàng</strong>
      <div style="font-size: 9px; font-style: italic; margin-top: 2px;">(Ký, ghi rõ họ tên)</div>
    </div>
    <div class="signature-col">
      <strong>Người bán hàng</strong>
      <div style="font-size: 9px; font-style: italic; margin-top: 2px;">(Ký, ghi rõ họ tên)</div>
    </div>
  </div>

  <div class="footer-thanks">
    Cảm ơn Quý khách đã mua hàng. Hẹn gặp lại!
  </div>
</body>
</html>`;
