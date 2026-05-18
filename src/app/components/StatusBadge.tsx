import { cn } from './ui/utils';
import type { InvoiceStatus } from '../types';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const statusConfig = {
  draft: {
    label: 'Nháp',
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  unpaid: {
    label: 'Chưa thanh toán',
    className: 'bg-red-50 text-red-700 border-red-300',
  },
  partial: {
    label: 'Thanh toán một phần',
    className: 'bg-orange-50 text-orange-700 border-orange-300',
  },
  paid: {
    label: 'Đã thanh toán',
    className: 'bg-green-50 text-green-700 border-green-300',
  },
  overdue: {
    label: 'Quá hạn',
    className: 'bg-red-100 text-red-800 border-red-400',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
