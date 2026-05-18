import { useState } from 'react';
import { FilteredLink } from '../components/FilteredLink';
import { Plus, Search, Download, Eye, Edit, DollarSign, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { StatusBadge } from '../components/StatusBadge';
import { InvoiceCard } from '../components/InvoiceCard';
import { FilterDrawer } from '../components/FilterDrawer';
import { PaymentModal } from '../components/PaymentModal';
import { store } from '../data/store';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Invoice, InvoiceStatus } from '../types';

export default function InvoiceList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);

  const invoices = store.getInvoices();

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:space-y-6 lg:bg-white lg:pb-0">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b bg-white px-4 py-4 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-gray-900">Quản lý hóa đơn</h1>
            <p className="text-sm text-gray-500">
              {filteredInvoices.length} hóa đơn
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden items-center justify-between lg:flex">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý hóa đơn</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng cộng {filteredInvoices.length} hóa đơn
          </p>
        </div>
        <Button asChild className="bg-[#1E88E5] hover:bg-[#1976D2]">
          <FilteredLink to="/invoices/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo hóa đơn mới
          </FilteredLink>
        </Button>
      </div>

      {/* Mobile Search & Filter Bar */}
      <div className="sticky top-16 z-20 border-b bg-white px-4 py-3 lg:hidden">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Desktop Card */}
      <Card className="hidden lg:block">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Danh sách hóa đơn</CardTitle>
            <div className="flex flex-wrap gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as InvoiceStatus | 'all')}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                  <SelectItem value="partial">Thanh toán một phần</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                  <SelectItem value="overdue">Quá hạn</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hóa đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead className="hidden lg:table-cell">Ngày tạo</TableHead>
                <TableHead>Ngày đến hạn</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Đã thanh toán</TableHead>
                <TableHead className="text-right">Còn lại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">
                    Không tìm thấy hóa đơn nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      <FilteredLink
                        to={`/invoices/${invoice.id}`}
                        className="text-[#1E88E5] hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </FilteredLink>
                    </TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right">
                      {formatCurrency(invoice.paidAmount)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.remainingBalance)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <FilteredLink to={`/invoices/${invoice.id}`}>
                            <Eye className="h-4 w-4" />
                          </FilteredLink>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {invoice.remainingBalance > 0 && invoice.status !== 'draft' && (
                          <Button asChild variant="ghost" size="sm">
                            <FilteredLink to={`/invoices/${invoice.id}`}>
                              <DollarSign className="h-4 w-4 text-green-600" />
                            </FilteredLink>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="space-y-2 px-4 pt-3 lg:hidden">
        {filteredInvoices.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border bg-white">
            <p className="text-sm text-gray-500">Không tìm thấy hóa đơn nào</p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <FilteredLink
              key={invoice.id}
              to={`/invoices/${invoice.id}`}
              className="block rounded-lg border bg-white p-4 active:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-gray-900">
                      {invoice.invoiceNumber}
                    </p>
                    <StatusBadge status={invoice.status} />
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-600">
                    {invoice.customerName}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Đến hạn: {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(invoice.total)}
                  </p>
                  {invoice.remainingBalance > 0 && (
                    <p className="mt-1 text-sm font-medium text-orange-600">
                      Còn: {formatCurrency(invoice.remainingBalance)}
                    </p>
                  )}
                </div>
              </div>
            </FilteredLink>
          ))
        )}
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {selectedInvoiceForPayment && (
        <PaymentModal
          open={!!selectedInvoiceForPayment}
          onClose={() => setSelectedInvoiceForPayment(null)}
          onSubmit={(payment) => {
            // Handle payment submission
            setSelectedInvoiceForPayment(null);
          }}
          maxAmount={selectedInvoiceForPayment.remainingBalance}
        />
      )}

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 lg:hidden">
        <Button asChild className="w-full bg-[#1E88E5] text-base font-semibold hover:bg-[#1976D2]">
          <FilteredLink to="/invoices/create">
            <Plus className="mr-2 h-5 w-5" />
            Tạo hóa đơn mới
          </FilteredLink>
        </Button>
      </div>
    </div>
  );
}