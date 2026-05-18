import { useState } from 'react';
import { Search, Plus, Eye, Edit, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { customers } from '../data/mockData';
import { store } from '../data/store';
import { formatCurrency } from '../utils/formatters';

export default function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const invoices = store.getInvoices();

  // Calculate debt for each customer
  const customersWithDebt = customers.map((customer) => {
    const customerInvoices = invoices.filter(
      (inv) => inv.customerId === customer.id && inv.remainingBalance > 0 && inv.status !== 'draft'
    );
    const totalDebt = customerInvoices.reduce((sum, inv) => sum + inv.remainingBalance, 0);
    
    return {
      ...customer,
      currentDebt: totalDebt,
    };
  });

  const filteredCustomers = customersWithDebt.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng cộng {filteredCustomers.length} khách hàng
          </p>
        </div>
        <Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
          <Plus className="mr-2 h-4 w-4" />
          Thêm khách hàng
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách khách hàng</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên khách hàng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Mã số thuế</TableHead>
                <TableHead className="text-right">Công nợ hiện tại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {customer.address}
                  </TableCell>
                  <TableCell>{customer.taxCode || '-'}</TableCell>
                  <TableCell className="text-right">
                    {customer.currentDebt > 0 ? (
                      <span className="font-medium text-orange-600">
                        {formatCurrency(customer.currentDebt)}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.status === 'active' ? 'default' : 'secondary'}
                      className={
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
