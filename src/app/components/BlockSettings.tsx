import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import type { TemplateBlock } from '../types/template';

interface BlockSettingsProps {
  block: TemplateBlock | null;
  onClose: () => void;
  onUpdate: (block: TemplateBlock) => void;
}

export function BlockSettings({ block, onClose, onUpdate }: BlockSettingsProps) {
  if (!block) return null;

  const updateBlock = (updates: Partial<TemplateBlock>) => {
    onUpdate({ ...block, ...updates });
  };

  const updateStyle = (styleUpdates: Partial<typeof block.style>) => {
    onUpdate({ ...block, style: { ...block.style, ...styleUpdates } });
  };

  return (
    <div className="flex h-full flex-col border-l bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold text-gray-900">Cài đặt khối</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {/* Common Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Hiển thị khối</Label>
              <Switch
                checked={block.visible}
                onCheckedChange={(checked) => updateBlock({ visible: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Block-specific Settings */}
          {block.type === 'header' && (
            <HeaderSettings block={block} updateBlock={updateBlock} />
          )}

          {block.type === 'invoice-title' && (
            <InvoiceTitleSettings block={block} updateBlock={updateBlock} />
          )}

          {block.type === 'customer-info' && (
            <CustomerInfoSettings block={block} updateBlock={updateBlock} />
          )}

          {block.type === 'invoice-meta' && (
            <InvoiceMetaSettings block={block} updateBlock={updateBlock} />
          )}

          {block.type === 'items-table' && (
            <ItemsTableSettings block={block} updateBlock={updateBlock} />
          )}

          {block.type === 'totals' && (
            <TotalsSettings block={block} updateBlock={updateBlock} />
          )}

          {block.type === 'payment-info' && (
            <PaymentInfoSettings block={block} updateBlock={updateBlock} />
          )}

          {block.type === 'signature' && (
            <SignatureSettings block={block} updateBlock={updateBlock} />
          )}

          {block.type === 'footer' && (
            <FooterSettings block={block} updateBlock={updateBlock} />
          )}

          <Separator />

          {/* Style Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Kiểu dáng</h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Lề trên (px)</Label>
                <Input
                  type="number"
                  value={block.style.marginTop || 0}
                  onChange={(e) => updateStyle({ marginTop: Number(e.target.value) })}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Lề dưới (px)</Label>
                <Input
                  type="number"
                  value={block.style.marginBottom || 0}
                  onChange={(e) => updateStyle({ marginBottom: Number(e.target.value) })}
                  className="h-9"
                />
              </div>
            </div>

            {block.style.textAlign !== undefined && (
              <div className="space-y-2">
                <Label className="text-xs">Căn chỉnh</Label>
                <Select
                  value={block.style.textAlign}
                  onValueChange={(value: any) => updateStyle({ textAlign: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Trái</SelectItem>
                    <SelectItem value="center">Giữa</SelectItem>
                    <SelectItem value="right">Phải</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {block.style.fontSize !== undefined && (
              <div className="space-y-2">
                <Label className="text-xs">Cỡ chữ (px)</Label>
                <Input
                  type="number"
                  value={block.style.fontSize}
                  onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
                  className="h-9"
                />
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function HeaderSettings({ block, updateBlock }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Nội dung</h4>

      <div className="space-y-2">
        <Label className="text-xs">Bố cục</Label>
        <Select
          value={block.layout}
          onValueChange={(value: any) => updateBlock({ layout: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="logo-left">Logo trái</SelectItem>
            <SelectItem value="logo-center">Logo giữa</SelectItem>
            <SelectItem value="logo-right">Logo phải</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Tên công ty</Label>
          <Switch
            checked={block.showCompanyName}
            onCheckedChange={(checked) => updateBlock({ showCompanyName: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Địa chỉ</Label>
          <Switch
            checked={block.showAddress}
            onCheckedChange={(checked) => updateBlock({ showAddress: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Số điện thoại</Label>
          <Switch
            checked={block.showPhone}
            onCheckedChange={(checked) => updateBlock({ showPhone: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Email</Label>
          <Switch
            checked={block.showEmail}
            onCheckedChange={(checked) => updateBlock({ showEmail: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Mã số thuế</Label>
          <Switch
            checked={block.showTaxCode}
            onCheckedChange={(checked) => updateBlock({ showTaxCode: checked })}
          />
        </div>
      </div>
    </div>
  );
}

function InvoiceTitleSettings({ block, updateBlock }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Nội dung</h4>

      <div className="space-y-2">
        <Label className="text-xs">Tiêu đề</Label>
        <Input
          value={block.title}
          onChange={(e) => updateBlock({ title: e.target.value })}
          placeholder="HÓA ĐƠN BÁN HÀNG"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Hiển thị mã hóa đơn</Label>
        <Switch
          checked={block.showInvoiceCode}
          onCheckedChange={(checked) => updateBlock({ showInvoiceCode: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Hiển thị viền</Label>
        <Switch
          checked={block.showBorder}
          onCheckedChange={(checked) => updateBlock({ showBorder: checked })}
        />
      </div>
    </div>
  );
}

function CustomerInfoSettings({ block, updateBlock }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Trường hiển thị</h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Tên khách hàng</Label>
          <Switch
            checked={block.showName}
            onCheckedChange={(checked) => updateBlock({ showName: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Địa chỉ</Label>
          <Switch
            checked={block.showAddress}
            onCheckedChange={(checked) => updateBlock({ showAddress: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Số điện thoại</Label>
          <Switch
            checked={block.showPhone}
            onCheckedChange={(checked) => updateBlock({ showPhone: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Mã số thuế</Label>
          <Switch
            checked={block.showTaxCode}
            onCheckedChange={(checked) => updateBlock({ showTaxCode: checked })}
          />
        </div>
      </div>
    </div>
  );
}

function InvoiceMetaSettings({ block, updateBlock }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Bố cục</h4>

      <div className="space-y-2">
        <Label className="text-xs">Kiểu hiển thị</Label>
        <Select
          value={block.layout}
          onValueChange={(value: any) => updateBlock({ layout: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single-column">Một cột</SelectItem>
            <SelectItem value="two-columns">Hai cột</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Ngày tạo</Label>
          <Switch
            checked={block.showCreatedDate}
            onCheckedChange={(checked) => updateBlock({ showCreatedDate: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Ngày đến hạn</Label>
          <Switch
            checked={block.showDueDate}
            onCheckedChange={(checked) => updateBlock({ showDueDate: checked })}
          />
        </div>
      </div>
    </div>
  );
}

function ItemsTableSettings({ block, updateBlock }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Cột hiển thị</h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">STT</Label>
          <Switch
            checked={block.columns.stt}
            onCheckedChange={(checked) =>
              updateBlock({ columns: { ...block.columns, stt: checked } })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Tên hàng</Label>
          <Switch
            checked={block.columns.name}
            onCheckedChange={(checked) =>
              updateBlock({ columns: { ...block.columns, name: checked } })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Đơn vị tính</Label>
          <Switch
            checked={block.columns.unit}
            onCheckedChange={(checked) =>
              updateBlock({ columns: { ...block.columns, unit: checked } })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Số lượng</Label>
          <Switch
            checked={block.columns.quantity}
            onCheckedChange={(checked) =>
              updateBlock({ columns: { ...block.columns, quantity: checked } })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Đơn giá</Label>
          <Switch
            checked={block.columns.price}
            onCheckedChange={(checked) =>
              updateBlock({ columns: { ...block.columns, price: checked } })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Chiết khấu</Label>
          <Switch
            checked={block.columns.discount}
            onCheckedChange={(checked) =>
              updateBlock({ columns: { ...block.columns, discount: checked } })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Thuế</Label>
          <Switch
            checked={block.columns.tax}
            onCheckedChange={(checked) =>
              updateBlock({ columns: { ...block.columns, tax: checked } })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Thành tiền</Label>
          <Switch
            checked={block.columns.amount}
            onCheckedChange={(checked) =>
              updateBlock({ columns: { ...block.columns, amount: checked } })
            }
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Hiển thị header</Label>
          <Switch
            checked={block.showHeader}
            onCheckedChange={(checked) => updateBlock({ showHeader: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Hiển thị viền</Label>
          <Switch
            checked={block.showBorders}
            onCheckedChange={(checked) => updateBlock({ showBorders: checked })}
          />
        </div>
      </div>
    </div>
  );
}

function TotalsSettings({ block, updateBlock }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Căn chỉnh</h4>

      <div className="space-y-2">
        <Label className="text-xs">Vị trí</Label>
        <Select
          value={block.align}
          onValueChange={(value: any) => updateBlock({ align: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Trái</SelectItem>
            <SelectItem value="right">Phải</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Độ rộng (px)</Label>
        <Input
          type="number"
          value={block.width || 300}
          onChange={(e) => updateBlock({ width: Number(e.target.value) })}
          className="h-9"
        />
      </div>

      <Separator />

      <h4 className="font-medium text-gray-900">Dòng hiển thị</h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Tạm tính</Label>
          <Switch
            checked={block.showSubtotal}
            onCheckedChange={(checked) => updateBlock({ showSubtotal: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Chiết khấu</Label>
          <Switch
            checked={block.showDiscount}
            onCheckedChange={(checked) => updateBlock({ showDiscount: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Thuế</Label>
          <Switch
            checked={block.showTax}
            onCheckedChange={(checked) => updateBlock({ showTax: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Phí vận chuyển</Label>
          <Switch
            checked={block.showShipping}
            onCheckedChange={(checked) => updateBlock({ showShipping: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Tổng cộng</Label>
          <Switch
            checked={block.showGrandTotal}
            onCheckedChange={(checked) => updateBlock({ showGrandTotal: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Đã thanh toán</Label>
          <Switch
            checked={block.showPaid}
            onCheckedChange={(checked) => updateBlock({ showPaid: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Còn lại</Label>
          <Switch
            checked={block.showRemaining}
            onCheckedChange={(checked) => updateBlock({ showRemaining: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Tiền bằng chữ</Label>
          <Switch
            checked={block.showInWords}
            onCheckedChange={(checked) => updateBlock({ showInWords: checked })}
          />
        </div>
      </div>
    </div>
  );
}

function PaymentInfoSettings({ block, updateBlock }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Nội dung</h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Thông tin ngân hàng</Label>
          <Switch
            checked={block.showBankInfo}
            onCheckedChange={(checked) => updateBlock({ showBankInfo: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Mã QR</Label>
          <Switch
            checked={block.showQRCode}
            onCheckedChange={(checked) => updateBlock({ showQRCode: checked })}
          />
        </div>
      </div>
    </div>
  );
}

function SignatureSettings({ block, updateBlock }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Bố cục</h4>

      <div className="space-y-2">
        <Label className="text-xs">Kiểu hiển thị</Label>
        <Select
          value={block.layout}
          onValueChange={(value: any) => updateBlock({ layout: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single-column">Một cột</SelectItem>
            <SelectItem value="two-columns">Hai cột</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Người bán hàng</Label>
          <Switch
            checked={block.showSellerSignature}
            onCheckedChange={(checked) => updateBlock({ showSellerSignature: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Khách hàng</Label>
          <Switch
            checked={block.showCustomerSignature}
            onCheckedChange={(checked) => updateBlock({ showCustomerSignature: checked })}
          />
        </div>
      </div>
    </div>
  );
}

function FooterSettings({ block, updateBlock }: any) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Nội dung</h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Lời cảm ơn</Label>
          <Switch
            checked={block.showThankYou}
            onCheckedChange={(checked) => updateBlock({ showThankYou: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Điều khoản</Label>
          <Switch
            checked={block.showTerms}
            onCheckedChange={(checked) => updateBlock({ showTerms: checked })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Văn bản tùy chỉnh</Label>
        <Input
          value={block.customText || ''}
          onChange={(e) => updateBlock({ customText: e.target.value })}
          placeholder="Thêm văn bản tùy chỉnh..."
        />
      </div>
    </div>
  );
}
