import { useState } from 'react';
import { ArrowLeft, Download, Printer, Settings2, ZoomIn, ZoomOut, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FilteredLink } from '../components/FilteredLink';
import { defaultTemplateSchema, sampleData } from '../utils/defaultTemplate';
import { schemaToHTML } from '../utils/templateConverter';
import type { TemplateSchema } from '../types/template';

type ZoomLevel = 50 | 75 | 100 | 125;

export default function InvoicePreview() {
  const [zoom, setZoom] = useState<ZoomLevel>(100);
  const [schema] = useState<TemplateSchema>(defaultTemplateSchema);

  const generatedHTML = schemaToHTML(schema, sampleData);

  // Paper dimensions in mm
  const paperDimensions = {
    A4: { width: 210, height: 297 },
    A5: { width: 148, height: 210 },
  };

  const dimensions = paperDimensions[schema.paperSize];
  const isLandscape = schema.orientation === 'landscape';
  const width = isLandscape ? dimensions.height : dimensions.width;
  const height = isLandscape ? dimensions.width : dimensions.height;
  const aspectRatio = height / width;

  // Replace variables in HTML
  let renderedContent = generatedHTML;
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
    paddingTop: `${schema.margins.top}px`,
    paddingRight: `${schema.margins.right}px`,
    paddingBottom: `${schema.margins.bottom}px`,
    paddingLeft: `${schema.margins.left}px`,
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="h-9 w-9">
            <FilteredLink to="/settings/templates">
              <ArrowLeft className="h-4 w-4" />
            </FilteredLink>
          </Button>
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              Xem trước mẫu hóa đơn
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">HÓA ĐƠN BÁN HÀNG</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom((prev) => Math.max(50, prev - 25) as ZoomLevel)}
              disabled={zoom === 50}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <Select value={zoom.toString()} onValueChange={(v) => setZoom(Number(v) as ZoomLevel)}>
              <SelectTrigger className="h-7 w-20 border-0 bg-transparent text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
                <SelectItem value="125">125%</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom((prev) => Math.min(125, prev + 25) as ZoomLevel)}
              disabled={zoom === 125}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="h-6 w-px bg-gray-200"></div>

          <Button variant="outline" size="sm" className="h-9 text-xs">
            <Printer className="mr-2 h-3.5 w-3.5" />
            In hóa đơn
          </Button>
          <Button size="sm" className="h-9 bg-[#1E88E5] text-xs hover:bg-[#1976D2]">
            <Download className="mr-2 h-3.5 w-3.5" />
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Main Content Area - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Preview (50% width) */}
        <div className="w-1/2 border-r border-gray-200 overflow-auto bg-gradient-to-br from-gray-100 to-gray-50">
          <div className="flex min-h-full items-start justify-center p-8">
            <div 
              className="relative transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
            >
              {/* Soft Shadow Effect */}
              <div className="absolute -inset-4 rounded-xl bg-black/5 blur-xl"></div>
              
              {/* Paper Container */}
              <div 
                className="relative mx-auto bg-white shadow-2xl"
                style={{
                  width: '595px', // A4 width at 72 DPI
                  paddingBottom: `${aspectRatio * 100}%`,
                }}
              >
                {/* Margin Guide */}
                <div
                  className="absolute inset-0 border-2 border-dashed border-blue-200"
                  style={printableStyle}
                />

                {/* Safe Area Label */}
                <div className="absolute left-3 top-3 rounded bg-blue-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
                  Vùng an toàn in
                </div>

                {/* Paper Size Info */}
                <div className="absolute right-3 top-3 rounded bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-lg border border-gray-200">
                  {schema.paperSize} - {isLandscape ? 'Ngang' : 'Dọc'} ({width}×{height}mm)
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
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded border-2 border-dashed border-blue-200" />
                  <span>Lề trang</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-white shadow" />
                  <span>Vùng in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Settings & Info (50% width) */}
        <div className="w-1/2 overflow-auto bg-white">
          <div className="p-8">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="info">
                  <Eye className="h-4 w-4 mr-2" />
                  Thông tin
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Cài đặt
                </TabsTrigger>
                <TabsTrigger value="data">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Dữ liệu mẫu
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Invoice Info */}
              <TabsContent value="info" className="mt-6 space-y-6">
                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Thông tin công ty</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tên công ty:</span>
                      <span className="font-medium text-gray-900">{sampleData.Ten_Cong_Ty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="font-medium text-gray-900 text-right max-w-xs">{sampleData.Dia_Chi_Cong_Ty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điện thoại:</span>
                      <span className="font-medium text-gray-900">{sampleData.So_Dien_Thoai_Cong_Ty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{sampleData.Email_Cong_Ty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã số thuế:</span>
                      <span className="font-medium text-gray-900">{sampleData.Ma_So_Thue_Cong_Ty}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Thông tin khách hàng</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tên khách hàng:</span>
                      <span className="font-medium text-gray-900">{sampleData.Khach_Hang}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="font-medium text-gray-900 text-right max-w-xs">{sampleData.Dia_Chi_Khach_Hang}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điện thoại:</span>
                      <span className="font-medium text-gray-900">{sampleData.So_Dien_Thoai}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Thông tin hóa đơn</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã hóa đơn:</span>
                      <span className="font-medium text-gray-900">{sampleData.Ma_Hoa_Don}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span className="font-medium text-gray-900">{sampleData.Ngay_Tao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đến hạn:</span>
                      <span className="font-medium text-gray-900">{sampleData.Ngay_Den_Han}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Tổng tiền</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền hàng:</span>
                      <span className="font-medium text-gray-900">{sampleData.Tong_Tien}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng cộng:</span>
                      <span className="font-semibold text-[#1E88E5] text-lg">{sampleData.Tong_Cong}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Đã thanh toán:</span>
                      <span className="font-medium text-green-600">{sampleData.Da_Thanh_Toan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Còn lại:</span>
                      <span className="font-semibold text-orange-600 text-lg">{sampleData.Con_Lai}</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Tab 2: Template Settings */}
              <TabsContent value="settings" className="mt-6 space-y-6">
                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Cài đặt trang</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Khổ giấy:</span>
                      <span className="font-medium text-gray-900">{schema.paperSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hướng trang:</span>
                      <span className="font-medium text-gray-900">{isLandscape ? 'Ngang (Landscape)' : 'Dọc (Portrait)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kích thước:</span>
                      <span className="font-medium text-gray-900">{width}mm × {height}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lề trên:</span>
                      <span className="font-medium text-gray-900">{schema.margins.top}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lề phải:</span>
                      <span className="font-medium text-gray-900">{schema.margins.right}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lề dưới:</span>
                      <span className="font-medium text-gray-900">{schema.margins.bottom}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lề trái:</span>
                      <span className="font-medium text-gray-900">{schema.margins.left}mm</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Màu sắc</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Màu chủ đạo:</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-6 w-6 rounded border border-gray-300"
                          style={{ backgroundColor: schema.primaryColor }}
                        />
                        <span className="font-medium text-gray-900">{schema.primaryColor}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Cấu trúc</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-600 mb-3">Tổng số khối: {schema.blocks.length}</div>
                    {schema.blocks.map((block, index) => (
                      <div 
                        key={block.id}
                        className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs font-medium text-[#1E88E5]">
                            {index + 1}
                          </div>
                          <span className="text-gray-900 capitalize">{block.type.replace(/-/g, ' ')}</span>
                        </div>
                        {block.visible ? (
                          <span className="text-xs text-green-600 font-medium">Hiển thị</span>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Ẩn</span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Tab 3: Sample Data */}
              <TabsContent value="data" className="mt-6 space-y-6">
                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Danh sách sản phẩm</h3>
                  <div className="space-y-4">
                    {sampleData.items.map((item, index) => (
                      <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-sm font-medium text-[#1E88E5]">
                              {item.STT}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{item.Ten_Hang}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">Đơn vị: {item.Don_Vi}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                          <div>
                            <span className="text-gray-600">Số lượng:</span>
                            <span className="ml-1 font-medium text-gray-900">{item.So_Luong}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Đơn giá:</span>
                            <span className="ml-1 font-medium text-gray-900">{item.Don_Gia}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-600">Thành tiền:</span>
                            <span className="ml-1 font-semibold text-[#1E88E5]">{item.Thanh_Tien}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
