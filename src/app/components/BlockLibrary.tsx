import {
  FileText,
  Heading1,
  User,
  Calendar,
  Table,
  DollarSign,
  CreditCard,
  PenTool,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import type { BlockType } from '../types/template';

interface BlockLibraryProps {
  onAddBlock: (type: BlockType) => void;
}

const blockTypes: Array<{
  type: BlockType;
  icon: React.ReactNode;
  label: string;
  description: string;
}> = [
  {
    type: 'header',
    icon: <FileText className="h-5 w-5" />,
    label: 'Đầu trang',
    description: 'Logo và thông tin công ty',
  },
  {
    type: 'invoice-title',
    icon: <Heading1 className="h-5 w-5" />,
    label: 'Tiêu đề hóa đơn',
    description: 'HÓA ĐƠN / BÁO GIÁ',
  },
  {
    type: 'customer-info',
    icon: <User className="h-5 w-5" />,
    label: 'Thông tin khách hàng',
    description: 'Tên, địa chỉ, SĐT',
  },
  {
    type: 'invoice-meta',
    icon: <Calendar className="h-5 w-5" />,
    label: 'Thông tin hóa đơn',
    description: 'Mã, ngày tạo, hạn thanh toán',
  },
  {
    type: 'items-table',
    icon: <Table className="h-5 w-5" />,
    label: 'Bảng mặt hàng',
    description: 'Danh sách sản phẩm/dịch vụ',
  },
  {
    type: 'totals',
    icon: <DollarSign className="h-5 w-5" />,
    label: 'Tổng tiền',
    description: 'Tổng cộng, đã thanh toán, còn lại',
  },
  {
    type: 'payment-info',
    icon: <CreditCard className="h-5 w-5" />,
    label: 'Thông tin thanh toán',
    description: 'Ngân hàng, QR code',
  },
  {
    type: 'signature',
    icon: <PenTool className="h-5 w-5" />,
    label: 'Chữ ký',
    description: 'Người bán & khách hàng',
  },
  {
    type: 'footer',
    icon: <MessageSquare className="h-5 w-5" />,
    label: 'Chân trang',
    description: 'Lời cảm ơn, điều khoản',
  },
];

export function BlockLibrary({ onAddBlock }: BlockLibraryProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h3 className="font-semibold text-gray-900">Thư viện khối</h3>
        <p className="mt-1 text-xs text-gray-500">Kéo thả hoặc nhấp để thêm</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {blockTypes.map((block) => (
            <Card
              key={block.type}
              className="cursor-pointer border-2 transition-all hover:border-blue-400 hover:shadow-md"
              onClick={() => onAddBlock(block.type)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    {block.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{block.label}</div>
                    <div className="mt-0.5 text-xs text-gray-500 line-clamp-2">{block.description}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t bg-gray-50 p-4">
        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
          <p className="font-semibold">💡 Mẹo:</p>
          <ul className="ml-4 mt-1 list-disc space-y-0.5">
            <li>Nhấp để thêm khối mới</li>
            <li>Kéo thả để sắp xếp lại</li>
            <li>Ẩn/hiện khối bằng biểu tượng mắt</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
