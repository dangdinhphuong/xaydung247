import type { AppSettings, Invoice } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const DEFAULT_INVOICE_TEMPLATE_A5 = `<!DOCTYPE html>
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

export const DEFAULT_INVOICE_TEMPLATE_A4 = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>{{Ma_Hoa_Don}}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { font-family: 'Times New Roman', serif; color: #000; font-size: 13px; margin: 0; padding: 0; line-height: 1.4; }
    .header { text-align: center; margin-bottom: 20px; }
    .header h1 { margin: 0 0 5px 0; font-size: 18px; text-transform: uppercase; font-weight: bold; }
    .header div { font-size: 12px; color: #111; }
    .title { text-align: center; margin: 25px 0 15px 0; }
    .title h2 { margin: 0; font-size: 20px; font-weight: bold; }
    .title div { font-size: 12px; margin-top: 4px; }
    .info { margin-bottom: 20px; font-size: 13px; }
    .info table { width: 100%; border-collapse: collapse; }
    .info td { padding: 4px 0; border: none; }
    table.items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    table.items-table th, table.items-table td { border: 1px solid #000; padding: 8px; }
    table.items-table th { background: #f2f2f2; font-weight: bold; text-align: center; }
    .totals { width: 100%; margin-top: 15px; }
    .totals table { width: 320px; margin-left: auto; border-collapse: collapse; }
    .totals td { padding: 4px 8px; border: none; }
    .totals .label { text-align: right; }
    .totals .value { text-align: right; font-weight: bold; }
    .grand-total { border-top: 2px solid #000; font-size: 15px; font-weight: bold; padding-top: 6px !important; font-size: 15px; }
    .word-amount { margin-top: 15px; font-style: italic; }
    .footer-thanks { text-align: center; margin-top: 30px; font-style: italic; }
    .signature { display: flex; justify-content: space-around; margin-top: 50px; text-align: center; }
    .signature-col { width: 40%; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{Ten_Cong_Ty}}</h1>
    <div>Địa chỉ: {{Dia_Chi_Cong_Ty}}</div>
    <div>Điện thoại: {{So_Dien_Thoai_Cong_Ty}} · Email: {{Email_Cong_Ty}}</div>
    {{#Ma_So_Thue_Cong_Ty}}<div>Mã số thuế: {{Ma_So_Thue_Cong_Ty}}</div>{{/Ma_So_Thue_Cong_Ty}}
  </div>

  <div class="title">
    <h2>HÓA ĐƠN BÁN HÀNG</h2>
    <div>Số hóa đơn: <strong>{{Ma_Hoa_Don}}</strong></div>
    <div>Ngày lập: {{Ngay_Tao}}</div>
  </div>

  <div class="info">
    <table>
      <tr>
        <td style="width: 50%;"><strong>Khách hàng:</strong> {{Khach_Hang}}</td>
        <td style="width: 50%;"><strong>Điện thoại:</strong> {{So_Dien_Thoai_Khach_Hang}}</td>
      </tr>
      <tr>
        <td colspan="2"><strong>Địa chỉ:</strong> {{Dia_Chi_Khach_Hang}}</td>
      </tr>
      {{#Ma_So_Thue_Khach_Hang}}
      <tr>
        <td colspan="2"><strong>Mã số thuế:</strong> {{Ma_So_Thue_Khach_Hang}}</td>
      </tr>
      {{/Ma_So_Thue_Khach_Hang}}
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
        <th style="width: 5%;">STT</th>
        <th>Tên sản phẩm / dịch vụ</th>
        <th style="width: 10%;">ĐVT</th>
        <th style="width: 10%; text-align: right;">SL</th>
        <th style="width: 15%; text-align: right;">Đơn giá</th>
        <th style="width: 12%; text-align: right;">Giảm giá</th>
        <th style="width: 18%; text-align: right;">Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      {{#items}}
      <tr>
        <td style="text-align: center;">{{STT}}</td>
        <td>{{Ten_Hang}}</td>
        <td style="text-align: center;">{{Don_Vi}}</td>
        <td style="text-align: right;">{{So_Luong}}</td>
        <td style="text-align: right;">{{Don_Gia}}</td>
        <td style="text-align: right;">{{Giam_Gia}}</td>
        <td style="text-align: right;">{{Thanh_Tien}}</td>
      </tr>
      {{/items}}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td class="label">Cộng tiền hàng:</td><td class="value">{{Tong_Tien}}</td></tr>
      {{#Chiet_Khau_Tong}}<tr><td class="label">Tổng chiết khấu:</td><td class="value">-{{Chiet_Khau_Tong}}</td></tr>{{/Chiet_Khau_Tong}}
      {{#Thue}}<tr><td class="label">Thuế VAT:</td><td class="value">{{Thue}}</td></tr>{{/Thue}}
      {{#Phi_Van_Chuyen}}<tr><td class="label">Phí vận chuyển:</td><td class="value">{{Phi_Van_Chuyen}}</td></tr>{{/Phi_Van_Chuyen}}
      <tr><td class="label grand-total">TỔNG CỘNG THANH TOÁN:</td><td class="value grand-total">{{Tong_Cong}}</td></tr>
      <tr><td class="label">Đã thanh toán:</td><td class="value">{{Da_Thanh_Toan}}</td></tr>
      <tr><td class="label">Còn lại:</td><td class="value">{{Con_Lai}}</td></tr>
    </table>
  </div>

  <div class="word-amount">Số tiền bằng chữ: <strong>{{Tien_Bang_Chu}}</strong></div>

  {{#Ten_Ngan_Hang}}
  <div style="margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; font-size: 11px; line-height: 1.5;">
    <table style="width: 100%; border: none; border-collapse: collapse;">
      <tr>
        <td style="vertical-align: top; border: none; padding: 0; text-align: left;">
          <strong>Thông tin thanh toán:</strong><br>
          Ngân hàng: {{Ten_Ngan_Hang}} {{#Chi_Nhanh_Ngan_Hang}}({{Chi_Nhanh_Ngan_Hang}}){{/Chi_Nhanh_Ngan_Hang}}<br>
          Số tài khoản: <strong>{{So_Tai_Khoan}}</strong><br>
          Chủ tài khoản: {{Chu_Tai_Khoan}}<br>
          {{#Noi_Dung_Chuyen_Khoan}}Nội dung chuyển khoản: <em>{{Noi_Dung_Chuyen_Khoan}}</em>{{/Noi_Dung_Chuyen_Khoan}}
        </td>
        {{#Ma_QR}}
        <td style="width: 120px; text-align: right; vertical-align: top; border: none; padding: 0;">
          {{{Ma_QR}}}
        </td>
        {{/Ma_QR}}
      </tr>
    </table>
  </div>
  {{/Ten_Ngan_Hang}}
  {{^Ten_Ngan_Hang}}
    {{#Ma_QR}}
    <div style="margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; text-align: right;">
      {{{Ma_QR}}}
    </div>
    {{/Ma_QR}}
  {{/Ten_Ngan_Hang}}

  <div class="signature">
    <div class="signature-col">
      <strong>Người mua hàng</strong>
      <div>(Ký, ghi rõ họ tên)</div>
    </div>
    <div class="signature-col">
      <strong>Người bán hàng</strong>
      <div>(Ký, ghi rõ họ tên)</div>
    </div>
  </div>

  <div class="footer-thanks">
    Cảm ơn Quý khách đã tin tưởng và hợp tác!
  </div>
</body>
</html>`;

export const DEFAULT_INVOICE_TEMPLATE_K80 = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>{{Ma_Hoa_Don}}</title>
  <style>
    @page { size: 80mm auto; margin: 4mm; }
    body { font-family: 'Arial', sans-serif; color: #000; font-size: 10px; margin: 0; padding: 0; line-height: 1.3; }
    .header { text-align: center; margin-bottom: 8px; border-bottom: 1px dashed #000; padding-bottom: 6px; }
    .header h1 { margin: 0 0 2px 0; font-size: 12px; text-transform: uppercase; font-weight: bold; }
    .header div { font-size: 9px; }
    .title { text-align: center; margin: 8px 0; }
    .title h2 { margin: 0; font-size: 13px; font-weight: bold; }
    .title div { font-size: 8px; margin-top: 2px; }
    .info { margin-bottom: 8px; font-size: 9px; line-height: 1.2; border-bottom: 1px dashed #000; padding-bottom: 6px; }
    .info table { width: 100%; }
    .info td { padding: 1px 0; border: none; }
    table.items-table { width: 100%; max-width: 100%; box-sizing: border-box; border-collapse: collapse; margin: 8px 0; font-size: 8.5px; word-break: break-word; table-layout: fixed; }
    table.items-table th, table.items-table td { border-bottom: 1px dashed #666; padding: 4px 2px; word-break: break-word; }
    table.items-table th { font-weight: bold; text-align: left; }
    .totals { width: 100%; margin-top: 6px; font-size: 9px; border-top: 1px dashed #000; padding-top: 6px; }
    .totals table { width: 100%; border-collapse: collapse; }
    .totals td { padding: 1px 2px; border: none; }
    .totals .label { text-align: left; }
    .totals .value { text-align: right; font-weight: bold; }
    .grand-total { font-size: 11px; font-weight: bold; border-top: 1px double #000; padding-top: 4px !important; }
    .word-amount { margin-top: 6px; font-style: italic; font-size: 8.5px; }
    .footer-thanks { text-align: center; margin-top: 10px; font-size: 9px; border-top: 1px dashed #000; padding-top: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{Ten_Cong_Ty}}</h1>
    <div>ĐC: {{Dia_Chi_Cong_Ty}}</div>
    <div>ĐT: {{So_Dien_Thoai_Cong_Ty}}</div>
  </div>

  <div class="title">
    <h2>HÓA ĐƠN BÁN HÀNG</h2>
    <div>Số: {{Ma_Hoa_Don}} · Ngày: {{Ngay_Tao}}</div>
  </div>

  <div class="info">
    <table>
      <tr><td><strong>Khách hàng:</strong> {{Khach_Hang}}</td></tr>
      <tr><td><strong>SĐT:</strong> {{So_Dien_Thoai_Khach_Hang}}</td></tr>
      <tr><td><strong>Địa chỉ:</strong> {{Dia_Chi_Khach_Hang}}</td></tr>
      {{#Ghi_Chu}}<tr><td><strong>Ghi chú:</strong> {{Ghi_Chu}}</td></tr>{{/Ghi_Chu}}
    </table>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Tên hàng</th>
        <th style="text-align: right; width: 15%;">SL</th>
        <th style="text-align: right; width: 25%;">Đơn giá</th>
        <th style="text-align: right; width: 30%;">T.Tiền</th>
      </tr>
    </thead>
    <tbody>
      {{#items}}
      <tr>
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
      <tr class="grand-total"><td class="label">TỔNG CỘNG:</td><td class="value">{{Tong_Cong}}</td></tr>
      <tr><td class="label">Đã thanh toán:</td><td class="value">{{Da_Thanh_Toan}}</td></tr>
      <tr><td class="label">Còn lại:</td><td class="value">{{Con_Lai}}</td></tr>
    </table>
  </div>

  <div class="word-amount">Bằng chữ: {{Tien_Bang_Chu}}</div>

  {{#Ten_Ngan_Hang}}
  <div style="margin-top: 8px; border-top: 1px dashed #000; padding-top: 6px; font-size: 8.5px; line-height: 1.3; text-align: center;">
    <strong>THÔNG TIN THANH TOÁN</strong><br>
    NH: {{Ten_Ngan_Hang}} - STK: <strong>{{So_Tai_Khoan}}</strong><br>
    Chủ TK: {{Chu_Tai_Khoan}}<br>
    {{#Noi_Dung_Chuyen_Khoan}}ND: <em>{{Noi_Dung_Chuyen_Khoan}}</em><br>{{/Noi_Dung_Chuyen_Khoan}}
    {{#Ma_QR}}
    <div style="margin-top: 6px; display: flex; justify-content: center;">
      {{{Ma_QR}}}
    </div>
    {{/Ma_QR}}
  </div>
  {{/Ten_Ngan_Hang}}
  {{^Ten_Ngan_Hang}}
    {{#Ma_QR}}
    <div style="margin-top: 8px; border-top: 1px dashed #000; padding-top: 6px; text-align: center;">
      <div style="display: flex; justify-content: center;">
        {{{Ma_QR}}}
      </div>
    </div>
    {{/Ma_QR}}
  {{/Ten_Ngan_Hang}}

  <div class="footer-thanks">
    Cảm ơn Quý khách. Hẹn gặp lại!
  </div>
</body>
</html>`;

export const DEFAULT_INVOICE_TEMPLATE_A5_COMPACT = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>{{Ma_Hoa_Don}}</title>
  <style>
    @page { size: A5 portrait; margin: 5mm; }
    body { font-family: 'Arial', sans-serif; color: #000; font-size: 10px; margin: 0; padding: 0; line-height: 1.25; }
    .header { text-align: center; margin-bottom: 6px; border-bottom: 1px dashed #000; padding-bottom: 4px; }
    .header h1 { margin: 0 0 2px 0; font-size: 13px; text-transform: uppercase; font-weight: bold; color: #1E88E5; }
    .header div { font-size: 9px; color: #333; }
    .title { text-align: center; margin: 8px 0 4px 0; }
    .title h2 { margin: 0; font-size: 14px; font-weight: bold; text-transform: uppercase; }
    .title div { font-size: 9px; color: #1E88E5; font-weight: bold; }
    .info { margin-bottom: 6px; font-size: 10px; }
    .info table { width: 100%; border: none; }
    .info td { padding: 1px 0; border: none; }
    table.items-table { width: 100%; max-width: 100%; box-sizing: border-box; border-collapse: collapse; margin: 6px 0; font-size: 9px; word-break: break-word; table-layout: fixed; }
    table.items-table th, table.items-table td { border: 1px solid #000; padding: 3px; word-break: break-word; }
    table.items-table th { background: #f2f2f2; font-weight: bold; text-align: center; }
    .totals { width: 100%; margin-top: 6px; font-size: 10px; }
    .totals table { width: 220px; margin-left: auto; border-collapse: collapse; }
    .totals td { padding: 1.5px 4px; border: none; }
    .totals .label { text-align: right; }
    .totals .value { text-align: right; font-weight: bold; }
    .grand-total { border-top: 1px dashed #000; font-size: 11.5px; font-weight: bold; padding-top: 3px !important; color: #1E88E5; }
    .word-amount { margin-top: 6px; font-style: italic; font-size: 9.5px; }
    .footer-thanks { text-align: center; margin-top: 10px; font-size: 9px; font-style: italic; }
    .signature { display: flex; justify-content: space-between; margin-top: 20px; text-align: center; font-size: 10px; }
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
    <div style="font-size: 9px;">Số: {{Ma_Hoa_Don}}</div>
  </div>

  <div class="info">
    <table>
      <tr>
        <td style="width: 50%;"><strong>Ngày tạo:</strong> {{Ngay_Tao}}</td>
        <td style="width: 50%; text-align: right;"><strong>Hạn thanh toán:</strong> {{Ngay_Den_Han}}</td>
      </tr>
      <tr>
        <td style="width: 60%;"><strong>Khách hàng:</strong> {{Khach_Hang}}</td>
        <td style="width: 40%; text-align: right;"><strong>Điện thoại:</strong> {{So_Dien_Thoai_Khach_Hang}}</td>
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
        <th style="width: 12%;">ĐVT</th>
        <th style="width: 10%; text-align: right;">SL</th>
        <th style="width: 20%; text-align: right;">Đơn giá</th>
        <th style="width: 25%; text-align: right;">Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      {{#items}}
      <tr>
        <td style="text-align: center;">{{STT}}</td>
        <td>{{Ten_Hang}}</td>
        <td style="text-align: center;">{{Don_Vi}}</td>
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
    </table>
  </div>

  <div class="word-amount">Bằng chữ: {{Tien_Bang_Chu}}</div>

  {{#Ten_Ngan_Hang}}
  <div style="margin-top: 8px; border-top: 1px dashed #000; padding-top: 6px; font-size: 9px; line-height: 1.35;">
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
        <td style="width: 90px; text-align: right; vertical-align: top; border: none; padding: 0;">
          {{{Ma_QR}}}
        </td>
        {{/Ma_QR}}
      </tr>
    </table>
  </div>
  {{/Ten_Ngan_Hang}}
  {{^Ten_Ngan_Hang}}
    {{#Ma_QR}}
    <div style="margin-top: 8px; border-top: 1px dashed #000; padding-top: 6px; text-align: right;">
      {{{Ma_QR}}}
    </div>
    {{/Ma_QR}}
  {{/Ten_Ngan_Hang}}

  <div class="signature">
    <div class="signature-col">
      <strong>Người mua hàng</strong>
      <div style="font-size: 8px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
    </div>
    <div class="signature-col">
      <strong>Người bán hàng</strong>
      <div style="font-size: 8px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
    </div>
  </div>

  <div class="footer-thanks">
    Cảm ơn Quý khách đã mua hàng. Hẹn gặp lại!
  </div>
</body>
</html>`;

export const DEFAULT_INVOICE_TEMPLATE_HTML = DEFAULT_INVOICE_TEMPLATE_A5;

/** Danh sách placeholder gợi ý hiển thị trong màn hình cấu hình (chỉ gợi ý). */
export const TEMPLATE_PLACEHOLDER_GROUPS: { group: string; items: string[] }[] = [
  {
    group: 'Công ty',
    items: ['Ten_Cong_Ty', 'Dia_Chi_Cong_Ty', 'So_Dien_Thoai_Cong_Ty', 'Email_Cong_Ty', 'Ma_So_Thue_Cong_Ty'],
  },
  {
    group: 'Ngân hàng & QR',
    items: ['Ten_Ngan_Hang', 'So_Tai_Khoan', 'Chu_Tai_Khoan', 'Chi_Nhanh_Ngan_Hang', 'Noi_Dung_Chuyen_Khoan', 'Ma_QR'],
  },
  {
    group: 'Hóa đơn',
    items: ['Ma_Hoa_Don', 'Ngay_Tao', 'Ngay_Den_Han', 'Trang_Thai'],
  },
  {
    group: 'Khách hàng',
    items: ['Khach_Hang', 'Dia_Chi_Khach_Hang', 'So_Dien_Thoai_Khach_Hang', 'Ma_So_Thue_Khach_Hang'],
  },
  {
    group: 'Số tiền',
    items: ['Tong_Tien', 'Chiet_Khau_Tong', 'Thue', 'Phi_Van_Chuyen', 'Tong_Cong', 'Da_Thanh_Toan', 'Con_Lai', 'Tien_Bang_Chu'],
  },
  {
    group: 'Ghi chú',
    items: ['Ghi_Chu'],
  },
  {
    group: 'Danh sách sản phẩm — bọc trong {{#items}} ... {{/items}}',
    items: ['STT', 'Ten_Hang', 'Don_Vi', 'So_Luong', 'Don_Gia', 'Giam_Gia', 'Thanh_Tien'],
  },
];

/** Hóa đơn mẫu để xem trước template trong màn hình cấu hình. */
export const SAMPLE_INVOICE: Invoice = {
  id: 'sample',
  invoiceNumber: 'HD-2026-001',
  customerId: 'sample-cust',
  customerName: 'Công ty TNHH Xây Dựng Minh Phát',
  customerPhone: '0912345678',
  customerAddress: '45 Lê Lợi, Quận 1, TP.HCM',
  customerTaxCode: '0301234567',
  issueDate: '2026-06-08',
  dueDate: '2026-07-08',
  status: 'unpaid',
  isOverdue: false,
  items: [
    { id: '1', productId: 'p1', productName: 'Xi măng PCB40 Hoàng Thạch', unit: 'bao', quantity: 10, unitPrice: 95000, discount: 0, lineTotal: 950000 },
    { id: '2', productId: 'p2', productName: 'Cát xây tô', unit: 'm³', quantity: 3, unitPrice: 350000, discount: 50000, lineTotal: 1000000 },
    { id: '3', productId: 'p3', productName: 'Sơn Dulux nội thất 18L', unit: 'thùng', quantity: 1, unitPrice: 1850000, discount: 0, lineTotal: 1850000 },
    { id: '4', productId: 'p4', productName: 'Gạch thẻ đỏ', unit: 'viên', quantity: 2000, unitPrice: 1200, discount: 0, lineTotal: 2400000 },
    { id: '5', productId: 'p5', productName: 'Sắt phi 10 Hòa Phát', unit: 'cây', quantity: 15, unitPrice: 110000, discount: 0, lineTotal: 1650000 },
    { id: '6', productId: 'p6', productName: 'Đá 1x2 xây dựng', unit: 'm³', quantity: 5, unitPrice: 280000, discount: 0, lineTotal: 1400000 },
    { id: '7', productId: 'p7', productName: 'Ống nhựa Tiền Phong D21', unit: 'mét', quantity: 30, unitPrice: 1800000/100, discount: 0, lineTotal: 540000 },
    { id: '8', productId: 'p8', productName: 'Bản lề inox 304', unit: 'cái', quantity: 8, unitPrice: 45000, discount: 0, lineTotal: 360000 },
  ],
  subtotal: 10150000,
  discount: 150000,
  tax: 1000000,
  shipping: 150000,
  total: 11150000,
  paidAmount: 5000000,
  remainingBalance: 6150000,
  notes: 'Giao hàng bằng xe cẩu vào công trình.',
  payments: [],
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Nháp',
  unpaid: 'Chưa thanh toán',
  partial: 'Thanh toán một phần',
  paid: 'Đã thanh toán',
  void: 'Đã hủy',
};

/** Map invoice + settings → tập placeholder dùng trong template. */
export function prepareInvoiceTemplateData(
  invoice: Invoice,
  settings?: Partial<AppSettings> | null,
): Record<string, unknown> {
  const s = settings ?? {};
  
  const issueDateObj = invoice.issueDate ? new Date(invoice.issueDate) : new Date();
  const day = String(issueDateObj.getDate()).padStart(2, '0');
  const month = String(issueDateObj.getMonth() + 1).padStart(2, '0');
  const year = String(issueDateObj.getFullYear());

  const companyName = s.companyName ?? 'Cửa hàng';
  const bankQRBlock = `<div style="display:inline-block;width:95px;height:95px;border:1px solid #ccc;padding:5px;background:#fff;text-align:center;font-size:8px;line-height:1.2;font-family:Arial,sans-serif;">
    <div style="font-weight:bold;margin-bottom:2px;">MB BANK</div>
    <div style="color:#666;font-size:7.5px;">190200888888</div>
    <div style="font-size:7px;color:#999;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Chủ TK:<br>${companyName}</div>
    <div style="margin-top:4px;width:75px;height:75px;background:#eee;margin-left:auto;margin-right:auto;display:flex;align-items:center;justify-content:center;color:#888;font-size:8px;border:1px solid #ddd;">QR Code</div>
  </div>`;

  const invoiceNumber = invoice.invoiceNumber ?? 'NHÁP';
  const rawNote = s.bankQrNote || 'Thanh toán hóa đơn {{Ma_Hoa_Don}}';
  const memo = rawNote
    .replace(/\{\{\s*Ma_Hoa_Don\s*\}\}/g, invoiceNumber)
    .replace(/\{Ma_Hoa_Don\}/g, invoiceNumber);

  const bankQrImageUrl = s.bankQrImageUrl || '';
  const isQrEnabled = s.bankQrEnabled ?? false;
  const qrImgHtml = (isQrEnabled && bankQrImageUrl)
    ? `<img src="${bankQrImageUrl}" alt="Mã QR thanh toán" style="max-width: 120px; max-height: 120px; display: block;" />`
    : '';

  return {
    // Công ty
    Ten_Cong_Ty: s.companyName ?? '',
    Dia_Chi_Cong_Ty: s.companyAddress ?? '',
    So_Dien_Thoai_Cong_Ty: s.companyPhone ?? '',
    Email_Cong_Ty: s.companyEmail ?? '',
    Ma_So_Thue_Cong_Ty: s.companyTaxCode ?? '',

    // Ngân hàng & QR
    Ten_Ngan_Hang: s.bankName ?? '',
    So_Tai_Khoan: s.bankAccountNumber ?? '',
    Chu_Tai_Khoan: s.bankAccountName ?? '',
    Chi_Nhanh_Ngan_Hang: s.bankBranch ?? '',
    Noi_Dung_Chuyen_Khoan: memo,
    Ma_QR: qrImgHtml,

    // Hóa đơn
    Ma_Hoa_Don: invoice.invoiceNumber ?? 'NHÁP',
    Ngay_Tao: invoice.issueDate ? formatDate(invoice.issueDate) : '',
    Ngay_Den_Han: invoice.dueDate ? formatDate(invoice.dueDate) : '',
    Trang_Thai: STATUS_LABEL[invoice.status] ?? invoice.status,
    Ngay: day,
    Thang: month,
    Nam: year,
    Tieu_De_In: 'HÓA ĐƠN BÁN HÀNG',
    Ma_QR_Block: bankQRBlock,

    // Khách hàng
    Khach_Hang: invoice.customerName ?? '',
    Dia_Chi_Khach_Hang: invoice.customerAddress ?? '',
    So_Dien_Thoai_Khach_Hang: invoice.customerPhone ?? '',
    Ma_So_Thue_Khach_Hang: invoice.customerTaxCode ?? '',

    // Số tiền
    Tong_Tien: formatCurrency(invoice.subtotal),
    Chiet_Khau_Tong: formatCurrency(invoice.discount),
    Thue: formatCurrency(invoice.tax),
    Phi_Van_Chuyen: formatCurrency(invoice.shipping),
    Tong_Cong: formatCurrency(invoice.total),
    Da_Thanh_Toan: formatCurrency(invoice.paidAmount),
    Con_Lai: formatCurrency(invoice.remainingBalance),
    Tien_Bang_Chu: numberToVietnameseWords(invoice.total),

    // Ghi chú
    Ghi_Chu: invoice.notes ?? '',

    // Danh sách sản phẩm
    items: (invoice.items ?? []).map((it, idx) => ({
      STT: idx + 1,
      Ten_Hang: it.productName,
      Don_Vi: it.unit ?? '',
      So_Luong: it.quantity,
      Don_Gia: formatCurrency(it.unitPrice),
      Giam_Gia: it.discount > 0 ? formatCurrency(it.discount) : '0',
      Chiet_Khau: it.discount > 0 ? formatCurrency(it.discount) : '0', // alias docs
      Thanh_Tien: formatCurrency(it.lineTotal),
    })),
  };
}

/* --------------------- Số tiền bằng chữ (tiếng Việt) --------------------- */

const DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const SCALES = ['', 'nghìn', 'triệu', 'tỷ'];

function readTriple(n: number, full: boolean): string {
  const tram = Math.floor(n / 100);
  const chuc = Math.floor((n % 100) / 10);
  const donVi = n % 10;
  const parts: string[] = [];

  if (full || tram > 0) {
    parts.push(DIGITS[tram], 'trăm');
  }
  if (chuc === 0) {
    if (donVi > 0 && (full || tram > 0)) parts.push('lẻ', DIGITS[donVi]);
    else if (donVi > 0) parts.push(DIGITS[donVi]);
  } else if (chuc === 1) {
    parts.push('mười');
    if (donVi === 5) parts.push('lăm');
    else if (donVi > 0) parts.push(DIGITS[donVi]);
  } else {
    parts.push(DIGITS[chuc], 'mươi');
    if (donVi === 1) parts.push('mốt');
    else if (donVi === 5) parts.push('lăm');
    else if (donVi > 0) parts.push(DIGITS[donVi]);
  }
  return parts.join(' ');
}

/** Đọc số tiền VND nguyên dương thành chữ tiếng Việt. */
export function numberToVietnameseWords(amount: number): string {
  let n = Math.round(Math.abs(amount || 0));
  if (n === 0) return 'Không đồng';

  // Tách thành các nhóm 3 chữ số
  const groups: number[] = [];
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    // Nhóm cao nhất không cần "full" trăm; các nhóm sau có nhóm cao hơn → full
    const hasHigher = i < groups.length - 1;
    const text = readTriple(g, hasHigher);
    // i: 0→'', 1→nghìn, 2→triệu, 3→tỷ; ≥4 (≥10^12) hiếm gặp → dùng 'tỷ'
    const scale = i < SCALES.length ? SCALES[i] : SCALES[3];
    parts.push((text + ' ' + scale).trim());
  }

  const result = parts.join(' ').replace(/\s+/g, ' ').trim();
  return result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
}
