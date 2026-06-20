import { formatCurrency, formatDate } from '../utils/formatters';

interface TemplatePreviewProps {
  content: string;
  paperSize: 'A4' | 'A5';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Sample data for preview
const sampleData = {
  // Company data
  Ten_Cong_Ty: 'CỬA HÀNG VLXD XƯƠNG LUÂN',
  Dia_Chi_Cong_Ty: '123 Đường Võ Văn Tần, Quận 3, TP.HCM',
  So_Dien_Thoai_Cong_Ty: '028 1234 5678',
  Email_Cong_Ty: 'info@vlxdxuonglan.vn',
  Ma_So_Thue_Cong_Ty: '0123456789',
  Logo: '[LOGO]',
  Ten_Ngan_Hang: 'MB Bank',
  So_Tai_Khoan: '190200888888',
  Chu_Tai_Khoan: 'CỬA HÀNG VLXD XƯƠNG LUÂN',
  Chi_Nhanh_Ngan_Hang: 'Chi nhánh Sài Gòn',
  Noi_Dung_Chuyen_Khoan: 'Thanh toan hoa don HD-001',
  Ma_QR: '<img src="https://img.vietqr.io/image/MB-190200888888-compact.png?amount=45200000&addInfo=Thanh%20toan%20hoa%20don%20HD-001" alt="Mã QR thanh toán" style="max-width: 120px; max-height: 120px; display: block;" />',

  // Customer data
  Khach_Hang: 'Anh Hòa Q.1',
  So_Dien_Thoai: '0901 234 567',
  Dia_Chi_Khach_Hang: '456 Đường Lê Lợi, Quận 1, TP.HCM',
  Ma_So_Thue_Khach: '0987654321',

  // Invoice data
  Ma_Hoa_Don: 'HD-001',
  Ngay_Tao: formatDate('2026-02-24'),
  Ngay_Den_Han: formatDate('2026-03-26'),
  Tong_Tien: formatCurrency(45200000),
  Tong_Cong: formatCurrency(45200000),
  Da_Thanh_Toan: formatCurrency(30000000),
  Con_Lai: formatCurrency(15200000),
  Tien_Bang_Chu: 'Bốn mươi lăm triệu hai trăm nghìn đồng',

  // Items data
  items: [
    {
      STT: '1',
      Ten_Hang: 'Ván nhựa Alcado 20cm x 3m',
      Don_Vi: 'Tấm',
      So_Luong: '50',
      Don_Gia: formatCurrency(320000),
      Chiet_Khau: formatCurrency(0),
      Thanh_Tien: formatCurrency(16000000),
    },
    {
      STT: '2',
      Ten_Hang: 'Quần jeans nữ Blue Exchange size M',
      Don_Vi: 'Cái',
      So_Luong: '100',
      Don_Gia: formatCurrency(250000),
      Chiet_Khau: formatCurrency(0),
      Thanh_Tien: formatCurrency(25000000),
    },
    {
      STT: '3',
      Ten_Hang: 'iPhone 15 Pro Max 256GB',
      Don_Vi: 'Chiếc',
      So_Luong: '2',
      Don_Gia: formatCurrency(32000000),
      Chiet_Khau: formatCurrency(0),
      Thanh_Tien: formatCurrency(4200000),
    },
  ],
};

// Paper dimensions
const paperDimensions = {
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
};

export function TemplatePreview({ content, paperSize, orientation, margins }: TemplatePreviewProps) {
  const dimensions = paperDimensions[paperSize];
  const isLandscape = orientation === 'landscape';

  const width = isLandscape ? dimensions.height : dimensions.width;
  const height = isLandscape ? dimensions.width : dimensions.height;
  const aspectRatio = height / width;

  // Replace simple variables
  let renderedContent = content;
  Object.entries(sampleData).forEach(([key, value]) => {
    if (key !== 'items') {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      renderedContent = renderedContent.replace(regex, String(value));
    }
  });

  // Replace items loop
  const itemsLoopRegex = /\{\{#Items\}\}([\s\S]*?)\{\{\/Items\}\}/g;
  renderedContent = renderedContent.replace(itemsLoopRegex, (match, itemTemplate) => {
    return sampleData.items
      .map((item) => {
        let itemHtml = itemTemplate;
        Object.entries(item).forEach(([key, value]) => {
          const regex = new RegExp(`\\{${key}\\}`, 'g');
          itemHtml = itemHtml.replace(regex, value);
        });
        return itemHtml;
      })
      .join('');
  });

  const printableStyle = {
    paddingTop: `${margins.top}px`,
    paddingRight: `${margins.right}px`,
    paddingBottom: `${margins.bottom}px`,
    paddingLeft: `${margins.left}px`,
  };

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-3xl">
        {/* Info Bar */}
        <div className="mb-3 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {paperSize} - {orientation === 'portrait' ? 'Dọc' : 'Ngang'}
              </p>
              <p className="text-xs text-gray-500">
                {width}mm × {height}mm
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Lề (TPDT)</p>
            <p className="text-xs font-medium text-gray-700">
              {margins.top}/{margins.right}/{margins.bottom}/{margins.left}mm
            </p>
          </div>
        </div>

        {/* Paper Canvas */}
        <div
          className="relative mx-auto bg-white shadow-2xl"
          style={{
            width: '100%',
            paddingBottom: `${aspectRatio * 100}%`,
          }}
        >
          {/* Margin Guide */}
          <div
            className="absolute inset-0 border-2 border-dashed border-blue-200"
            style={printableStyle}
          />

          {/* Safe Area Label */}
          <div className="absolute left-2 top-2 rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white">
            Vùng an toàn in
          </div>

          {/* Rendered Content */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              ...printableStyle,
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <div
              className="template-content"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded border-2 border-dashed border-blue-200" />
            <span>Lề trang</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-white shadow" />
            <span>Vùng in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
