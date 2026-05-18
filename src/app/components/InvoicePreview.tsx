import { formatCurrency, formatDate } from '../utils/formatters';
import { cn } from './ui/utils';

interface TemplateConfig {
  name: string;
  paperSize: 'A4' | 'A5' | 'A6' | 'Thermal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  fontSize: number;
  font: string;
  primaryColor: string;
  showLogo: boolean;
  companyAlignment: 'left' | 'center' | 'right';
  sections: {
    showCompanyInfo: boolean;
    showCustomerInfo: boolean;
    showInvoiceNumber: boolean;
    showDates: boolean;
    showSignature: boolean;
    showTerms: boolean;
    showThankYou: boolean;
    showQRCode: boolean;
  };
  itemsTable: {
    columns: {
      stt: boolean;
      productName: boolean;
      unit: boolean;
      quantity: boolean;
      unitPrice: boolean;
      discount: boolean;
      tax: boolean;
      total: boolean;
    };
    showBorders: boolean;
  };
  totals: {
    showSubtotal: boolean;
    showDiscount: boolean;
    showTax: boolean;
    showShipping: boolean;
    showPaid: boolean;
    showRemaining: boolean;
    showGrandTotal: boolean;
  };
}

interface InvoicePreviewProps {
  config: TemplateConfig;
}

// Sample invoice data
const sampleInvoice = {
  invoiceNumber: 'HD-001',
  issueDate: '2026-02-24',
  dueDate: '2026-03-26',
  companyName: 'VLXD Luân Xương',
  companyAddress: '123 Đường Võ Văn Tần, Q.3, TP.HCM',
  companyPhone: '028 1234 5678',
  companyEmail: 'info@vlxd.vn',
  companyTax: '0123456789',
  customerName: 'Anh Bình',
  customerAddress: '456 Đường Lê Lợi, Q.1, TP.HCM',
  customerPhone: '0901 234 567',
  items: [
    { id: '1', name: 'Gạch Đồng Tâm 60x60', unit: 'Viên', quantity: 100, unitPrice: 85000, discount: 0, tax: 0, total: 8500000 },
    { id: '2', name: 'Xi măng Hoàng Mai PCB40', unit: 'Bao', quantity: 50, unitPrice: 95000, discount: 0, tax: 0, total: 4750000 },
    { id: '3', name: 'Cát vàng xây dựng', unit: 'Khối', quantity: 3, unitPrice: 450000, discount: 0, tax: 0, total: 1350000 },
  ],
  subtotal: 14600000,
  discount: 500000,
  tax: 1410000,
  shipping: 0,
  paidAmount: 10000000,
  total: 15510000,
  remainingBalance: 5510000,
};

// Paper size dimensions in mm (actual print sizes)
const paperDimensions = {
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  A6: { width: 105, height: 148 },
  Thermal: { width: 80, height: 200 },
};

export function InvoicePreview({ config }: InvoicePreviewProps) {
  const dimensions = paperDimensions[config.paperSize];
  const isLandscape = config.orientation === 'landscape';
  
  // Calculate aspect ratio for the canvas
  const width = isLandscape ? dimensions.height : dimensions.width;
  const height = isLandscape ? dimensions.width : dimensions.height;
  const aspectRatio = height / width;

  // Calculate printable area
  const printableStyle = {
    paddingTop: `${config.margins.top}px`,
    paddingRight: `${config.margins.right}px`,
    paddingBottom: `${config.margins.bottom}px`,
    paddingLeft: `${config.margins.left}px`,
  };

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-3xl">
        {/* Paper Size Label */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            Khổ giấy: {config.paperSize} ({width}mm × {height}mm)
          </p>
          <p className="text-xs text-gray-500">
            Lề: {config.margins.top}/{config.margins.right}/{config.margins.bottom}/{config.margins.left}mm
          </p>
        </div>

        {/* Paper Canvas */}
        <div
          className="relative mx-auto bg-white shadow-2xl"
          style={{
            width: '100%',
            paddingBottom: `${aspectRatio * 100}%`,
          }}
        >
          {/* Margin guides */}
          <div
            className="absolute inset-0 border-2 border-dashed border-blue-200"
            style={printableStyle}
          />

          {/* Invoice Content */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              ...printableStyle,
              fontSize: `${config.fontSize}px`,
              fontFamily: config.font,
            }}
          >
            <div className="space-y-4">
              {/* Header - Company Info */}
              {config.sections.showCompanyInfo && (
                <div
                  className={cn(
                    'space-y-1',
                    config.companyAlignment === 'center' && 'text-center',
                    config.companyAlignment === 'right' && 'text-right'
                  )}
                >
                  {config.showLogo && (
                    <div
                      className={cn(
                        'mb-2 flex',
                        config.companyAlignment === 'center' && 'justify-center',
                        config.companyAlignment === 'right' && 'justify-end'
                      )}
                    >
                      <div
                        className="flex h-12 w-32 items-center justify-center rounded border-2 border-dashed text-xs"
                        style={{ borderColor: config.primaryColor, color: config.primaryColor }}
                      >
                        LOGO
                      </div>
                    </div>
                  )}
                  <h2 className="font-bold" style={{ color: config.primaryColor, fontSize: `${config.fontSize + 4}px` }}>
                    {sampleInvoice.companyName}
                  </h2>
                  <p className="text-xs text-gray-600">{sampleInvoice.companyAddress}</p>
                  <p className="text-xs text-gray-600">
                    ĐT: {sampleInvoice.companyPhone} • Email: {sampleInvoice.companyEmail}
                  </p>
                  <p className="text-xs text-gray-600">MST: {sampleInvoice.companyTax}</p>
                </div>
              )}

              {/* Invoice Title & Number */}
              <div className="border-y py-3 text-center">
                <h1 className="font-bold" style={{ fontSize: `${config.fontSize + 6}px` }}>
                  HÓA ĐƠN BÁN HÀNG
                </h1>
                {config.sections.showInvoiceNumber && (
                  <p className="mt-1 text-sm" style={{ color: config.primaryColor }}>
                    {sampleInvoice.invoiceNumber}
                  </p>
                )}
              </div>

              {/* Customer Info & Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {config.sections.showCustomerInfo && (
                  <div>
                    <p className="mb-1 font-semibold">Khách hàng:</p>
                    <p>{sampleInvoice.customerName}</p>
                    <p className="text-xs text-gray-600">{sampleInvoice.customerAddress}</p>
                    <p className="text-xs text-gray-600">ĐT: {sampleInvoice.customerPhone}</p>
                  </div>
                )}
                {config.sections.showDates && (
                  <div>
                    <p className="text-xs">
                      <span className="font-medium">Ngày tạo:</span> {formatDate(sampleInvoice.issueDate)}
                    </p>
                    <p className="text-xs">
                      <span className="font-medium">Ngày đến hạn:</span> {formatDate(sampleInvoice.dueDate)}
                    </p>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="mt-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr
                      className="border-b-2"
                      style={{
                        backgroundColor: `${config.primaryColor}10`,
                        borderColor: config.primaryColor,
                      }}
                    >
                      {config.itemsTable.columns.stt && (
                        <th className="p-2 text-left font-semibold">STT</th>
                      )}
                      {config.itemsTable.columns.productName && (
                        <th className="p-2 text-left font-semibold">Tên hàng</th>
                      )}
                      {config.itemsTable.columns.unit && (
                        <th className="p-2 text-left font-semibold">ĐVT</th>
                      )}
                      {config.itemsTable.columns.quantity && (
                        <th className="p-2 text-right font-semibold">SL</th>
                      )}
                      {config.itemsTable.columns.unitPrice && (
                        <th className="p-2 text-right font-semibold">Đơn giá</th>
                      )}
                      {config.itemsTable.columns.discount && (
                        <th className="p-2 text-right font-semibold">CK</th>
                      )}
                      {config.itemsTable.columns.tax && (
                        <th className="p-2 text-right font-semibold">Thuế</th>
                      )}
                      {config.itemsTable.columns.total && (
                        <th className="p-2 text-right font-semibold">Thành tiền</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleInvoice.items.map((item, index) => (
                      <tr
                        key={item.id}
                        className={cn(config.itemsTable.showBorders && 'border-b')}
                      >
                        {config.itemsTable.columns.stt && (
                          <td className="p-2">{index + 1}</td>
                        )}
                        {config.itemsTable.columns.productName && (
                          <td className="p-2">{item.name}</td>
                        )}
                        {config.itemsTable.columns.unit && (
                          <td className="p-2">{item.unit}</td>
                        )}
                        {config.itemsTable.columns.quantity && (
                          <td className="p-2 text-right">{item.quantity}</td>
                        )}
                        {config.itemsTable.columns.unitPrice && (
                          <td className="p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                        )}
                        {config.itemsTable.columns.discount && (
                          <td className="p-2 text-right">{item.discount > 0 ? formatCurrency(item.discount) : '-'}</td>
                        )}
                        {config.itemsTable.columns.tax && (
                          <td className="p-2 text-right">{item.tax > 0 ? formatCurrency(item.tax) : '-'}</td>
                        )}
                        {config.itemsTable.columns.total && (
                          <td className="p-2 text-right font-medium">{formatCurrency(item.total)}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-64 space-y-1 text-sm">
                  {config.totals.showSubtotal && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span>{formatCurrency(sampleInvoice.subtotal)}</span>
                    </div>
                  )}
                  {config.totals.showDiscount && sampleInvoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="text-red-600">-{formatCurrency(sampleInvoice.discount)}</span>
                    </div>
                  )}
                  {config.totals.showTax && sampleInvoice.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thuế VAT (10%):</span>
                      <span>{formatCurrency(sampleInvoice.tax)}</span>
                    </div>
                  )}
                  {config.totals.showShipping && sampleInvoice.shipping > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span>{formatCurrency(sampleInvoice.shipping)}</span>
                    </div>
                  )}
                  {config.totals.showGrandTotal && (
                    <div
                      className="flex justify-between border-t-2 pt-2 font-bold"
                      style={{
                        borderColor: config.primaryColor,
                        color: config.primaryColor,
                        fontSize: `${config.fontSize + 2}px`,
                      }}
                    >
                      <span>TỔNG CỘNG:</span>
                      <span>{formatCurrency(sampleInvoice.total)}</span>
                    </div>
                  )}
                  {config.totals.showPaid && sampleInvoice.paidAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Đã thanh toán:</span>
                      <span>{formatCurrency(sampleInvoice.paidAmount)}</span>
                    </div>
                  )}
                  {config.totals.showRemaining && sampleInvoice.remainingBalance > 0 && (
                    <div className="flex justify-between font-semibold text-orange-600">
                      <span>Còn lại:</span>
                      <span>{formatCurrency(sampleInvoice.remainingBalance)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thank you message */}
              {config.sections.showThankYou && (
                <div className="mt-4 text-center text-sm italic text-gray-600">
                  Cảm ơn quý khách đã tin tưởng sử dụng sản phẩm của chúng tôi!
                </div>
              )}

              {/* Signature & QR Code */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {config.sections.showSignature && (
                  <div className="text-center text-xs">
                    <p className="font-semibold">Người bán hàng</p>
                    <p className="mt-8 text-gray-500">(Ký và ghi rõ họ tên)</p>
                  </div>
                )}
                {config.sections.showQRCode && (
                  <div className="text-center">
                    <div
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded border-2 border-dashed text-xs"
                      style={{ borderColor: config.primaryColor, color: config.primaryColor }}
                    >
                      QR
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Quét để thanh toán</p>
                  </div>
                )}
              </div>

              {/* Terms */}
              {config.sections.showTerms && (
                <div className="mt-4 border-t pt-2 text-xs text-gray-500">
                  <p className="font-semibold">Điều khoản & Điều kiện:</p>
                  <p>1. Vui lòng thanh toán đúng hạn để tránh phát sinh phí.</p>
                  <p>2. Hàng hóa đã bán không nhận đổi trả.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Print Safe Area Guide */}
        <div className="mt-2 text-center text-xs text-gray-500">
          <p>Vùng đường viền đứt nét là vùng an toàn khi in</p>
        </div>
      </div>
    </div>
  );
}