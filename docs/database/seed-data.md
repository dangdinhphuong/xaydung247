# Seed Data — MVP v1

Script seed chạy 1 lần khi cài đặt mới (hoặc fresh dev environment). Đảm bảo:
1. Có 1 settings document.
2. Có 1 admin user đầu tiên (để login).
3. (Optional) Có dữ liệu demo cho dev/QA.

Script: `apps/backend/scripts/seed.ts`. Chạy bằng `pnpm seed`.

---

## 1. Settings (bắt buộc)

```typescript
await Settings.create({
  companyName: 'Công ty TNHH Vật Liệu Xây Dựng ABC',
  companyTaxCode: '0123456789',
  companyAddress: '123 Đường Võ Văn Tần, Quận 3, TP.HCM',
  companyPhone: '028 1234 5678',
  companyEmail: 'info@vlxdabc.vn',
  invoicePrefix: 'HD-',
  quotationPrefix: 'BG-',
  defaultDueDays: 30,
  defaultTaxRate: 10,
  autoTax: true,
  invoiceTemplateHtml: DEFAULT_INVOICE_TEMPLATE_HTML,  // see §6
})
```

---

## 2. Admin user (bắt buộc)

Email + password lấy từ env hoặc prompt khi chạy seed.

```typescript
const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 10)
await User.create({
  email: process.env.SEED_ADMIN_EMAIL,  // 'admin@vlxdabc.vn'
  passwordHash,
  fullName: 'Quản trị viên',
  role: 'ADMIN',
  status: 'active',
})
```

CLI prompt nếu chưa có env:
```
$ pnpm seed
? Email cho admin: admin@vlxdabc.vn
? Password (≥ 8 ký tự, có chữ và số): ********
✓ Created admin user
✓ Created settings
✓ Seed completed
```

---

## 3. Demo data (optional, --demo flag)

`pnpm seed --demo` thêm dữ liệu demo từ `mockData.ts` cũ (xem `docs-archive/` để tham khảo). Phù hợp cho dev / QA test.

### Customers (5)

```typescript
[
  { code: 'CUST001', name: 'Công ty TNHH Xây Dựng Hoàng Long', phone: '0912345678', email: 'hoanglong@construction.vn', address: '123 Đường Lê Lợi, Q.1, TP.HCM', taxCode: '0123456789', status: 'active' },
  { code: 'CUST002', name: 'Cửa hàng Vật Liệu Xây Dựng Minh Tâm', phone: '0987654321', email: 'minhtam@vlxd.vn', address: '456 Nguyễn Văn Linh, Q.7, TP.HCM', taxCode: '0987654321', status: 'active' },
  { code: 'CUST003', name: 'Công ty CP Đầu Tư Phát Triển Thiên Phúc', phone: '0909123456', email: 'thienphuc@invest.vn', address: '789 Xa lộ Hà Nội, Q.9, TP.HCM', taxCode: '0909123456', status: 'active' },
  { code: 'CUST004', name: 'Siêu Thị Vật Liệu Xây Dựng Bảo An', phone: '0918888888', email: 'baoan@vlxd.com.vn', address: '321 Quốc lộ 1A, Bình Tân, TP.HCM', taxCode: '0918888888', status: 'active' },
  { code: 'CUST005', name: 'Công ty TNHH Xây Dựng Dân Dụng Tân Thịnh', phone: '0977777777', email: 'tanthinh@construction.vn', address: '555 Võ Văn Kiệt, Q.6, TP.HCM', taxCode: '0977777777', status: 'active' },
]
```

### Products (10)

```typescript
[
  { code: 'PROD001', name: 'Xi măng PCB40 Hoàng Thạch', category: 'Xi măng', unit: 'bao', price: 95000, stock: 500, description: 'Xi măng PCB40 Hoàng Thạch - Bao 50kg', status: 'active' },
  { code: 'PROD002', name: 'Cát xây dựng', category: 'Cát', unit: 'm³', price: 450000, stock: 200, description: 'Cát vàng xây dựng loại 1', status: 'active' },
  { code: 'PROD003', name: 'Đá 1x2', category: 'Đá', unit: 'm³', price: 380000, stock: 150, description: 'Đá dăm 1x2 (10-20mm)', status: 'active' },
  { code: 'PROD004', name: 'Gạch block 10x20x40', category: 'Gạch', unit: 'viên', price: 8500, stock: 10000, description: 'Gạch block xây tường 10x20x40cm', status: 'active' },
  { code: 'PROD005', name: 'Sắt thép D10', category: 'Sắt thép', unit: 'kg', price: 18000, stock: 5000, description: 'Sắt thép đường kính 10mm', status: 'active' },
  { code: 'PROD006', name: 'Cát san lấp', category: 'Cát', unit: 'm³', price: 320000, stock: 300, description: 'Cát san lấp mặt bằng', status: 'active' },
  { code: 'PROD007', name: 'Gạch Đỏ 2 lỗ', category: 'Gạch', unit: 'viên', price: 1800, stock: 20000, description: 'Gạch đỏ ống 2 lỗ 6x9x18cm', status: 'active' },
  { code: 'PROD008', name: 'Xi măng Lafarge Long Sơn', category: 'Xi măng', unit: 'bao', price: 105000, stock: 400, description: 'Xi măng Lafarge Long Sơn PCB40 - Bao 50kg', status: 'active' },
  { code: 'PROD009', name: 'Sơn nội thất Dulux', category: 'Sơn', unit: 'thùng', price: 1250000, stock: 80, description: 'Sơn nội thất Dulux 18L', status: 'active' },
  { code: 'PROD010', name: 'Đá 4x6', category: 'Đá', unit: 'm³', price: 420000, stock: 100, description: 'Đá dăm 4x6 (40-60mm)', status: 'active' },
]
```

### Invoices (8) + Payments (5)

Lấy từ `mockData.ts` gốc, convert sang Mongo schema. Đảm bảo cover các trạng thái:
- 1 draft
- 1 unpaid (chưa đến hạn)
- 3 partial
- 1 paid
- 2 overdue (status unpaid/partial + dueDate quá khứ)

### Quotations (2)

- 1 sent
- 1 accepted (chưa convert)

### Demo users (cho test RBAC)

```typescript
[
  { email: 'accountant@vlxdabc.vn', fullName: 'Kế toán', role: 'ACCOUNTANT', password: 'Demo1234' },
  { email: 'sales@vlxdabc.vn', fullName: 'Sales', role: 'SALES', password: 'Demo1234' },
  { email: 'viewer@vlxdabc.vn', fullName: 'Người xem', role: 'VIEWER', password: 'Demo1234' },
]
```

---

## 4. Idempotency

Script seed kiểm tra:
- Nếu settings đã tồn tại → skip section settings.
- Nếu admin user (theo email) đã tồn tại → skip.
- Demo data có flag `--force` để truncate + reseed.

Bare `pnpm seed` (không `--demo`) chạy nhiều lần OK.

---

## 5. Counters

KHÔNG seed counter. Để collection rỗng. Khi tạo invoice/quotation đầu tiên, `findOneAndUpdate` với `upsert: true` sẽ tạo counter document = 1 tự động.

---

## 6. Default invoice template HTML

```html
<!DOCTYPE html>
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
    .totals { width: 300px; margin-left: auto; }
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
      {{#each items}}
      <tr>
        <td style="text-align: center;">{{STT}}</td>
        <td>{{Ten_Hang}}</td>
        <td style="text-align: center;">{{Don_Vi}}</td>
        <td style="text-align: right;">{{So_Luong}}</td>
        <td style="text-align: right;">{{Don_Gia}}</td>
        <td style="text-align: right;">{{Chiet_Khau}}</td>
        <td style="text-align: right;">{{Thanh_Tien}}</td>
      </tr>
      {{/each}}
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
  {{#if Ghi_Chu}}<div style="margin-top: 10px;">Ghi chú: {{Ghi_Chu}}</div>{{/if}}

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
</html>
```

Đơn giản, Handlebars-style template. FE dùng thư viện như `handlebars` browser-side để render.

---

## 7. Verify sau seed

```bash
$ pnpm seed
✓ Settings created
✓ Admin user created (admin@vlxdabc.vn)
✓ Seed completed

# Check:
$ mongo invoicepro --eval "db.users.countDocuments({})"
1
$ mongo invoicepro --eval "db.settings.countDocuments({})"
1
$ mongo invoicepro --eval "db.counters.countDocuments({})"
0
```
