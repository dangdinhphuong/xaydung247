import { DollarSign, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { FilteredLink } from '../components/FilteredLink';
import { SummaryCard } from '../components/SummaryCard';
import { StatusBadge } from '../components/StatusBadge';
import { InvoiceCard } from '../components/InvoiceCard';
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
import { store } from '../data/store';
import { formatCurrency, formatDate } from '../utils/formatters';

// Sample data for revenue chart
const revenueData = [
  { month: 'T9/2025', revenue: 285000000 },
  { month: 'T10/2025', revenue: 320000000 },
  { month: 'T11/2025', revenue: 298000000 },
  { month: 'T12/2025', revenue: 410000000 },
  { month: 'T1/2026', revenue: 385000000 },
  { month: 'T2/2026', revenue: 450000000 },
];

const debtDistributionData = [
  { name: '0-30 ngày', value: 55000000, color: '#4CAF50' },
  { name: '31-60 ngày', value: 85000000, color: '#FF9800' },
  { name: '61+ ngày', value: 138000000, color: '#F44336' },
];

export default function Dashboard() {
  const invoices = store.getInvoices();

  // Calculate statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyRevenue = invoices
    .filter(inv => {
      const invDate = new Date(inv.issueDate);
      return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
    })
    .reduce((sum, inv) => sum + inv.paidAmount, 0);

  const totalDebt = invoices.reduce((sum, inv) => sum + inv.remainingBalance, 0);
  const unpaidCount = invoices.filter(inv => inv.status !== 'paid' && inv.status !== 'draft').length;
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  // Recent invoices (last 5)
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);

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
          value={formatCurrency(monthlyRevenue)}
          icon={DollarSign}
          iconColor="text-green-600"
          trend={{ value: '+12.5%', isPositive: true }}
        />
        <SummaryCard
          title="Tổng công nợ phải thu"
          value={formatCurrency(totalDebt)}
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
        <SummaryCard
          title="Hóa đơn chưa thanh toán"
          value={unpaidCount}
          icon={FileText}
          iconColor="text-blue-600"
        />
        <SummaryCard
          title="Hóa đơn quá hạn"
          value={overdueCount}
          icon={AlertCircle}
          iconColor="text-red-600"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-3 px-4 md:gap-6 md:px-0 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
            <CardTitle className="text-base lg:text-xl">Doanh thu 6 tháng qua</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4 lg:px-6 lg:pb-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }} 
                  interval={0}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => `${value / 1000000}M`}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1E88E5" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
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
                    <Pie
                      data={debtDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      isAnimationActive={false}
                    >
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
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.value)}
                    </span>
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
                      <FilteredLink
                        to={`/invoices/${invoice.id}`}
                        className="text-[#1E88E5] hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </FilteredLink>
                    </TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
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

          {/* Mobile Card View */}
          <div className="space-y-2 md:hidden">
            {recentInvoices.map((invoice) => (
              <FilteredLink
                key={invoice.id}
                to={`/invoices/${invoice.id}`}
                className="block rounded-lg border bg-white p-3 active:bg-gray-50 lg:border-0"
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
                      {formatDate(invoice.issueDate)}
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}