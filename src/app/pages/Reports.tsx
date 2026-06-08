import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useInvoices, useCustomers } from '../hooks/queries';
import { LoadingState, ErrorState } from '../components/QueryStates';
import { formatCurrency } from '../utils/formatters';
import type { Invoice } from '../types';

const DAY = 24 * 60 * 60 * 1000;

function buildMonthly(invoices: Invoice[]) {
  const now = new Date();
  const months: { key: string; month: string; revenue: number; paid: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: `T${d.getMonth() + 1}/${d.getFullYear()}`, revenue: 0, paid: 0 });
  }
  const idx = new Map(months.map((m, i) => [m.key, i]));
  for (const inv of invoices) {
    if (inv.status === 'void') continue;
    const d = new Date(inv.issueDate);
    const i = idx.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (i !== undefined) {
      months[i].revenue += inv.total;
      months[i].paid += inv.paidAmount;
    }
  }
  return months;
}

export default function Reports() {
  const invoicesQuery = useInvoices({});
  const customersQuery = useCustomers({});

  if (invoicesQuery.isLoading || customersQuery.isLoading) return <LoadingState label="Đang tải báo cáo..." />;
  if (invoicesQuery.isError) return <ErrorState error={invoicesQuery.error} onRetry={() => invoicesQuery.refetch()} />;

  const invoices = invoicesQuery.data?.data ?? [];
  const customers = customersQuery.data?.data ?? [];
  const monthlyData = buildMonthly(invoices);

  const customerRevenue = customers
    .map((customer) => {
      const ci = invoices.filter((inv) => inv.customerId === customer.id && inv.status !== 'void');
      return {
        name: customer.name,
        revenue: ci.reduce((sum, inv) => sum + inv.paidAmount, 0),
        invoices: ci.length,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Aging từ hóa đơn còn nợ
  const now = Date.now();
  const agingBuckets = [
    { period: '0-30 ngày', amount: 0, count: 0 },
    { period: '31-60 ngày', amount: 0, count: 0 },
    { period: '61-90 ngày', amount: 0, count: 0 },
    { period: '90+ ngày', amount: 0, count: 0 },
  ];
  for (const inv of invoices) {
    if (inv.remainingBalance <= 0 || (inv.status !== 'unpaid' && inv.status !== 'partial')) continue;
    const days = Math.floor((now - new Date(inv.dueDate).getTime()) / DAY);
    const b = days <= 30 ? 0 : days <= 60 ? 1 : days <= 90 ? 2 : 3;
    agingBuckets[b].amount += inv.remainingBalance;
    agingBuckets[b].count += 1;
  }
  const agingTotal = agingBuckets.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Báo cáo</h1>
        <p className="mt-1 text-sm text-gray-500">Thống kê và phân tích dữ liệu kinh doanh</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Doanh số & đã thu theo tháng</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} labelStyle={{ color: '#000' }} />
              <Legend />
              <Bar dataKey="revenue" fill="#1E88E5" name="Tổng doanh số" />
              <Bar dataKey="paid" fill="#4CAF50" name="Đã thu" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-700">Tổng doanh số 6 tháng</p>
              <p className="mt-1 text-2xl font-bold text-blue-900">{formatCurrency(monthlyData.reduce((s, m) => s + m.revenue, 0))}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-700">Đã thu</p>
              <p className="mt-1 text-2xl font-bold text-green-900">{formatCurrency(monthlyData.reduce((s, m) => s + m.paid, 0))}</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-4">
              <p className="text-sm text-orange-700">Chưa thu</p>
              <p className="mt-1 text-2xl font-bold text-orange-900">{formatCurrency(monthlyData.reduce((s, m) => s + (m.revenue - m.paid), 0))}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Top 5 khách hàng (theo số tiền đã thu)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Xếp hạng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead className="text-right">Số hóa đơn</TableHead>
                <TableHead className="text-right">Tổng đã thu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerRevenue.map((customer, index) => (
                <TableRow key={customer.name}>
                  <TableCell>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88E5] font-bold text-white">{index + 1}</div>
                  </TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-right">{customer.invoices}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">{formatCurrency(customer.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Phân tích công nợ theo thời gian</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khoảng thời gian</TableHead>
                <TableHead className="text-right">Số lượng hóa đơn</TableHead>
                <TableHead className="text-right">Tổng công nợ</TableHead>
                <TableHead className="text-right">Tỷ lệ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agingBuckets.map((item) => (
                <TableRow key={item.period}>
                  <TableCell className="font-medium">{item.period}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center gap-1">
                      {agingTotal > 0 ? ((item.amount / agingTotal) * 100).toFixed(1) : '0.0'}%
                      <TrendingUp className="h-3 w-3 text-gray-400" />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-50 font-semibold">
                <TableCell>Tổng cộng</TableCell>
                <TableCell className="text-right">{agingBuckets.reduce((s, i) => s + i.count, 0)}</TableCell>
                <TableCell className="text-right">{formatCurrency(agingTotal)}</TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
