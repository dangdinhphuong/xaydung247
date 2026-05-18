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
import { store } from '../data/store';
import { formatCurrency } from '../utils/formatters';
import type { Invoice, InvoiceItem } from '../types';

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
  const customers = store.getCustomers();
  const products = store.getProducts();

  const [customerId, setCustomerId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceFormItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);

  // Add new item row
  const addItem = () => {
    const newItem: InvoiceFormItem = {
      id: `item-${Date.now()}`,
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      lineTotal: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove item
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Update item
  const updateItem = (id: string, field: keyof InvoiceFormItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };

        // Auto-populate product details when product is selected
        if (field === 'productId') {
          const product = products.find(p => p.id === value);
          if (product) {
            updated.productName = product.name;
            updated.unitPrice = product.price;
          }
        }

        // Calculate line total
        const qty = field === 'quantity' ? parseFloat(value) || 0 : updated.quantity;
        const price = field === 'unitPrice' ? parseFloat(value) || 0 : updated.unitPrice;
        const disc = field === 'discount' ? parseFloat(value) || 0 : updated.discount;
        updated.lineTotal = qty * price - disc;

        return updated;
      }
      return item;
    }));
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const total = subtotal - discount + tax + shipping;

  // Handle form submission
  const handleSubmit = (status: 'draft' | 'unpaid') => {
    // Validation
    if (!customerId) {
      toast.error('Vui lòng chọn khách hàng');
      return;
    }

    if (items.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm');
      return;
    }

    const hasInvalidItems = items.some(
      item => !item.productId || item.quantity <= 0 || item.unitPrice <= 0
    );

    if (hasInvalidItems) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm');
      return;
    }

    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
      toast.error('Không tìm thấy thông tin khách hàng');
      return;
    }

    // Generate invoice number
    const invoices = store.getInvoices();
    const lastInvoice = invoices[0];
    let invoiceNumber = 'INV20260001';
    
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.replace('INV', ''));
      invoiceNumber = `INV${(lastNumber + 1).toString().padStart(8, '0')}`;
    }

    // Create invoice object
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      issueDate,
      dueDate,
      status,
      items: items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        lineTotal: item.lineTotal,
      })),
      subtotal,
      discount,
      tax,
      shipping,
      total,
      paidAmount: 0,
      remainingBalance: total,
      notes,
      payments: [],
    };

    // Add to store
    store.addInvoice(newInvoice);

    // Show success message
    if (status === 'draft') {
      toast.success('Lưu nháp hóa đơn thành công!');
    } else {
      toast.success('Tạo hóa đơn thành công!');
    }

    // Navigate to invoice detail
    navigate(`/invoices/${newInvoice.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <FilteredLink to="/invoices">
              <ArrowLeft className="h-5 w-5" />
            </FilteredLink>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tạo hóa đơn mới</h1>
            <p className="mt-1 text-sm text-gray-500">Điền thông tin để tạo hóa đơn</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={items.length === 0}
          >
            Lưu nháp
          </Button>
          <Button
            onClick={() => handleSubmit('unpaid')}
            className="bg-[#1E88E5] hover:bg-[#1976D2]"
            disabled={items.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            Tạo hóa đơn
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Invoice Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer & Date Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer">
                    Khách hàng <span className="text-red-500">*</span>
                  </Label>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Chọn khách hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueDate">
                    Ngày tạo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">
                    Ngày đến hạn <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              {customerId && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">Thông tin khách hàng</p>
                  {(() => {
                    const customer = customers.find(c => c.id === customerId);
                    return customer ? (
                      <div className="mt-2 space-y-1 text-sm text-blue-700">
                        <p>SĐT: {customer.phone}</p>
                        <p>Địa chỉ: {customer.address}</p>
                        {customer.taxCode && <p>Mã số thuế: {customer.taxCode}</p>}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chi tiết sản phẩm</CardTitle>
                <Button onClick={addItem} size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm sản phẩm
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Chưa có sản phẩm nào</p>
                    <Button onClick={addItem} variant="link" className="mt-2">
                      Thêm sản phẩm đầu tiên
                    </Button>
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
                      {items.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Select
                              value={item.productId}
                              onValueChange={(value) => updateItem(item.id, 'productId', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn sản phẩm" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map(product => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name} - {formatCurrency(product.price)}/{product.unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={item.discount}
                              onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(item.lineTotal)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Nhập ghi chú cho hóa đơn..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tổng kết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Giảm giá</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax">Thuế VAT</Label>
                  <Input
                    id="tax"
                    type="number"
                    min="0"
                    value={tax}
                    onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping">Phí vận chuyển</Label>
                  <Input
                    id="shipping"
                    type="number"
                    min="0"
                    value={shipping}
                    onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-[#1E88E5]">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-xs text-yellow-800">
                  <strong>Lưu ý:</strong> Sau khi tạo hóa đơn, bạn có thể thêm thanh toán để ghi nhận các khoản thu từ khách hàng.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}