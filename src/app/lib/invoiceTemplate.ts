import type { AppSettings, Invoice } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

/** Mẫu in hóa đơn mặc định (fallback khi settings.invoiceTemplateHtml rỗng/không hợp lệ). */
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

/** Danh sách placeholder gợi ý hiển thị trong màn hình cấu hình (chỉ gợi ý). */
export const TEMPLATE_PLACEHOLDER_GROUPS: { group: string; items: string[] }[] = [
  {
    group: 'Công ty',
    items: ['Ten_Cong_Ty', 'Dia_Chi_Cong_Ty', 'So_Dien_Thoai_Cong_Ty', 'Email_Cong_Ty', 'Ma_So_Thue_Cong_Ty'],
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
  ],
  subtotal: 3800000,
  discount: 100000,
  tax: 370000,
  shipping: 50000,
  total: 4120000,
  paidAmount: 1000000,
  remainingBalance: 3120000,
  notes: 'Giao hàng trong giờ hành chính.',
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
  return {
    // Công ty
    Ten_Cong_Ty: s.companyName ?? '',
    Dia_Chi_Cong_Ty: s.companyAddress ?? '',
    So_Dien_Thoai_Cong_Ty: s.companyPhone ?? '',
    Email_Cong_Ty: s.companyEmail ?? '',
    Ma_So_Thue_Cong_Ty: s.companyTaxCode ?? '',

    // Hóa đơn
    Ma_Hoa_Don: invoice.invoiceNumber ?? 'NHÁP',
    Ngay_Tao: invoice.issueDate ? formatDate(invoice.issueDate) : '',
    Ngay_Den_Han: invoice.dueDate ? formatDate(invoice.dueDate) : '',
    Trang_Thai: STATUS_LABEL[invoice.status] ?? invoice.status,

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
