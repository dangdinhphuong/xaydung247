import { useState } from 'react';
import { useParams } from 'react-router';
import { ArrowLeft, Plus, Printer, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { StatusBadge } from '../components/StatusBadge';
import { PaymentModal } from '../components/PaymentModal';
import { FilteredLink } from '../components/FilteredLink';
import { useInvoice, useInvoiceMutations, useSettings } from '../hooks/queries';
import { useAuth } from '../auth/AuthContext';
import { LoadingState, ErrorState } from '../components/QueryStates';
import { getErrorMessage } from '../lib/errors';
import { printInvoiceFromTemplate } from '../lib/printInvoice';
import { formatCurrency, formatDate } from '../utils/formatters';

const paymentMethodLabels: Record<string, string> = {
  cash: 'Tiền mặt',
  bank_transfer: 'Chuyển khoản',
  check: 'Séc',
  other: 'Khác',
};

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { hasRole } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const { data: invoice, isLoading, isError, error, refetch } = useInvoice(id);
  const { data: settings } = useSettings();
  const { addPayment, finalize, void: voidInvoice } = useInvoiceMutations();

  const handlePrint = () => {
    if (invoice) printInvoiceFromTemplate(invoice, settings);
  };

  const canPay = hasRole('ADMIN', 'ACCOUNTANT');
  const canFinalize = hasRole('ADMIN', 'ACCOUNTANT');
  const canVoid = hasRole('ADMIN');

  if (isLoading) return <LoadingState label="Đang tải hóa đơn..." />;
  if (isError) {
    return (
      <div className="space-y-4">
        <ErrorState error={error} onRetry={() => refetch()} />
        <div className="text-center">
          <Button asChild variant="outline"><FilteredLink to="/invoices">Quay lại danh sách</FilteredLink></Button>
        </div>
      </div>
    );
  }
  if (!invoice) return null;

  const handleAddPayment = async (payment: {
    amount: number; paymentDate: string; method: any; reference?: string; note?: string;
  }) => {
    try {
      await addPayment.mutateAsync({ id: invoice.id, data: payment });
      toast.success('Thêm thanh toán thành công!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleFinalize = async () => {
    if (!window.confirm('Phát hành hóa đơn này? Hóa đơn sẽ được cấp số chính thức.')) return;
    try {
      await finalize.mutateAsync(invoice.id);
      toast.success('Đã phát hành hóa đơn');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleVoid = async () => {
    const reason = window.prompt('Lý do hủy hóa đơn:');
    if (!reason) return;
    try {
      await voidInvoice.mutateAsync({ id: invoice.id, reason });
      toast.success('Đã hủy hóa đơn');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const canAddPayment =
    invoice.remainingBalance > 0 && invoice.status !== 'draft' && invoice.status !== 'void';

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:bg-white lg:pb-0">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 shrink-0">
            <FilteredLink to="/invoices"><ArrowLeft className="h-5 w-5" /></FilteredLink>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-gray-900">{invoice.invoiceNumber ?? '(Nháp)'}</h1>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={handlePrint} title="In hóa đơn">
            <Printer className="h-5 w-5" />
          </Button>
          <StatusBadge status={invoice.status} isOverdue={invoice.isOverdue} />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden space-y-6 lg:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <FilteredLink to="/invoices"><ArrowLeft className="h-5 w-5" /></FilteredLink>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{invoice.invoiceNumber ?? '(Nháp)'}</h1>
                <StatusBadge status={invoice.status} isOverdue={invoice.isOverdue} />
              </div>
              <p className="mt-1 text-sm text-gray-500">Chi tiết hóa đơn</p>
            </div>
          </div>
          <div className="flex gap-2">
            {invoice.status === 'draft' && canFinalize && (
              <Button onClick={handleFinalize} disabled={finalize.isPending} className="bg-[#1E88E5] hover:bg-[#1976D2]">
                <CheckCircle className="mr-2 h-4 w-4" />
                Phát hành
              </Button>
            )}
            {invoice.status !== 'void' && invoice.status !== 'paid' && canVoid && (
              <Button onClick={handleVoid} disabled={voidInvoice.isPending} variant="outline" className="text-red-600">
                <XCircle className="mr-2 h-4 w-4" />
                Hủy
              </Button>
            )}
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              In
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 lg:mt-6 lg:space-y-6">
        <div className="grid gap-3 lg:grid-cols-3 lg:gap-6">
          {/* Left Column */}
          <div className="space-y-3 lg:col-span-2 lg:space-y-6">
            {/* Invoice Information */}
            <Card className="mx-4 border-0 shadow-none lg:mx-0 lg:border lg:shadow-sm">
              <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
                <CardTitle className="text-base lg:text-xl">Thông tin hóa đơn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-4 lg:px-6 lg:pb-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                    <p className="mt-1 font-semibold text-gray-900">{invoice.customerName}</p>
                    <p className="text-sm text-gray-600">{invoice.customerPhone}</p>
                    <p className="text-sm text-gray-600">{invoice.customerAddress}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày tạo</p>
                        <p className="font-medium">{formatDate(invoice.issueDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày đến hạn</p>
                        <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {invoice.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ghi chú</p>
                    <p className="mt-1 whitespace-pre-line text-gray-900">{invoice.notes}</p>
                  </div>
                )}
                {invoice.voidReason && (
                  <div className="rounded-lg bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-700">Lý do hủy</p>
                    <p className="mt-1 text-red-900">{invoice.voidReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="mx-4 border-0 shadow-none lg:mx-0 lg:border lg:shadow-sm">
              <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
                <CardTitle className="text-base lg:text-xl">Chi tiết mặt hàng</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Giảm giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{item.discount > 0 ? formatCurrency(item.discount) : '-'}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.lineTotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Tạm tính</span><span className="font-medium">{formatCurrency(invoice.subtotal)}</span></div>
                  {invoice.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Giảm giá</span><span className="font-medium text-red-600">-{formatCurrency(invoice.discount)}</span></div>}
                  {invoice.tax > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Thuế VAT</span><span className="font-medium">{formatCurrency(invoice.tax)}</span></div>}
                  {invoice.shipping > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Phí vận chuyển</span><span className="font-medium">{formatCurrency(invoice.shipping)}</span></div>}
                  <Separator />
                  <div className="flex justify-between text-base font-bold lg:text-lg"><span>Tổng cộng</span><span className="text-[#1E88E5]">{formatCurrency(invoice.total)}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="mx-4 border-0 shadow-none lg:mx-0 lg:border lg:shadow-sm">
              <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base lg:text-xl">Lịch sử thanh toán</CardTitle>
                  {canAddPayment && canPay && (
                    <Button onClick={() => setPaymentModalOpen(true)} size="sm" className="hidden bg-green-600 hover:bg-green-700 md:flex">
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm thanh toán
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                {invoice.payments.length === 0 ? (
                  <p className="py-4 text-center text-gray-500">Chưa có thanh toán nào</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày thanh toán</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Phương thức</TableHead>
                        <TableHead>Mã tham chiếu</TableHead>
                        <TableHead>Ghi chú</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                          <TableCell className="font-medium text-green-600">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{paymentMethodLabels[payment.method]}</TableCell>
                          <TableCell>{payment.reference || '-'}</TableCell>
                          <TableCell>{payment.note || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="hidden space-y-6 lg:block">
            <Card>
              <CardHeader><CardTitle>Tổng kết thanh toán</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-700">Tổng hóa đơn</p>
                  <p className="mt-1 text-2xl font-bold text-blue-900">{formatCurrency(invoice.total)}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-green-700">Đã thanh toán</p>
                  <p className="mt-1 text-2xl font-bold text-green-900">{formatCurrency(invoice.paidAmount)}</p>
                </div>
                <div className={`rounded-lg p-4 ${invoice.remainingBalance > 0 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${invoice.remainingBalance > 0 ? 'text-orange-700' : 'text-gray-700'}`}>Còn lại</p>
                  <p className={`mt-1 text-2xl font-bold ${invoice.remainingBalance > 0 ? 'text-orange-900' : 'text-gray-900'}`}>{formatCurrency(invoice.remainingBalance)}</p>
                </div>
                {canAddPayment && canPay && (
                  <Button onClick={() => setPaymentModalOpen(true)} className="w-full bg-green-600 hover:bg-green-700">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Thêm thanh toán
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PaymentModal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSubmit={handleAddPayment} maxAmount={invoice.remainingBalance} />

      {/* Mobile Bottom Action Bar */}
      {canAddPayment && canPay && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 lg:hidden">
          <Button onClick={() => setPaymentModalOpen(true)} className="w-full bg-green-600 text-base font-semibold hover:bg-green-700">
            <DollarSign className="mr-2 h-5 w-5" />
            Thêm thanh toán
          </Button>
        </div>
      )}
    </div>
  );
}
