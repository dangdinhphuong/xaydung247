import { DollarSign, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { FilteredLink } from '../components/FilteredLink';
import { SummaryCard } from '../components/SummaryCard';
import { StatusBadge } from '../components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboard, useInvoices } from '../hooks/queries';
import { LoadingState, ErrorState } from '../components/QueryStates';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Invoice } from '../types';

const DAY = 24 * 60 * 60 * 1000;

function buildRevenueData(invoices: Invoice[]) {
  const now = new Date();
  const months: { key: string; month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: `T${d.getMonth() + 1}/${d.getFullYear()}`,
      revenue: 0,
    });
  }
  const idx = new Map(months.map((m, i) => [m.key, i]));
  for (const inv of invoices) {
    if (inv.status === 'void') continue;
    const d = new Date(inv.issueDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const i = idx.get(key);
    if (i !== undefined) months[i].revenue += inv.total;
  }
  return months;
}

function buildDebtDistribution(invoices: Invoice[]) {
  const now = Date.now();
  let b1 = 0, b2 = 0, b3 = 0;
  for (const inv of invoices) {
    if (inv.remainingBalance <= 0) continue;
    if (inv.status !== 'unpaid' && inv.status !== 'partial') continue;
    const days = Math.floor((now - new Date(inv.dueDate).getTime()) / DAY);
    if (days <= 30) b1 += inv.remainingBalance;
    else if (days <= 60) b2 += inv.remainingBalance;
    else b3 += inv.remainingBalance;
  }
  return [
    { name: '0-30 ngày', value: b1, color: '#4CAF50' },
    { name: '31-60 ngày', value: b2, color: '#FF9800' },
    { name: '61+ ngày', value: b3, color: '#F44336' },
  ];
}

export default function Dashboard() {
  const dashboard = useDashboard();
  const invoicesQuery = useInvoices({});

  if (dashboard.isLoading) return <LoadingState label="Đang tải dashboard..." />;
  if (dashboard.isError)
    return <ErrorState error={dashboard.error} onRetry={() => dashboard.refetch()} />;

  const data = dashboard.data!;
  const allInvoices = invoicesQuery.data?.data ?? [];
  const revenueData = buildRevenueData(allInvoices);
  const debtDistributionData = buildDebtDistribution(allInvoices);
  const recentInvoices = data.recentInvoices;

  return (
    <div className="min-h-screen bg-gray-50 pb-6 lg:space-y-6 lg:bg-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b bg-white px-4 py-4 lg:hidden">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Tổng quan kinh doanh</p>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng quan về hoạt động kinh doanh
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 px-4 pt-4 md:grid-cols-2 md:gap-6 md:px-0 lg:grid-cols-4">
        <SummaryCard
          title="Tổng doanh thu tháng này"
          value={formatCurrency(data.monthlyRevenue)}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <SummaryCard
          title="Tổng công nợ phải thu"
          value={formatCurrency(data.totalDebt)}
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
        <SummaryCard
          title="Hóa đơn chưa thanh toán"
          value={data.unpaidCount}
          icon={FileText}
          iconColor="text-blue-600"
        />
        <SummaryCard
          title="Hóa đơn quá hạn"
          value={data.overdueCount}
          icon={AlertCircle}
          iconColor="text-red-600"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-3 px-4 md:gap-6 md:px-0 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
            <CardTitle className="text-base lg:text-xl">Doanh số 6 tháng qua</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4 lg:px-6 lg:pb-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} interval={0} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} labelStyle={{ color: '#000' }} />
                <Line type="monotone" dataKey="revenue" stroke="#1E88E5" strokeWidth={2} dot={false} activeDot={{ r: 6 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Debt Distribution Chart */}
        <Card className="border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
            <CardTitle className="text-base lg:text-xl">Phân bổ công nợ theo thời gian</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="w-full md:w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={debtDistributionData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" isAnimationActive={false}>
                      {debtDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-2 md:w-1/2">
                {debtDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-lg border bg-white p-3 lg:border-0">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card className="mx-4 border-0 shadow-none md:mx-0 lg:border lg:shadow-sm">
        <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base lg:text-xl">Hóa đơn gần đây</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-[#1E88E5]">
              <FilteredLink to="/invoices">Xem tất cả</FilteredLink>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
          {recentInvoices.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">Chưa có hóa đơn nào</p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã hóa đơn</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead className="hidden lg:table-cell">Ngày tạo</TableHead>
                      <TableHead className="text-right">Tổng tiền</TableHead>
                      <TableHead className="text-right">Còn lại</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          <FilteredLink to={`/invoices/${invoice.id}`} className="text-[#1E88E5] hover:underline">
                            {invoice.invoiceNumber ?? '(Nháp)'}
                          </FilteredLink>
                        </TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(invoice.issueDate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(invoice.total)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(invoice.remainingBalance)}</TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status} isOverdue={invoice.isOverdue} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="space-y-2 md:hidden">
                {recentInvoices.map((invoice) => (
                  <FilteredLink key={invoice.id} to={`/invoices/${invoice.id}`} className="block rounded-lg border bg-white p-3 active:bg-gray-50 lg:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-gray-900">{invoice.invoiceNumber ?? '(Nháp)'}</p>
                          <StatusBadge status={invoice.status} isOverdue={invoice.isOverdue} />
                        </div>
                        <p className="mt-1 truncate text-sm text-gray-600">{invoice.customerName}</p>
                        <p className="mt-1 text-xs text-gray-500">{formatDate(invoice.issueDate)}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(invoice.total)}</p>
                        {invoice.remainingBalance > 0 && (
                          <p className="mt-1 text-sm font-medium text-orange-600">Còn: {formatCurrency(invoice.remainingBalance)}</p>
                        )}
                      </div>
                    </div>
                  </FilteredLink>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
