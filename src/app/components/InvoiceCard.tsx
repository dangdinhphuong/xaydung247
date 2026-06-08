import { FilteredLink } from './FilteredLink';
import { Eye, Calendar, CreditCard } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Button } from './ui/button';
import type { Invoice } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface InvoiceCardProps {
  invoice: Invoice;
  onPayment?: (invoice: Invoice) => void;
}

export function InvoiceCard({ invoice, onPayment }: InvoiceCardProps) {
  const isOverdue = invoice.isOverdue;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <FilteredLink
            to={`/invoices/${invoice.id}`}
            className="text-base font-semibold text-[#1E88E5] hover:underline"
          >
            {invoice.invoiceNumber}
          </FilteredLink>
          <p className="mt-1 text-sm text-gray-600">{invoice.customerName}</p>
        </div>
        <StatusBadge status={invoice.status} isOverdue={invoice.isOverdue} />
      </div>

      <div className="mb-3 space-y-2 border-t pt-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng tiền:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(invoice.total)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Đã thanh toán:</span>
          <span className="font-medium text-green-600">
            {formatCurrency(invoice.paidAmount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Còn lại:</span>
          <span className={`font-semibold ${invoice.remainingBalance > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
            {formatCurrency(invoice.remainingBalance)}
          </span>
        </div>
      </div>

      <div className={`mb-3 flex items-center gap-2 text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
        <Calendar className="h-3.5 w-3.5" />
        <span>Đến hạn: {formatDate(invoice.dueDate)}</span>
        {isOverdue && <span className="font-medium">(Quá hạn)</span>}
      </div>

      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <FilteredLink to={`/invoices/${invoice.id}`}>
            <Eye className="h-4 w-4" />
            Xem
          </FilteredLink>
        </Button>
        {invoice.remainingBalance > 0 && (
          <Button
            size="sm"
            className="flex-1 bg-[#1E88E5] hover:bg-[#1976D2]"
            onClick={() => onPayment?.(invoice)}
          >
            <CreditCard className="h-4 w-4" />
            Thanh toán
          </Button>
        )}
      </div>
    </div>
  );
}