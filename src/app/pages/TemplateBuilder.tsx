import { useState } from 'react';
import { useParams } from 'react-router';
import { ArrowLeft, Save, Eye, FileDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { cn } from '../components/ui/utils';
import { InvoicePreview } from '../components/InvoicePreview';
import { FilteredLink } from '../components/FilteredLink';

type PaperSize = 'A4' | 'A5' | 'A6' | 'Thermal';
type Orientation = 'portrait' | 'landscape';

interface TemplateConfig {
  name: string;
  paperSize: PaperSize;
  orientation: Orientation;
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

const defaultConfig: TemplateConfig = {
  name: 'Mẫu mới',
  paperSize: 'A4',
  orientation: 'portrait',
  margins: { top: 20, right: 20, bottom: 20, left: 20 },
  fontSize: 12,
  font: 'Inter',
  primaryColor: '#1E88E5',
  showLogo: true,
  companyAlignment: 'left',
  sections: {
    showCompanyInfo: true,
    showCustomerInfo: true,
    showInvoiceNumber: true,
    showDates: true,
    showSignature: true,
    showTerms: false,
    showThankYou: true,
    showQRCode: true,
  },
  itemsTable: {
    columns: {
      stt: true,
      productName: true,
      unit: true,
      quantity: true,
      unitPrice: true,
      discount: true,
      tax: false,
      total: true,
    },
    showBorders: true,
  },
  totals: {
    showSubtotal: true,
    showDiscount: true,
    showTax: true,
    showShipping: false,
    showPaid: true,
    showRemaining: true,
    showGrandTotal: true,
  },
};

export default function TemplateBuilder() {
  const { id } = useParams();
  const [config, setConfig] = useState<TemplateConfig>(defaultConfig);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(true);
  const [mobileStep, setMobileStep] = useState(0);

  const updateConfig = (updates: Partial<TemplateConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const mobileSteps = [
    'Khổ giấy',
    'Bố cục',
    'Nội dung',
    'Màu sắc',
    'Xem trước',
  ];

  return (
    <div className="flex h-screen flex-col bg-gray-50 lg:bg-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="h-10 w-10 shrink-0">
              <FilteredLink to="/settings/templates">
                <ArrowLeft className="h-5 w-5" />
              </FilteredLink>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold text-gray-900">
                {id ? 'Chỉnh sửa mẫu' : 'Tạo mẫu mới'}
              </h1>
              <p className="text-xs text-gray-500">Bước {mobileStep + 1}/5</p>
            </div>
          </div>
          <Button size="sm" className="bg-[#1E88E5] hover:bg-[#1976D2]">
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden items-center justify-between border-b bg-white px-6 py-4 lg:flex">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <FilteredLink to="/settings/templates">
              <ArrowLeft className="h-5 w-5" />
            </FilteredLink>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Chỉnh sửa mẫu hóa đơn' : 'Tạo mẫu hóa đơn mới'}
            </h1>
            <p className="text-sm text-gray-500">
              Tùy chỉnh bố cục và nội dung hiển thị
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Xem trước
          </Button>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất PDF
          </Button>
          <Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
            <Save className="mr-2 h-4 w-4" />
            Lưu mẫu
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Step Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4 lg:hidden">
          {/* Step 0: Paper Size */}
          {mobileStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Khổ giấy & Hướng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Chọn khổ giấy</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['A4', 'A5', 'A6', 'Thermal'] as PaperSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateConfig({ paperSize: size })}
                        className={cn(
                          'rounded-lg border-2 p-4 text-center font-medium transition-colors',
                          config.paperSize === size
                            ? 'border-[#1E88E5] bg-[#1E88E5]/10 text-[#1E88E5]'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hướng giấy</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['portrait', 'landscape'] as Orientation[]).map((orient) => (
                      <button
                        key={orient}
                        onClick={() => updateConfig({ orientation: orient })}
                        className={cn(
                          'rounded-lg border-2 p-4 text-center font-medium transition-colors',
                          config.orientation === orient
                            ? 'border-[#1E88E5] bg-[#1E88E5]/10 text-[#1E88E5]'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        {orient === 'portrait' ? 'Dọc' : 'Ngang'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Lề trang (mm)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Trên</Label>
                      <Input
                        type="number"
                        value={config.margins.top}
                        onChange={(e) =>
                          updateConfig({
                            margins: { ...config.margins, top: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Phải</Label>
                      <Input
                        type="number"
                        value={config.margins.right}
                        onChange={(e) =>
                          updateConfig({
                            margins: { ...config.margins, right: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Dưới</Label>
                      <Input
                        type="number"
                        value={config.margins.bottom}
                        onChange={(e) =>
                          updateConfig({
                            margins: { ...config.margins, bottom: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Trái</Label>
                      <Input
                        type="number"
                        value={config.margins.left}
                        onChange={(e) =>
                          updateConfig({
                            margins: { ...config.margins, left: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Layout */}
          {mobileStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Bố cục & Căn chỉnh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Hiển thị logo</Label>
                  <Switch
                    checked={config.showLogo}
                    onCheckedChange={(checked) => updateConfig({ showLogo: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Căn chỉnh thông tin công ty</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => updateConfig({ companyAlignment: align })}
                        className={cn(
                          'rounded-lg border-2 p-3 text-center font-medium transition-colors',
                          config.companyAlignment === align
                            ? 'border-[#1E88E5] bg-[#1E88E5]/10 text-[#1E88E5]'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        {align === 'left' ? 'Trái' : align === 'center' ? 'Giữa' : 'Phải'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cỡ chữ</Label>
                  <Select
                    value={config.fontSize.toString()}
                    onValueChange={(value) => updateConfig({ fontSize: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[11, 12, 13, 14].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}pt
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font chữ</Label>
                  <Select value={config.font} onValueChange={(value) => updateConfig({ font: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Content */}
          {mobileStep === 2 && (
            <div className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hiển thị nội dung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries({
                    showCompanyInfo: 'Thông tin cửa hàng',
                    showCustomerInfo: 'Thông tin khách hàng',
                    showInvoiceNumber: 'Mã hóa đơn',
                    showDates: 'Ngày tạo / đến hạn',
                    showSignature: 'Chữ ký',
                    showTerms: 'Điều khoản',
                    showThankYou: 'Lời cảm ơn',
                    showQRCode: 'QR thanh toán',
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label>{label}</Label>
                      <Switch
                        checked={config.sections[key as keyof typeof config.sections]}
                        onCheckedChange={(checked) =>
                          updateConfig({
                            sections: { ...config.sections, [key]: checked },
                          })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cột hiển thị</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries({
                    stt: 'STT',
                    productName: 'Tên hàng',
                    unit: 'Đơn vị',
                    quantity: 'Số lượng',
                    unitPrice: 'Đơn giá',
                    discount: 'Chiết khấu',
                    tax: 'Thuế',
                    total: 'Thành tiền',
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label>{label}</Label>
                      <Switch
                        checked={config.itemsTable.columns[key as keyof typeof config.itemsTable.columns]}
                        onCheckedChange={(checked) =>
                          updateConfig({
                            itemsTable: {
                              ...config.itemsTable,
                              columns: { ...config.itemsTable.columns, [key]: checked },
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Colors */}
          {mobileStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Màu sắc & Kiểu dáng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Màu chủ đạo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                      className="h-12 w-20"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                      placeholder="#1E88E5"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Hiển thị đường viền bảng</Label>
                  <Switch
                    checked={config.itemsTable.showBorders}
                    onCheckedChange={(checked) =>
                      updateConfig({
                        itemsTable: { ...config.itemsTable, showBorders: checked },
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>Tổng kết hiển thị</Label>
                  {Object.entries({
                    showSubtotal: 'Tổng phụ',
                    showDiscount: 'Giảm giá',
                    showTax: 'Thuế',
                    showShipping: 'Phí vận chuyển',
                    showPaid: 'Đã thanh toán',
                    showRemaining: 'Còn lại',
                    showGrandTotal: 'Tổng cộng',
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="text-sm">{label}</Label>
                      <Switch
                        checked={config.totals[key as keyof typeof config.totals]}
                        onCheckedChange={(checked) =>
                          updateConfig({
                            totals: { ...config.totals, [key]: checked },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Preview */}
          {mobileStep === 4 && (
            <div className="pb-4">
              <InvoicePreview config={config} />
            </div>
          )}
        </div>

        {/* Settings Panel - Desktop */}
        <div
          className={cn(
            'hidden border-r bg-white lg:block',
            settingsPanelOpen ? 'w-96' : 'w-0'
          )}
        >
          <div className="h-full overflow-y-auto p-6">
            <Tabs defaultValue="paper" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="paper" className="text-xs">Giấy</TabsTrigger>
                <TabsTrigger value="brand" className="text-xs">Thương hiệu</TabsTrigger>
                <TabsTrigger value="sections" className="text-xs">Nội dung</TabsTrigger>
                <TabsTrigger value="items" className="text-xs">Mặt hàng</TabsTrigger>
              </TabsList>

              {/* Paper & Print Settings */}
              <TabsContent value="paper" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Khổ giấy & In ấn</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Khổ giấy</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['A4', 'A5', 'A6', 'Thermal'] as PaperSize[]).map((size) => (
                          <button
                            key={size}
                            onClick={() => updateConfig({ paperSize: size })}
                            className={cn(
                              'rounded-lg border-2 p-3 text-center text-sm font-medium transition-colors',
                              config.paperSize === size
                                ? 'border-[#1E88E5] bg-[#1E88E5]/10 text-[#1E88E5]'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Hướng giấy</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['portrait', 'landscape'] as Orientation[]).map((orient) => (
                          <button
                            key={orient}
                            onClick={() => updateConfig({ orientation: orient })}
                            className={cn(
                              'rounded-lg border-2 p-3 text-center text-sm font-medium transition-colors',
                              config.orientation === orient
                                ? 'border-[#1E88E5] bg-[#1E88E5]/10 text-[#1E88E5]'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            {orient === 'portrait' ? 'Dọc' : 'Ngang'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Lề trang (mm)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Trên</Label>
                          <Input
                            type="number"
                            value={config.margins.top}
                            onChange={(e) =>
                              updateConfig({
                                margins: { ...config.margins, top: Number(e.target.value) },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Phải</Label>
                          <Input
                            type="number"
                            value={config.margins.right}
                            onChange={(e) =>
                              updateConfig({
                                margins: { ...config.margins, right: Number(e.target.value) },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Dưới</Label>
                          <Input
                            type="number"
                            value={config.margins.bottom}
                            onChange={(e) =>
                              updateConfig({
                                margins: { ...config.margins, bottom: Number(e.target.value) },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Trái</Label>
                          <Input
                            type="number"
                            value={config.margins.left}
                            onChange={(e) =>
                              updateConfig({
                                margins: { ...config.margins, left: Number(e.target.value) },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Cỡ chữ cơ bản</Label>
                      <Select
                        value={config.fontSize.toString()}
                        onValueChange={(value) => updateConfig({ fontSize: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[11, 12, 13, 14].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}pt
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Font chữ</Label>
                      <Select value={config.font} onValueChange={(value) => updateConfig({ font: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Branding */}
              <TabsContent value="brand" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Thương hiệu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Hiển thị logo</Label>
                      <Switch
                        checked={config.showLogo}
                        onCheckedChange={(checked) => updateConfig({ showLogo: checked })}
                      />
                    </div>

                    {config.showLogo && (
                      <div className="space-y-2">
                        <Label>Upload logo</Label>
                        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Kéo thả hoặc nhấp để tải lên</p>
                            <p className="text-xs text-gray-400">PNG, JPG tối đa 2MB</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <Label>Màu chủ đạo</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                          className="h-10 w-20"
                        />
                        <Input
                          value={config.primaryColor}
                          onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                          placeholder="#1E88E5"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Căn chỉnh thông tin công ty</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['left', 'center', 'right'] as const).map((align) => (
                          <button
                            key={align}
                            onClick={() => updateConfig({ companyAlignment: align })}
                            className={cn(
                              'rounded-lg border-2 p-2 text-center text-sm font-medium transition-colors',
                              config.companyAlignment === align
                                ? 'border-[#1E88E5] bg-[#1E88E5]/10 text-[#1E88E5]'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            {align === 'left' ? 'Trái' : align === 'center' ? 'Giữa' : 'Phải'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sections */}
              <TabsContent value="sections" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Hiển thị nội dung</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries({
                      showCompanyInfo: 'Thông tin cửa hàng',
                      showCustomerInfo: 'Thông tin khách hàng',
                      showInvoiceNumber: 'Mã hóa đơn',
                      showDates: 'Ngày tạo / ngày đến hạn',
                      showSignature: 'Chữ ký',
                      showTerms: 'Điều khoản & điều kiện',
                      showThankYou: 'Lời cảm ơn',
                      showQRCode: 'QR thanh toán',
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-sm">{label}</Label>
                        <Switch
                          checked={config.sections[key as keyof typeof config.sections]}
                          onCheckedChange={(checked) =>
                            updateConfig({
                              sections: { ...config.sections, [key]: checked },
                            })
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tổng kết</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries({
                      showSubtotal: 'Tổng phụ',
                      showDiscount: 'Giảm giá',
                      showTax: 'Thuế',
                      showShipping: 'Phí vận chuyển',
                      showPaid: 'Đã thanh toán',
                      showRemaining: 'Còn lại',
                      showGrandTotal: 'Tổng cộng',
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-sm">{label}</Label>
                        <Switch
                          checked={config.totals[key as keyof typeof config.totals]}
                          onCheckedChange={(checked) =>
                            updateConfig({
                              totals: { ...config.totals, [key]: checked },
                            })
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Items Table */}
              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Bảng mặt hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries({
                      stt: 'STT',
                      productName: 'Tên hàng',
                      unit: 'Đơn vị',
                      quantity: 'Số lượng',
                      unitPrice: 'Đơn giá',
                      discount: 'Chiết khấu',
                      tax: 'Thuế',
                      total: 'Thành tiền',
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-sm">{label}</Label>
                        <Switch
                          checked={config.itemsTable.columns[key as keyof typeof config.itemsTable.columns]}
                          onCheckedChange={(checked) =>
                            updateConfig({
                              itemsTable: {
                                ...config.itemsTable,
                                columns: { ...config.itemsTable.columns, [key]: checked },
                              },
                            })
                          }
                        />
                      </div>
                    ))}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Hiển thị đường viền</Label>
                      <Switch
                        checked={config.itemsTable.showBorders}
                        onCheckedChange={(checked) =>
                          updateConfig({
                            itemsTable: { ...config.itemsTable, showBorders: checked },
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Toggle Settings Panel Button - Desktop */}
        <button
          onClick={() => setSettingsPanelOpen(!settingsPanelOpen)}
          className="hidden h-full w-6 items-center justify-center border-r bg-gray-100 hover:bg-gray-200 lg:flex"
        >
          {settingsPanelOpen ? (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Preview Panel */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <InvoicePreview config={config} />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="border-t bg-white p-4 lg:hidden">
        <div className="mb-3 flex items-center justify-between text-sm">
          <Button
            variant="ghost"
            size="sm"
            disabled={mobileStep === 0}
            onClick={() => setMobileStep((prev) => prev - 1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
          <span className="text-gray-600">
            {mobileStep + 1} / {mobileSteps.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={mobileStep === mobileSteps.length - 1}
            onClick={() => setMobileStep((prev) => prev + 1)}
          >
            Tiếp theo
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}