import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Printer, Download, Calendar, DollarSign } from 'lucide-react';
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
import { InvoiceItemCard } from '../components/InvoiceItemCard';
import { PaymentTimeline } from '../components/PaymentTimeline';
import { FilteredLink } from '../components/FilteredLink';
import { store } from '../data/store';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoice, setInvoice] = useState(store.getInvoice(id!));

  // Refetch invoice when payments are added
  useEffect(() => {
    const updatedInvoice = store.getInvoice(id!);
    setInvoice(updatedInvoice);
  }, [id]);

  const handleAddPayment = (payment: {
    amount: number;
    paymentDate: string;
    method: any;
    reference?: string;
    note?: string;
  }) => {
    const newPayment = {
      id: `PAY${Date.now()}`,
      invoiceId: invoice!.id,
      ...payment,
    };

    store.addPayment(newPayment);
    
    // Update local state with the new invoice data
    const updatedInvoice = store.getInvoice(id!);
    setInvoice(updatedInvoice);
    
    toast.success('Thêm thanh toán thành công!');
  };

  const paymentMethodLabels: Record<string, string> = {
    cash: 'Tiền mặt',
    bank_transfer: 'Chuyển khoản',
    check: 'Séc',
    other: 'Khác',
  };

  if (!invoice) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy hóa đơn</h2>
          <p className="mt-2 text-gray-500">Hóa đơn không tồn tại hoặc đã bị xóa</p>
          <Button asChild className="mt-4">
            <FilteredLink to="/invoices">Quay lại danh sách</FilteredLink>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:bg-white lg:pb-0">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 shrink-0">
            <FilteredLink to="/invoices">
              <ArrowLeft className="h-5 w-5" />
            </FilteredLink>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-gray-900">
              {invoice.invoiceNumber}
            </h1>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden space-y-6 lg:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <FilteredLink to="/invoices">
                <ArrowLeft className="h-5 w-5" />
              </FilteredLink>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {invoice.invoiceNumber}
              </h1>
              <p className="mt-1 text-sm text-gray-500">Chi tiết hóa đơn</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              In
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Tải PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 lg:mt-6 lg:space-y-6">
        <div className="grid gap-3 lg:grid-cols-3 lg:gap-6">
          {/* Left Column - Invoice Details */}
          <div className="space-y-3 lg:col-span-2 lg:space-y-6">
            {/* Payment Summary Cards - Mobile Only */}
            <div className="grid grid-cols-3 gap-2 px-4 pt-4 lg:hidden">
              <div className="rounded-lg border bg-white p-3">
                <p className="text-xs text-gray-600">Tổng HĐ</p>
                <p className="mt-1 truncate text-sm font-bold text-gray-900">
                  {formatCurrency(invoice.total)}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-3">
                <p className="text-xs text-green-600">Đã TT</p>
                <p className="mt-1 truncate text-sm font-bold text-green-700">
                  {formatCurrency(invoice.paidAmount)}
                </p>
              </div>
              <div className={`rounded-lg border p-3 ${
                invoice.remainingBalance > 0 ? 'bg-orange-50' : 'bg-white'
              }`}>
                <p className={`text-xs ${
                  invoice.remainingBalance > 0 ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  Còn lại
                </p>
                <p className={`mt-1 truncate text-sm font-bold ${
                  invoice.remainingBalance > 0 ? 'text-orange-700' : 'text-gray-900'
                }`}>
                  {formatCurrency(invoice.remainingBalance)}
                </p>
              </div>
            </div>

            {/* Invoice Information */}
            <Card className="mx-4 border-0 shadow-none lg:mx-0 lg:border lg:shadow-sm">
              <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base lg:text-xl">Thông tin hóa đơn</CardTitle>
                  <StatusBadge status={invoice.status} className="lg:hidden" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-4 lg:px-6 lg:pb-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {invoice.customerName}
                    </p>
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
                    <p className="mt-1 text-gray-900">{invoice.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Items Section */}
            <Card className="mx-4 border-0 shadow-none lg:mx-0 lg:border lg:shadow-sm">
              <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
                <CardTitle className="text-base lg:text-xl">Chi tiết mặt hàng</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                {/* Desktop Table */}
                <div className="hidden md:block">
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
                          <TableCell className="font-medium">
                            {item.productName}
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.discount > 0 ? formatCurrency(item.discount) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.lineTotal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-2 md:hidden">
                  {invoice.items.map((item) => (
                    <div key={item.id} className="rounded-lg border bg-white p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-900">{item.productName}</p>
                          <p className="mt-1 text-sm text-gray-600">
                            {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(item.lineTotal)}</p>
                          {item.discount > 0 && (
                            <p className="text-xs text-red-600">-{formatCurrency(item.discount)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(invoice.discount)}
                      </span>
                    </div>
                  )}
                  {invoice.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Thuế VAT</span>
                      <span className="font-medium">{formatCurrency(invoice.tax)}</span>
                    </div>
                  )}
                  {invoice.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-medium">{formatCurrency(invoice.shipping)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-base font-bold lg:text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-[#1E88E5]">
                      {formatCurrency(invoice.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="mx-4 border-0 shadow-none lg:mx-0 lg:border lg:shadow-sm">
              <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base lg:text-xl">Lịch sử thanh toán</CardTitle>
                  {invoice.remainingBalance > 0 && invoice.status !== 'draft' && (
                    <Button
                      onClick={() => setPaymentModalOpen(true)}
                      size="sm"
                      className="hidden bg-green-600 hover:bg-green-700 md:flex"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm thanh toán
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  {invoice.payments.length === 0 ? (
                    <p className="text-center text-gray-500">Chưa có thanh toán nào</p>
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
                            <TableCell className="font-medium text-green-600">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell>{paymentMethodLabels[payment.method]}</TableCell>
                            <TableCell>{payment.reference || '-'}</TableCell>
                            <TableCell>{payment.note || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>

                {/* Mobile Cards */}
                <div className="space-y-2 md:hidden">
                  {invoice.payments.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">Chưa có thanh toán nào</p>
                  ) : (
                    invoice.payments.map((payment) => (
                      <div key={payment.id} className="rounded-lg border bg-white p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-green-700">
                              {formatCurrency(payment.amount)}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              {formatDate(payment.paymentDate)} • {paymentMethodLabels[payment.method]}
                            </p>
                            {payment.reference && (
                              <p className="mt-1 text-xs text-gray-500">
                                M GD: {payment.reference}
                              </p>
                            )}
                            {payment.note && (
                              <p className="mt-1 text-xs text-gray-500">{payment.note}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Summary (Desktop Only) */}
          <div className="hidden space-y-6 lg:block">
            <Card>
              <CardHeader>
                <CardTitle>Tổng kết thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-700">Tổng hóa đơn</p>
                  <p className="mt-1 text-2xl font-bold text-blue-900">
                    {formatCurrency(invoice.total)}
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-green-700">Đã thanh toán</p>
                  <p className="mt-1 text-2xl font-bold text-green-900">
                    {formatCurrency(invoice.paidAmount)}
                  </p>
                </div>

                <div
                  className={`rounded-lg p-4 ${
                    invoice.remainingBalance > 0
                      ? 'bg-orange-50'
                      : 'bg-gray-50'
                  }`}
                >
                  <p
                    className={`text-sm ${
                      invoice.remainingBalance > 0
                        ? 'text-orange-700'
                        : 'text-gray-700'
                    }`}
                  >
                    Còn lại
                  </p>
                  <p
                    className={`mt-1 text-2xl font-bold ${
                      invoice.remainingBalance > 0
                        ? 'text-orange-900'
                        : 'text-gray-900'
                    }`}
                  >
                    {formatCurrency(invoice.remainingBalance)}
                  </p>
                </div>

                {invoice.remainingBalance > 0 && invoice.status !== 'draft' && (
                  <Button
                    onClick={() => setPaymentModalOpen(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Thêm thanh toán
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin bổ sung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số lượng thanh toán</span>
                  <span className="font-medium">{invoice.payments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số mặt hàng</span>
                  <span className="font-medium">{invoice.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng số lượng</span>
                  <span className="font-medium">
                    {invoice.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={handleAddPayment}
        maxAmount={invoice.remainingBalance}
      />

      {/* Mobile Bottom Action Bar */}
      {invoice.remainingBalance > 0 && invoice.status !== 'draft' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 lg:hidden">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {/* Print action */}}
            >
              <Printer className="mr-2 h-5 w-5" />
              In
            </Button>
            <Button
              onClick={() => setPaymentModalOpen(true)}
              className="flex-1 bg-green-600 text-base font-semibold hover:bg-green-700"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Thêm thanh toán
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}