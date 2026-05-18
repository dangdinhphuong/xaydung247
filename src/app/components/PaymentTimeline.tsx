import { CheckCircle2, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Payment } from '../types';

interface PaymentTimelineProps {
  payments: Payment[];
  paymentMethodLabels: Record<string, string>;
}

export function PaymentTimeline({ payments, paymentMethodLabels }: PaymentTimelineProps) {
  if (payments.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        Chưa có thanh toán nào
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment, index) => (
        <div key={payment.id} className="relative flex gap-4">
          {/* Timeline line */}
          {index !== payments.length - 1 && (
            <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-200" />
          )}
          
          {/* Icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          
          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <div className="font-semibold text-green-600">
                  {formatCurrency(payment.amount)}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(payment.paymentDate)}
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Phương thức:</span>
                  <span className="font-medium text-gray-900">
                    {paymentMethodLabels[payment.method]}
                  </span>
                </div>
                {payment.reference && (
                  <div className="flex items-center justify-between">
                    <span>Mã tham chiếu:</span>
                    <span className="font-medium text-gray-900">{payment.reference}</span>
                  </div>
                )}
                {payment.note && (
                  <div className="mt-2 rounded bg-gray-50 p-2 text-xs text-gray-700">
                    {payment.note}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
