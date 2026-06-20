import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { DEFAULT_INVOICE_TEMPLATE_HTML } from '../src/settings/default-template';

config({ path: resolve(__dirname, '../.env') });

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/invoicepro';
const WITH_DEMO = process.argv.includes('--demo');

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.error(
      '❌ SEED_ADMIN_EMAIL và SEED_ADMIN_PASSWORD bắt buộc. Sửa file .env.',
    );
    process.exit(1);
  }

  console.log(`📦 Đang kết nối ${MONGO_URI}...`);
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db!;

  // 1. Settings (singleton)
  const settingsCol = db.collection('settings');
  const existingSettings = await settingsCol.findOne({});
  if (!existingSettings) {
    await settingsCol.insertOne({
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
      invoiceTemplateHtml: DEFAULT_INVOICE_TEMPLATE_HTML,
      invoiceTemplatePaperSize: 'A5',
      bankName: '',
      bankAccountNumber: '',
      bankAccountName: '',
      bankBranch: '',
      bankQrEnabled: false,
      bankQrImageUrl: '',
      bankQrNote: 'Thanh toán hóa đơn {{Ma_Hoa_Don}}',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✓ Đã tạo Settings');
  } else {
    const updates: any = {};
    if (!existingSettings.invoiceTemplateHtml) {
      updates.invoiceTemplateHtml = DEFAULT_INVOICE_TEMPLATE_HTML;
    }
    if (!existingSettings.invoiceTemplatePaperSize) {
      updates.invoiceTemplatePaperSize = 'A5';
    }
    if (existingSettings.bankName === undefined) {
      updates.bankName = '';
    }
    if (existingSettings.bankAccountNumber === undefined) {
      updates.bankAccountNumber = '';
    }
    if (existingSettings.bankAccountName === undefined) {
      updates.bankAccountName = '';
    }
    if (existingSettings.bankBranch === undefined) {
      updates.bankBranch = '';
    }
    if (existingSettings.bankQrEnabled === undefined) {
      updates.bankQrEnabled = false;
    }
    if (existingSettings.bankQrImageUrl === undefined) {
      updates.bankQrImageUrl = '';
    }
    if (existingSettings.bankQrNote === undefined) {
      updates.bankQrNote = 'Thanh toán hóa đơn {{Ma_Hoa_Don}}';
    }
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date();
      await settingsCol.updateOne(
        { _id: existingSettings._id },
        { $set: updates },
      );
      console.log('✓ Đã bổ sung cấu hình mẫu in, khổ giấy và thông tin ngân hàng cho Settings hiện tại');
    } else {
      console.log('· Settings đã tồn tại đầy đủ, bỏ qua');
    }
  }

  // 2. Admin user
  const usersCol = db.collection('users');
  await usersCol.createIndex({ email: 1 }, { unique: true });
  const existingAdmin = await usersCol.findOne({
    email: adminEmail.toLowerCase(),
  });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await usersCol.insertOne({
      email: adminEmail.toLowerCase(),
      passwordHash: hash,
      fullName: 'Quản trị viên',
      role: 'ADMIN',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✓ Đã tạo Admin: ${adminEmail}`);
  } else {
    console.log(`· Admin ${adminEmail} đã tồn tại, bỏ qua`);
  }

  // 3. Counters
  const countersCol = db.collection('counters');
  const year = new Date().getFullYear();
  for (const y of [year, year + 1]) {
    for (const type of ['invoice', 'quotation']) {
      const key = `${type}-${y}`;
      await countersCol.updateOne(
        { _id: key as any },
        { $setOnInsert: { seq: 0 } },
        { upsert: true },
      );
    }
  }
  console.log(`✓ Đã tạo Counters cho ${year} và ${year + 1}`);

  // 4. Indexes
  const invoicesCol = db.collection('invoices');
  await invoicesCol.createIndex(
    { invoiceNumber: 1 },
    { unique: true, sparse: true },
  );
  await db
    .collection('quotations')
    .createIndex({ quotationNumber: 1 }, { unique: true, sparse: true });
  console.log('✓ Đã đảm bảo unique sparse index cho invoiceNumber/quotationNumber');

  if (WITH_DEMO) {
    await seedDemo(db);
  }

  console.log('🎉 Seed hoàn tất');
  await mongoose.disconnect();
}

async function seedDemo(db: any) {
  const now = new Date();
  const productsCol = db.collection('products');
  if ((await productsCol.estimatedDocumentCount()) === 0) {
    const demoProducts = [
      { name: 'Xi măng PCB40 Hoàng Thạch', category: 'Xi măng', unit: 'bao', price: 95000, stock: 500 },
      { name: 'Cát xây tô', category: 'Cát', unit: 'm³', price: 350000, stock: 200 },
      { name: 'Đá 1x2', category: 'Đá', unit: 'm³', price: 420000, stock: 150 },
      { name: 'Gạch ống Tuynel', category: 'Gạch', unit: 'viên', price: 1500, stock: 50000 },
      { name: 'Thép Pomina phi 16', category: 'Sắt thép', unit: 'cây', price: 185000, stock: 300 },
      { name: 'Sơn Dulux nội thất 18L', category: 'Sơn', unit: 'thùng', price: 1850000, stock: 40 },
    ];
    await productsCol.insertMany(
      demoProducts.map((p, i) => ({
        ...p,
        code: `PROD${String(i + 1).padStart(5, '0')}`,
        status: 'active',
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
      })),
    );
    console.log(`✓ [demo] Đã tạo ${demoProducts.length} sản phẩm`);
  }

  const customersCol = db.collection('customers');
  if ((await customersCol.estimatedDocumentCount()) === 0) {
    const demoCustomers = [
      { name: 'Công ty TNHH Xây Dựng Minh Phát', phone: '0912345678', email: 'minhphat@example.com', address: '45 Lê Lợi, Quận 1, TP.HCM', taxCode: '0301234567' },
      { name: 'Nhà thầu Trần Văn Hùng', phone: '0987654321', email: 'hung.tran@example.com', address: '12 Nguyễn Trãi, Quận 5, TP.HCM' },
      { name: 'Công ty CP Đầu Tư Hoà Bình', phone: '0909123456', email: 'hoabinh@example.com', address: '88 Cách Mạng Tháng 8, Quận 3, TP.HCM', taxCode: '0305555666' },
    ];
    await customersCol.insertMany(
      demoCustomers.map((c, i) => ({
        ...c,
        code: `CUST${String(i + 1).padStart(5, '0')}`,
        status: 'active',
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
      })),
    );
    console.log(`✓ [demo] Đã tạo ${demoCustomers.length} khách hàng`);
  }
}

main().catch(async (err) => {
  console.error('❌ Seed thất bại:', err);
  await mongoose.disconnect();
  process.exit(1);
});
