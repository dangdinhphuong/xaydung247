import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Eye, EyeOff, Settings2, Trash2 } from 'lucide-react';
import type { TemplateBlock, TemplateSampleData } from '../types/template';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface VisualBlockProps {
  block: TemplateBlock;
  index: number;
  sampleData: TemplateSampleData;
  primaryColor: string;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onOpenSettings: () => void;
}

export function VisualBlock({
  block,
  index,
  sampleData,
  primaryColor,
  isSelected,
  onSelect,
  onMove,
  onToggleVisibility,
  onDelete,
  onOpenSettings,
}: VisualBlockProps) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'BLOCK',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'BLOCK',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={cn(
        'group relative rounded-lg border-2 bg-white transition-all',
        isSelected && 'border-blue-500 ring-2 ring-blue-200',
        !isSelected && 'border-gray-200 hover:border-gray-300',
        isDragging && 'opacity-50',
        isOver && 'border-blue-400',
        !block.visible && 'opacity-50'
      )}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        ref={drag}
        className={cn(
          'absolute left-2 top-2 cursor-move rounded bg-gray-100 p-1 opacity-0 transition-opacity group-hover:opacity-100',
          isDragging && 'cursor-grabbing'
        )}
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>

      {/* Actions */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-white shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
        >
          {block.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-white shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpenSettings();
          }}
        >
          <Settings2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-white shadow-sm hover:bg-red-50 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Block Content */}
      <div className="p-4 pt-8">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {getBlockLabel(block.type)}
        </div>
        <div className="text-sm">
          {renderBlockPreview(block, sampleData, primaryColor)}
        </div>
      </div>
    </div>
  );
}

function getBlockLabel(type: string): string {
  const labels: Record<string, string> = {
    'header': 'Đầu trang',
    'invoice-title': 'Tiêu đề hóa đơn',
    'customer-info': 'Thông tin khách hàng',
    'invoice-meta': 'Thông tin hóa đơn',
    'items-table': 'Bảng mặt hàng',
    'totals': 'Tổng tiền',
    'payment-info': 'Thông tin thanh toán',
    'signature': 'Chữ ký',
    'footer': 'Chân trang',
  };
  return labels[type] || type;
}

function renderBlockPreview(block: TemplateBlock, data: TemplateSampleData, primaryColor: string) {
  switch (block.type) {
    case 'header':
      return (
        <div className="space-y-1 text-center">
          {block.showCompanyName && (
            <div className="font-bold" style={{ color: primaryColor }}>
              {data.Ten_Cong_Ty}
            </div>
          )}
          {block.showAddress && <div className="text-xs text-gray-600">{data.Dia_Chi_Cong_Ty}</div>}
          {(block.showPhone || block.showEmail) && (
            <div className="text-xs text-gray-600">
              {block.showPhone && `ĐT: ${data.So_Dien_Thoai_Cong_Ty}`}
              {block.showPhone && block.showEmail && ' • '}
              {block.showEmail && `Email: ${data.Email_Cong_Ty}`}
            </div>
          )}
        </div>
      );

    case 'invoice-title':
      return (
        <div className="space-y-1 text-center">
          <div className="font-bold">{block.title}</div>
          {block.showInvoiceCode && (
            <div className="text-xs font-semibold" style={{ color: primaryColor }}>
              {data.Ma_Hoa_Don}
            </div>
          )}
        </div>
      );

    case 'customer-info':
      return (
        <div className="space-y-1">
          {block.showName && (
            <div className="text-xs">
              <span className="font-semibold">Khách hàng:</span> {data.Khach_Hang}
            </div>
          )}
          {block.showAddress && (
            <div className="text-xs">
              <span className="font-semibold">Địa chỉ:</span> {data.Dia_Chi_Khach_Hang}
            </div>
          )}
          {block.showPhone && (
            <div className="text-xs">
              <span className="font-semibold">ĐT:</span> {data.So_Dien_Thoai}
            </div>
          )}
        </div>
      );

    case 'invoice-meta':
      return (
        <div className="space-y-1">
          {block.showCreatedDate && (
            <div className="text-xs">
              <span className="font-semibold">Ngày tạo:</span> {data.Ngay_Tao}
            </div>
          )}
          {block.showDueDate && (
            <div className="text-xs">
              <span className="font-semibold">Ngày đến hạn:</span> {data.Ngay_Den_Han}
            </div>
          )}
        </div>
      );

    case 'items-table':
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            {block.showHeader && (
              <thead>
                <tr className="text-white" style={{ backgroundColor: primaryColor }}>
                  {block.columns.stt && <th className="p-1">STT</th>}
                  {block.columns.name && <th className="p-1 text-left">Tên hàng</th>}
                  {block.columns.unit && <th className="p-1">ĐVT</th>}
                  {block.columns.quantity && <th className="p-1">SL</th>}
                  {block.columns.price && <th className="p-1 text-right">Đơn giá</th>}
                  {block.columns.amount && <th className="p-1 text-right">Thành tiền</th>}
                </tr>
              </thead>
            )}
            <tbody>
              {data.items.slice(0, 2).map((item, i) => (
                <tr key={i} className="border-b border-gray-200">
                  {block.columns.stt && <td className="p-1">{item.STT}</td>}
                  {block.columns.name && <td className="p-1">{item.Ten_Hang}</td>}
                  {block.columns.unit && <td className="p-1 text-center">{item.Don_Vi}</td>}
                  {block.columns.quantity && <td className="p-1 text-right">{item.So_Luong}</td>}
                  {block.columns.price && <td className="p-1 text-right">{item.Don_Gia}</td>}
                  {block.columns.amount && <td className="p-1 text-right font-semibold">{item.Thanh_Tien}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'totals':
      return (
        <div className={cn('space-y-1', block.align === 'right' && 'ml-auto', 'max-w-[200px]')}>
          {block.showSubtotal && (
            <div className="flex justify-between text-xs">
              <span>Tạm tính:</span>
              <span>{data.Tong_Tien}</span>
            </div>
          )}
          {block.showGrandTotal && (
            <div className="flex justify-between text-xs font-bold" style={{ color: primaryColor }}>
              <span>TỔNG CỘNG:</span>
              <span>{data.Tong_Cong}</span>
            </div>
          )}
          {block.showPaid && (
            <div className="flex justify-between text-xs text-green-600">
              <span>Đã thanh toán:</span>
              <span>{data.Da_Thanh_Toan}</span>
            </div>
          )}
          {block.showRemaining && (
            <div className="flex justify-between text-xs font-semibold text-orange-600">
              <span>Còn lại:</span>
              <span>{data.Con_Lai}</span>
            </div>
          )}
        </div>
      );

    case 'signature':
      return (
        <div className={cn('grid gap-4 text-center text-xs', block.layout === 'two-columns' && 'grid-cols-2')}>
          {block.showSellerSignature && (
            <div>
              <div className="font-semibold">Người bán hàng</div>
              <div className="mt-8 text-gray-400">(Ký và ghi rõ họ tên)</div>
            </div>
          )}
          {block.showCustomerSignature && (
            <div>
              <div className="font-semibold">Khách hàng</div>
              <div className="mt-8 text-gray-400">(Ký và ghi rõ họ tên)</div>
            </div>
          )}
        </div>
      );

    case 'footer':
      return (
        <div className="text-center text-xs italic text-gray-500">
          {block.showThankYou && <div>Cảm ơn quý khách đã tin tưởng sử dụng sản phẩm của chúng tôi!</div>}
          {block.customText && <div className="mt-2">{block.customText}</div>}
        </div>
      );

    case 'payment-info':
      return (
        <div className="space-y-2 text-xs">
          {block.showBankInfo && (
            <div>
              <div className="font-semibold">Thông tin chuyển khoản</div>
              <div className="text-gray-600">Ngân hàng: [Tên ngân hàng]</div>
              <div className="text-gray-600">Số TK: [Số tài khoản]</div>
            </div>
          )}
          {block.showQRCode && <div className="text-gray-400">[Mã QR thanh toán]</div>}
        </div>
      );

    default:
      return <div className="text-gray-400">Block preview</div>;
  }
}
