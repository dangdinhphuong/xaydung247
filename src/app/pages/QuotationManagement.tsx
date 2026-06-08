import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Send, Check, X, Copy, FileOutput, Trash2, Files } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '../components/ui/dialog';
import {
  useQuotations, useQuotationMutations, useCustomers, useProducts,
} from '../hooks/queries';
import { useAuth } from '../auth/AuthContext';
import { LoadingState, ErrorState, EmptyState } from '../components/QueryStates';
import { getErrorMessage } from '../lib/errors';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Quotation, QuotationStatus } from '../types';

const statusConfig: Record<QuotationStatus, { label: string; className: string }> = {
  draft: { label: 'Nháp', className: 'bg-gray-100 text-gray-700' },
  sent: { label: 'Đã gửi', className: 'bg-blue-100 text-blue-700' },
  accepted: { label: 'Đã chấp nhận', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Đã từ chối', className: 'bg-red-100 text-red-700' },
};

interface FormItem { id: string; productId: string; quantity: number; unitPrice: number; discount: number; }

export default function QuotationManagement() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canCreate = hasRole('ADMIN', 'ACCOUNTANT', 'SALES');
  const canConvert = hasRole('ADMIN', 'ACCOUNTANT');
  const canDelete = hasRole('ADMIN');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  const params: { search?: string; status?: string } = { search: searchQuery || undefined };
  if (statusFilter !== 'all') params.status = statusFilter;
  const { data, isLoading, isError, error, refetch } = useQuotations(params);
  const m = useQuotationMutations();
  const quotations = data?.data ?? [];

  // Create dialog data
  const customersQuery = useCustomers({ status: 'active' });
  const productsQuery = useProducts({ status: 'active' });
  const customers = customersQuery.data?.data ?? [];
  const products = productsQuery.data?.data ?? [];

  const [customerId, setCustomerId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [items, setItems] = useState<FormItem[]>([]);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setCustomerId(''); setItems([]); setNotes('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setValidUntil(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  };

  const addItem = () => setItems([...items, { id: `i${Date.now()}`, productId: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  const updateItem = (id: string, field: keyof FormItem, value: any) => {
    setItems(items.map((it) => {
      if (it.id !== id) return it;
      const u = { ...it, [field]: value };
      if (field === 'productId') {
        const p = products.find((x) => x.id === value);
        if (p) u.unitPrice = p.price;
      }
      return u;
    }));
  };
  const removeItem = (id: string) => setItems(items.filter((it) => it.id !== id));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return toast.error('Vui lòng chọn khách hàng');
    if (items.length === 0 || items.some((it) => !it.productId)) return toast.error('Vui lòng chọn sản phẩm');
    try {
      await m.create.mutateAsync({
        customerId, issueDate, validUntil, notes: notes || undefined,
        items: items.map((it) => ({ productId: it.productId, quantity: Number(it.quantity) || 0, unitPrice: Number(it.unitPrice) || 0, discount: Number(it.discount) || 0 })),
      });
      toast.success('Tạo báo giá thành công');
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const run = async (fn: Promise<unknown>, ok: string) => {
    try { await fn; toast.success(ok); } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const handleConvert = async (q: Quotation) => {
    try {
      const invoice = await m.convert.mutateAsync(q.id);
      toast.success('Đã chuyển thành hóa đơn');
      navigate(`/invoices/${invoice.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý báo giá</h1>
          <p className="mt-1 text-sm text-gray-500">Tổng cộng {quotations.length} báo giá</p>
        </div>
        {canCreate && (
          <Button className="bg-[#1E88E5] hover:bg-[#1976D2]" onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />Tạo báo giá mới
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Danh sách báo giá</CardTitle>
            <div className="flex flex-wrap gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="sent">Đã gửi</SelectItem>
                  <SelectItem value="accepted">Đã chấp nhận</SelectItem>
                  <SelectItem value="rejected">Đã từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState label="Đang tải báo giá..." />
          ) : isError ? (
            <ErrorState error={error} onRetry={() => refetch()} />
          ) : quotations.length === 0 ? (
            <EmptyState message="Không tìm thấy báo giá nào" icon={Files} />
          ) : (
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
                {quotations.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium text-[#1E88E5]">{q.quotationNumber ?? '(Nháp)'}</TableCell>
                    <TableCell>{q.customerName}</TableCell>
                    <TableCell>{formatDate(q.issueDate)}</TableCell>
                    <TableCell>{formatDate(q.validUntil)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(q.total)}</TableCell>
                    <TableCell>
                      {q.isExpired ? (
                        <Badge className="bg-orange-100 text-orange-700">Hết hạn</Badge>
                      ) : (
                        <Badge className={statusConfig[q.status].className}>{statusConfig[q.status].label}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {q.status === 'draft' && canCreate && (
                          <Button variant="ghost" size="sm" title="Gửi" onClick={() => run(m.send.mutateAsync(q.id), 'Đã gửi báo giá')}>
                            <Send className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        {q.status === 'sent' && canCreate && (
                          <>
                            <Button variant="ghost" size="sm" title="Chấp nhận" onClick={() => run(m.accept.mutateAsync(q.id), 'Đã chấp nhận')}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Từ chối" onClick={() => {
                              const reason = window.prompt('Lý do từ chối:'); if (reason) run(m.reject.mutateAsync({ id: q.id, reason }), 'Đã từ chối');
                            }}>
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {q.status === 'accepted' && !q.convertedInvoiceId && canConvert && (
                          <Button variant="ghost" size="sm" title="Chuyển thành hóa đơn" onClick={() => handleConvert(q)}>
                            <FileOutput className="h-4 w-4 text-[#1E88E5]" />
                          </Button>
                        )}
                        {canCreate && (
                          <Button variant="ghost" size="sm" title="Nhân bản" onClick={() => run(m.clone.mutateAsync(q.id), 'Đã nhân bản báo giá')}>
                            <Copy className="h-4 w-4 text-gray-500" />
                          </Button>
                        )}
                        {q.status === 'draft' && canDelete && (
                          <Button variant="ghost" size="sm" title="Xóa" onClick={() => {
                            if (window.confirm('Xóa báo giá này?')) run(m.remove.mutateAsync(q.id), 'Đã xóa báo giá');
                          }}>
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

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Tạo báo giá mới</DialogTitle>
            <DialogDescription>Báo giá được tạo ở trạng thái nháp, sau đó có thể gửi cho khách.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-2">
                <Label>Khách hàng <span className="text-red-500">*</span></Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger><SelectValue placeholder="Chọn khách hàng" /></SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Ngày báo giá</Label><Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>Hiệu lực đến</Label><Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} /></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Sản phẩm</Label>
                <Button type="button" size="sm" variant="outline" onClick={addItem}><Plus className="mr-1 h-4 w-4" />Thêm</Button>
              </div>
              {items.map((it) => (
                <div key={it.id} className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-5">
                    <Select value={it.productId} onValueChange={(v) => updateItem(it.id, 'productId', v)}>
                      <SelectTrigger><SelectValue placeholder="Sản phẩm" /></SelectTrigger>
                      <SelectContent>
                        {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input className="col-span-2" type="number" min="1" value={it.quantity} onChange={(e) => updateItem(it.id, 'quantity', e.target.value)} placeholder="SL" />
                  <Input className="col-span-2" type="number" min="0" value={it.unitPrice} onChange={(e) => updateItem(it.id, 'unitPrice', e.target.value)} placeholder="Đơn giá" />
                  <Input className="col-span-2" type="number" min="0" value={it.discount} onChange={(e) => updateItem(it.id, 'discount', e.target.value)} placeholder="Giảm" />
                  <Button type="button" variant="ghost" size="sm" className="col-span-1" onClick={() => removeItem(it.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                </div>
              ))}
            </div>

            <div className="space-y-2"><Label>Ghi chú</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} /></div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-[#1E88E5] hover:bg-[#1976D2]" disabled={m.create.isPending}>Tạo báo giá</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
