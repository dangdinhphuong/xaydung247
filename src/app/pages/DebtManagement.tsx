import { useState } from 'react';
import { Link } from 'react-router';
import { AlertCircle, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { SummaryCard } from '../components/SummaryCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { StatusBadge } from '../components/StatusBadge';
import { store } from '../data/store';
import { customers } from '../data/mockData';
import { formatCurrency, formatDate, getDaysBetween } from '../utils/formatters';
import type { DebtInfo, Invoice } from '../types';

export default function DebtManagement() {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const invoices = store.getInvoices();

  // Calculate debt by customer
  const debtByCustomer: DebtInfo[] = customers.map((customer) => {
    const customerInvoices = invoices.filter(
      (inv) => inv.customerId === customer.id && inv.remainingBalance > 0 && inv.status !== 'draft'
    );

    const totalDebt = customerInvoices.reduce(
      (sum, inv) => sum + inv.remainingBalance,
      0
    );

    const overdueInvoices = customerInvoices.filter((inv) => inv.status === 'overdue');

    // Calculate aging
    const aging = {
      current: 0,
      thirtyDays: 0,
      sixtyDaysPlus: 0,
    };

    customerInvoices.forEach((inv) => {
      const daysOverdue = getDaysBetween(inv.dueDate, new Date().toISOString().split('T')[0]);
      
      if (daysOverdue <= 0) {
        aging.current += inv.remainingBalance;
      } else if (daysOverdue <= 30) {
        aging.current += inv.remainingBalance;
      } else if (daysOverdue <= 60) {
        aging.thirtyDays += inv.remainingBalance;
      } else {
        aging.sixtyDaysPlus += inv.remainingBalance;
      }
    });

    return {
      customerId: customer.id,
      customerName: customer.name,
      totalDebt,
      unpaidInvoicesCount: customerInvoices.length,
      overdueInvoicesCount: overdueInvoices.length,
      aging,
    };
  }).filter((debt) => debt.totalDebt > 0);

  const totalDebt = debtByCustomer.reduce((sum, debt) => sum + debt.totalDebt, 0);
  const totalOverdueCount = debtByCustomer.reduce(
    (sum, debt) => sum + debt.overdueInvoicesCount,
    0
  );

  const customerInvoices = selectedCustomer
    ? invoices.filter(
        (inv) =>
          inv.customerId === selectedCustomer &&
          inv.remainingBalance > 0 &&
          inv.status !== 'draft'
      )
    : [];

  const selectedDebt = debtByCustomer.find((d) => d.customerId === selectedCustomer);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý công nợ</h1>
        <p className="mt-1 text-sm text-gray-500">
          Theo dõi và quản lý công nợ phải thu từ khách hàng
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Tổng công nợ phải thu"
          value={formatCurrency(totalDebt)}
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
        <SummaryCard
          title="Khách hàng có nợ"
          value={debtByCustomer.length}
          icon={AlertCircle}
          iconColor="text-blue-600"
        />
        <SummaryCard
          title="Hóa đơn quá hạn"
          value={totalOverdueCount}
          icon={AlertCircle}
          iconColor="text-red-600"
        />
      </div>

      {/* Debt by Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Công nợ theo khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead className="text-right">Tổng nợ</TableHead>
                <TableHead className="text-right">Số HĐ chưa thanh toán</TableHead>
                <TableHead className="text-right">HĐ quá hạn</TableHead>
                <TableHead className="text-right">0-30 ngày</TableHead>
                <TableHead className="text-right">31-60 ngày</TableHead>
                <TableHead className="text-right">61+ ngày</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debtByCustomer.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">
                    Không có công nợ nào
                  </TableCell>
                </TableRow>
              ) : (
                debtByCustomer.map((debt) => (
                  <TableRow key={debt.customerId}>
                    <TableCell className="font-medium">{debt.customerName}</TableCell>
                    <TableCell className="text-right font-semibold text-orange-600">
                      {formatCurrency(debt.totalDebt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {debt.unpaidInvoicesCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {debt.overdueInvoicesCount > 0 && (
                        <span className="font-medium text-red-600">
                          {debt.overdueInvoicesCount}
                        </span>
                      )}
                      {debt.overdueInvoicesCount === 0 && '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {debt.aging.current > 0
                        ? formatCurrency(debt.aging.current)
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {debt.aging.thirtyDays > 0
                        ? formatCurrency(debt.aging.thirtyDays)
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {debt.aging.sixtyDaysPlus > 0
                        ? formatCurrency(debt.aging.sixtyDaysPlus)
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(debt.customerId)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết công nợ - {selectedDebt?.customerName}</DialogTitle>
            <DialogDescription>
              Xem chi tiết về công nợ của khách hàng {selectedDebt?.customerName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDebt && (
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-orange-50 p-4">
                  <p className="text-sm text-orange-700">Tổng nợ</p>
                  <p className="mt-1 text-xl font-bold text-orange-900">
                    {formatCurrency(selectedDebt.totalDebt)}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-700">HĐ chưa thanh toán</p>
                  <p className="mt-1 text-xl font-bold text-blue-900">
                    {selectedDebt.unpaidInvoicesCount}
                  </p>
                </div>
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-700">HĐ quá hạn</p>
                  <p className="mt-1 text-xl font-bold text-red-900">
                    {selectedDebt.overdueInvoicesCount}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-700">Tổng HĐ</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {customerInvoices.length}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-3 font-semibold">Danh sách hóa đơn chưa thanh toán</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã hóa đơn</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Ngày đến hạn</TableHead>
                    <TableHead className="text-right">Tổng tiền</TableHead>
                    <TableHead className="text-right">Đã thanh toán</TableHead>
                    <TableHead className="text-right">Còn lại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        <Link
                          to={`/invoices/${invoice.id}`}
                          className="text-[#1E88E5] hover:underline"
                          onClick={() => setSelectedCustomer(null)}
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(invoice.paidAmount)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-orange-600">
                        {formatCurrency(invoice.remainingBalance)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}