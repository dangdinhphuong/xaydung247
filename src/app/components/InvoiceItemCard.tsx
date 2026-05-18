import { formatCurrency } from '../utils/formatters';
import type { InvoiceItem } from '../types';

interface InvoiceItemCardProps {
  item: InvoiceItem;
}

export function InvoiceItemCard({ item }: InvoiceItemCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h4 className="font-semibold text-gray-900">{item.productName}</h4>
      
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Số lượng:</span>
          <span className="font-medium">{item.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Đơn giá:</span>
          <span className="font-medium">{formatCurrency(item.unitPrice)}</span>
        </div>
        {item.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Giảm giá:</span>
            <span className="font-medium text-red-600">-{formatCurrency(item.discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-2">
          <span className="font-medium text-gray-900">Thành tiền:</span>
          <span className="font-semibold text-[#1E88E5]">
            {formatCurrency(item.lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
