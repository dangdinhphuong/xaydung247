import { useState } from 'react';
import { Search, Plus, Edit, Mail, Phone, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
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
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import { useCustomers, useCustomerMutations } from '../hooks/queries';
import { useAuth } from '../auth/AuthContext';
import { LoadingState, ErrorState, EmptyState } from '../components/QueryStates';
import { getErrorMessage } from '../lib/errors';
import { formatCurrency } from '../utils/formatters';
import type { Customer } from '../types';

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  status: 'active' | 'inactive';
}

const emptyForm: FormState = { name: '', phone: '', email: '', address: '', taxCode: '', status: 'active' };

export default function CustomerManagement() {
  const { hasRole } = useAuth();
  const canCreate = hasRole('ADMIN', 'ACCOUNTANT', 'SALES');
  const canDelete = hasRole('ADMIN');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const { data, isLoading, isError, error, refetch } = useCustomers({
    search: searchQuery || undefined,
  });
  const { create, update, remove } = useCustomerMutations();
  const customers = data?.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };
  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({
      name: c.name, phone: c.phone, email: c.email, address: c.address,
      taxCode: c.taxCode ?? '', status: c.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      taxCode: form.taxCode.trim() || undefined,
      status: form.status,
    };
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data: payload });
        toast.success('Cập nhật khách hàng thành công');
      } else {
        await create.mutateAsync(payload);
        toast.success('Thêm khách hàng thành công');
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (c: Customer) => {
    if (!window.confirm(`Xóa khách hàng "${c.name}"?`)) return;
    try {
      await remove.mutateAsync(c.id);
      toast.success('Đã xóa khách hàng');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="mt-1 text-sm text-gray-500">Tổng cộng {customers.length} khách hàng</p>
        </div>
        {canCreate && (
          <Button className="bg-[#1E88E5] hover:bg-[#1976D2]" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm khách hàng
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách khách hàng</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState label="Đang tải khách hàng..." />
          ) : isError ? (
            <ErrorState error={error} onRetry={() => refetch()} />
          ) : customers.length === 0 ? (
            <EmptyState message="Không tìm thấy khách hàng" icon={Users} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên khách hàng</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Mã số thuế</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                      <div className="text-xs text-gray-400">{customer.code}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm"><Phone className="h-3 w-3 text-gray-400" />{customer.phone}</div>
                        <div className="flex items-center gap-2 text-sm"><Mail className="h-3 w-3 text-gray-400" />{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{customer.address}</TableCell>
                    <TableCell>{customer.taxCode || '-'}</TableCell>
                    <TableCell>
                      <Badge className={customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {canCreate && (
                          <Button variant="ghost" size="sm" onClick={() => openEdit(customer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(customer)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa khách hàng' : 'Thêm khách hàng'}</DialogTitle>
            <DialogDescription>Nhập thông tin khách hàng.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="c-name">Tên khách hàng <span className="text-red-500">*</span></Label>
              <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="c-phone">Số điện thoại <span className="text-red-500">*</span></Label>
                <Input id="c-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0912345678" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">Email <span className="text-red-500">*</span></Label>
                <Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-addr">Địa chỉ <span className="text-red-500">*</span></Label>
              <Input id="c-addr" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="c-tax">Mã số thuế</Label>
                <Input id="c-tax" value={form.taxCode} onChange={(e) => setForm({ ...form, taxCode: e.target.value })} />
              </div>
              {editing && (
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as 'active' | 'inactive' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-[#1E88E5] hover:bg-[#1976D2]" disabled={create.isPending || update.isPending}>
                {editing ? 'Lưu thay đổi' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
