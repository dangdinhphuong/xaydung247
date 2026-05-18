import { Download, TrendingUp } from 'lucide-react';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { store } from '../data/store';
import { customers } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

const monthlyData = [
  { month: 'T9/2025', revenue: 285000000, paid: 240000000 },
  { month: 'T10/2025', revenue: 320000000, paid: 298000000 },
  { month: 'T11/2025', revenue: 298000000, paid: 275000000 },
  { month: 'T12/2025', revenue: 410000000, paid: 385000000 },
  { month: 'T1/2026', revenue: 385000000, paid: 350000000 },
  { month: 'T2/2026', revenue: 450000000, paid: 372000000 },
];

export default function Reports() {
  const invoices = store.getInvoices();

  // Calculate top customers by revenue
  const customerRevenue = customers.map((customer) => {
    const customerInvoices = invoices.filter((inv) => inv.customerId === customer.id);
    const totalRevenue = customerInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalInvoices = customerInvoices.length;

    return {
      name: customer.name,
      revenue: totalRevenue,
      invoices: totalInvoices,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Debt aging report
  const agingData = [
    { period: '0-30 ngày', amount: 55000000, count: 3 },
    { period: '31-60 ngày', amount: 85000000, count: 2 },
    { period: '61-90 ngày', amount: 98000000, count: 2 },
    { period: '90+ ngày', amount: 40000000, count: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo</h1>
          <p className="mt-1 text-sm text-gray-500">
            Thống kê và phân tích dữ liệu kinh doanh
          </p>
        </div>
      </div>

      {/* Revenue Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Báo cáo doanh thu theo tháng</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="revenue" fill="#1E88E5" name="Tổng doanh thu" />
              <Bar dataKey="paid" fill="#4CAF50" name="Đã thu" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-700">Tổng doanh thu 6 tháng</p>
              <p className="mt-1 text-2xl font-bold text-blue-900">
                {formatCurrency(monthlyData.reduce((sum, m) => sum + m.revenue, 0))}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-700">Đã thu</p>
              <p className="mt-1 text-2xl font-bold text-green-900">
                {formatCurrency(monthlyData.reduce((sum, m) => sum + m.paid, 0))}
              </p>
            </div>
            <div className="rounded-lg bg-orange-50 p-4">
              <p className="text-sm text-orange-700">Chưa thu</p>
              <p className="mt-1 text-2xl font-bold text-orange-900">
                {formatCurrency(
                  monthlyData.reduce((sum, m) => sum + (m.revenue - m.paid), 0)
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top 5 khách hàng</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Xếp hạng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead className="text-right">Số hóa đơn</TableHead>
                <TableHead className="text-right">Tổng doanh thu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerRevenue.map((customer, index) => (
                <TableRow key={customer.name}>
                  <TableCell>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88E5] text-white font-bold">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-right">{customer.invoices}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {formatCurrency(customer.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Debt Aging */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Báo cáo phân tích công nợ theo thời gian</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </CardHeader>
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
              {agingData.map((item) => {
                const total = agingData.reduce((sum, i) => sum + i.amount, 0);
                const percentage = ((item.amount / total) * 100).toFixed(1);

                return (
                  <TableRow key={item.period}>
                    <TableCell className="font-medium">{item.period}</TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1">
                        {percentage}%
                        <TrendingUp className="h-3 w-3 text-gray-400" />
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-gray-50 font-semibold">
                <TableCell>Tổng cộng</TableCell>
                <TableCell className="text-right">
                  {agingData.reduce((sum, i) => sum + i.count, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(agingData.reduce((sum, i) => sum + i.amount, 0))}
                </TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
