import { useState } from 'react';
import { Search, Plus, Edit, Package, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
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
import { useProducts, useCategories, useProductMutations } from '../hooks/queries';
import { useAuth } from '../auth/AuthContext';
import { LoadingState, ErrorState, EmptyState } from '../components/QueryStates';
import { getErrorMessage } from '../lib/errors';
import { formatCurrency } from '../utils/formatters';
import type { Product } from '../types';

interface FormState {
  name: string;
  category: string;
  unit: string;
  price: string;
  stock: string;
  description: string;
  status: 'active' | 'inactive';
}

const emptyForm: FormState = {
  name: '', category: '', unit: '', price: '', stock: '', description: '', status: 'active',
};

export default function ProductManagement() {
  const { hasRole } = useAuth();
  const canManage = hasRole('ADMIN');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const { data, isLoading, isError, error, refetch } = useProducts({
    search: searchQuery || undefined,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
  });
  const categoriesQuery = useCategories();
  const { create, update, remove } = useProductMutations();

  const products = data?.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      unit: p.unit,
      price: String(p.price),
      stock: String(p.stock),
      description: p.description ?? '',
      status: p.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      unit: form.unit.trim(),
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      description: form.description.trim() || undefined,
      status: form.status,
    };
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data: payload });
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await create.mutateAsync(payload);
        toast.success('Thêm sản phẩm thành công');
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    try {
      await remove.mutateAsync(p.id);
      toast.success('Đã xóa sản phẩm');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Mặt hàng</h1>
          <p className="mt-1 text-sm text-gray-500">Tổng cộng {products.length} sản phẩm</p>
        </div>
        {canManage && (
          <Button className="bg-[#1E88E5] hover:bg-[#1976D2]" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <div className="flex flex-wrap gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState label="Đang tải sản phẩm..." />
          ) : isError ? (
            <ErrorState error={error} onRetry={() => refetch()} />
          ) : products.length === 0 ? (
            <EmptyState message="Không tìm thấy sản phẩm" icon={Package} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Tồn kho</TableHead>
                  <TableHead>Mô tả</TableHead>
                  {canManage && <TableHead className="text-right">Thao tác</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-right">
                      <span className={product.stock < 100 ? 'font-medium text-red-600' : 'text-gray-900'}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-gray-600">{product.description}</TableCell>
                    {canManage && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(product)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
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
            <DialogTitle>{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
            <DialogDescription>Nhập thông tin sản phẩm vật liệu xây dựng.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="p-name">Tên sản phẩm <span className="text-red-500">*</span></Label>
              <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="p-cat">Danh mục <span className="text-red-500">*</span></Label>
                <Input id="p-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-unit">Đơn vị <span className="text-red-500">*</span></Label>
                <Input id="p-unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="bao, m³, viên..." required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="p-price">Đơn giá (VND) <span className="text-red-500">*</span></Label>
                <Input id="p-price" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-stock">Tồn kho</Label>
                <Input id="p-stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-desc">Mô tả</Label>
              <Textarea id="p-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            {editing && (
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as 'active' | 'inactive' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
