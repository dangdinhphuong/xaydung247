/**
 * Mẫu in hóa đơn mặc định (HTML + Handlebars/Mustache-style placeholders).
 * Dùng khi seed settings lần đầu. Frontend cũng có bản fallback tương đương.
 */
export const DEFAULT_INVOICE_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>{{Ma_Hoa_Don}}</title>
  <style>
    body { font-family: 'Times New Roman', serif; color: #000; font-size: 13px; }
    .header { text-align: center; margin-bottom: 20px; }
    .header h1 { margin: 0 0 5px 0; font-size: 18px; }
    .info { display: flex; justify-content: space-between; margin-bottom: 15px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #000; padding: 6px; }
    th { background: #f0f0f0; font-weight: bold; }
    .totals { width: 320px; margin-left: auto; }
    .totals td { padding: 4px 8px; border: none; }
    .totals .label { text-align: right; }
    .totals .value { text-align: right; font-weight: bold; }
    .grand-total { border-top: 2px solid #000; padding-top: 4px !important; font-size: 15px; }
    .signature { display: flex; justify-content: space-around; margin-top: 60px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{Ten_Cong_Ty}}</h1>
    <div>{{Dia_Chi_Cong_Ty}}</div>
    <div>ĐT: {{So_Dien_Thoai_Cong_Ty}} · Email: {{Email_Cong_Ty}}</div>
    <div>MST: {{Ma_So_Thue_Cong_Ty}}</div>
  </div>

  <h2 style="text-align: center; margin: 20px 0;">HÓA ĐƠN BÁN HÀNG</h2>
  <div style="text-align: center; margin-bottom: 20px;">Số: <strong>{{Ma_Hoa_Don}}</strong></div>

  <div class="info">
    <div>
      <div><strong>Khách hàng:</strong> {{Khach_Hang}}</div>
      <div>Địa chỉ: {{Dia_Chi_Khach_Hang}}</div>
      <div>SĐT: {{So_Dien_Thoai_Khach_Hang}}</div>
      <div>MST: {{Ma_So_Thue_Khach_Hang}}</div>
    </div>
    <div>
      <div>Ngày tạo: {{Ngay_Tao}}</div>
      <div>Ngày đến hạn: {{Ngay_Den_Han}}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;">STT</th>
        <th>Tên sản phẩm</th>
        <th style="width: 8%;">ĐVT</th>
        <th style="width: 10%;">SL</th>
        <th style="width: 15%;">Đơn giá</th>
        <th style="width: 12%;">Giảm giá</th>
        <th style="width: 15%;">Thành tiền</th>
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

  <table class="totals">
    <tr><td class="label">Tạm tính:</td><td class="value">{{Tong_Tien}}</td></tr>
    <tr><td class="label">Giảm giá:</td><td class="value">{{Chiet_Khau_Tong}}</td></tr>
    <tr><td class="label">Thuế VAT:</td><td class="value">{{Thue}}</td></tr>
    <tr><td class="label">Phí vận chuyển:</td><td class="value">{{Phi_Van_Chuyen}}</td></tr>
    <tr><td class="label grand-total">TỔNG CỘNG:</td><td class="value grand-total">{{Tong_Cong}}</td></tr>
    <tr><td class="label">Đã thanh toán:</td><td class="value">{{Da_Thanh_Toan}}</td></tr>
    <tr><td class="label">Còn lại:</td><td class="value">{{Con_Lai}}</td></tr>
  </table>

  <div style="margin-top: 20px;">Số tiền bằng chữ: <em>{{Tien_Bang_Chu}}</em></div>
  {{#Ghi_Chu}}<div style="margin-top: 10px;">Ghi chú: {{Ghi_Chu}}</div>{{/Ghi_Chu}}

  <div class="signature">
    <div>
      <div><strong>Người mua hàng</strong></div>
      <div>(Ký, ghi rõ họ tên)</div>
    </div>
    <div>
      <div><strong>Người bán hàng</strong></div>
      <div>(Ký, ghi rõ họ tên)</div>
    </div>
  </div>
</body>
</html>`;
