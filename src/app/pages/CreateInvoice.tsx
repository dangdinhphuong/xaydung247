import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Separator } from '../components/ui/separator';
import { FilteredLink } from '../components/FilteredLink';
import { LoadingState } from '../components/QueryStates';
import { useCustomers, useProducts, useInvoiceMutations } from '../hooks/queries';
import { useAuth } from '../auth/AuthContext';
import { getErrorMessage } from '../lib/errors';
import { formatCurrency } from '../utils/formatters';

interface InvoiceFormItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canIssue = hasRole('ADMIN', 'ACCOUNTANT'); // SALES chỉ được lưu nháp

  const customersQuery = useCustomers({ status: 'active' });
  const productsQuery = useProducts({ status: 'active' });
  const { create } = useInvoiceMutations();

  const customers = customersQuery.data?.data ?? [];
  const products = productsQuery.data?.data ?? [];

  const [customerId, setCustomerId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  );
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceFormItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => {
    setItems([...items, { id: `item-${Date.now()}`, productId: '', productName: '', quantity: 1, unitPrice: 0, discount: 0, lineTotal: 0 }]);
  };
  const removeItem = (id: string) => setItems(items.filter((item) => item.id !== id));
  const updateItem = (id: string, field: keyof InvoiceFormItem, value: any) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'productId') {
        const product = products.find((p) => p.id === value);
        if (product) {
          updated.productName = product.name;
          updated.unitPrice = product.price;
        }
      }
      const qty = field === 'quantity' ? parseFloat(value) || 0 : updated.quantity;
      const price = field === 'unitPrice' ? parseFloat(value) || 0 : updated.unitPrice;
      const disc = field === 'discount' ? parseFloat(value) || 0 : updated.discount;
      updated.lineTotal = qty * price - disc;
      return updated;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const total = subtotal - discount + tax + shipping;

  const handleSubmit = async (status: 'draft' | 'unpaid') => {
    if (!customerId) return toast.error('Vui lòng chọn khách hàng');
    if (items.length === 0) return toast.error('Vui lòng thêm ít nhất một sản phẩm');
    if (items.some((it) => !it.productId || it.quantity <= 0 || it.unitPrice < 0)) {
      return toast.error('Vui lòng điền đầy đủ thông tin sản phẩm');
    }
    setSubmitting(true);
    try {
      const invoice = await create.mutateAsync({
        customerId,
        issueDate,
        dueDate,
        status,
        discount,
        tax,
        shipping,
        notes: notes || undefined,
        items: items.map((it) => ({
          productId: it.productId,
          quantity: Number(it.quantity) || 0,
          unitPrice: Number(it.unitPrice) || 0,
          discount: Number(it.discount) || 0,
        })),
      });
      toast.success(status === 'draft' ? 'Lưu nháp thành công!' : 'Tạo hóa đơn thành công!');
      navigate(`/invoices/${invoice.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (customersQuery.isLoading || productsQuery.isLoading) {
    return <LoadingState label="Đang tải dữ liệu..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <FilteredLink to="/invoices"><ArrowLeft className="h-5 w-5" /></FilteredLink>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tạo hóa đơn mới</h1>
            <p className="mt-1 text-sm text-gray-500">Điền thông tin để tạo hóa đơn</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={items.length === 0 || submitting}>
            Lưu nháp
          </Button>
          {canIssue && (
            <Button onClick={() => handleSubmit('unpaid')} className="bg-[#1E88E5] hover:bg-[#1976D2]" disabled={items.length === 0 || submitting}>
              <Save className="mr-2 h-4 w-4" />
              Tạo & phát hành
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Thông tin chung</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer">Khách hàng <span className="text-red-500">*</span></Label>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger id="customer"><SelectValue placeholder="Chọn khách hàng" /></SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Ngày tạo <span className="text-red-500">*</span></Label>
                  <Input id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Ngày đến hạn <span className="text-red-500">*</span></Label>
                  <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
              </div>
              {customerId && (() => {
                const customer = customers.find((c) => c.id === customerId);
                return customer ? (
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-900">Thông tin khách hàng</p>
                    <div className="mt-2 space-y-1 text-sm text-blue-700">
                      <p>SĐT: {customer.phone}</p>
                      <p>Địa chỉ: {customer.address}</p>
                      {customer.taxCode && <p>Mã số thuế: {customer.taxCode}</p>}
                    </div>
                  </div>
                ) : null;
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chi tiết sản phẩm</CardTitle>
                <Button onClick={addItem} size="sm" variant="outline"><Plus className="mr-2 h-4 w-4" />Thêm sản phẩm</Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Chưa có sản phẩm nào</p>
                    <Button onClick={addItem} variant="link" className="mt-2">Thêm sản phẩm đầu tiên</Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Sản phẩm</TableHead>
                        <TableHead className="w-[100px]">Số lượng</TableHead>
                        <TableHead className="w-[120px]">Đơn giá</TableHead>
                        <TableHead className="w-[120px]">Giảm giá</TableHead>
                        <TableHead className="w-[120px]">Thành tiền</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Select value={item.productId} onValueChange={(value) => updateItem(item.id, 'productId', value)}>
                              <SelectTrigger><SelectValue placeholder="Chọn sản phẩm" /></SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name} - {formatCurrency(product.price)}/{product.unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell><Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} /></TableCell>
                          <TableCell><Input type="number" min="0" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)} /></TableCell>
                          <TableCell><Input type="number" min="0" value={item.discount} onChange={(e) => updateItem(item.id, 'discount', e.target.value)} /></TableCell>
                          <TableCell className="font-medium">{formatCurrency(item.lineTotal)}</TableCell>
                          <TableCell><Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ghi chú</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="Nhập ghi chú cho hóa đơn..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Tổng kết</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Tạm tính</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                <div className="space-y-2"><Label htmlFor="discount">Giảm giá</Label><Input id="discount" type="number" min="0" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} /></div>
                <div className="space-y-2"><Label htmlFor="tax">Thuế VAT</Label><Input id="tax" type="number" min="0" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} /></div>
                <div className="space-y-2"><Label htmlFor="shipping">Phí vận chuyển</Label><Input id="shipping" type="number" min="0" value={shipping} onChange={(e) => setShipping(parseFloat(e.target.value) || 0)} /></div>
                <Separator />
                <div className="flex justify-between text-lg font-bold"><span>Tổng cộng</span><span className="text-[#1E88E5]">{formatCurrency(total)}</span></div>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-xs text-yellow-800">
                  <strong>Lưu ý:</strong> Tổng tiền cuối cùng được máy chủ tính lại theo đơn giá sản phẩm. Sau khi phát hành, bạn có thể ghi nhận thanh toán.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
