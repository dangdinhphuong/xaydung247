import { useState } from 'react';
import { Plus, Search, Eye, Edit } from 'lucide-react';
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
import { quotations } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';

const statusConfig = {
  draft: { label: 'Nháp', className: 'bg-gray-100 text-gray-700' },
  sent: { label: 'Đã gửi', className: 'bg-blue-100 text-blue-700' },
  accepted: { label: 'Đã chấp nhận', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Đã từ chối', className: 'bg-red-100 text-red-700' },
  expired: { label: 'Hết hạn', className: 'bg-orange-100 text-orange-700' },
};

export default function QuotationManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuotations = quotations.filter((quotation) =>
    quotation.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quotation.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý báo giá</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng cộng {filteredQuotations.length} báo giá
          </p>
        </div>
        <Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
          <Plus className="mr-2 h-4 w-4" />
          Tạo báo giá mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách báo giá</CardTitle>
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
                <TableHead>Mã báo giá</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Hiệu lực đến</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    Không tìm thấy báo giá nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium text-[#1E88E5]">
                      {quotation.quotationNumber}
                    </TableCell>
                    <TableCell>{quotation.customerName}</TableCell>
                    <TableCell>{formatDate(quotation.issueDate)}</TableCell>
                    <TableCell>{formatDate(quotation.validUntil)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(quotation.total)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[quotation.status].className}>
                        {statusConfig[quotation.status].label}
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
