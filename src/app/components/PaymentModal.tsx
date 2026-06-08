import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import type { PaymentMethod } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payment: {
    amount: number;
    paymentDate: string;
    method: PaymentMethod;
    reference?: string;
    note?: string;
  }) => void;
  maxAmount: number;
}

export function PaymentModal({ open, onClose, onSubmit, maxAmount }: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Số tiền không hợp lệ');
      return;
    }

    if (amountNum > maxAmount) {
      setError(`Số tiền vượt quá số tiền còn lại (${formatCurrency(maxAmount)})`);
      return;
    }

    onSubmit({
      amount: amountNum,
      paymentDate,
      method,
      reference: reference || undefined,
      note: note || undefined,
    });

    // Reset form
    setAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setMethod('cash');
    setReference('');
    setNote('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm thanh toán</DialogTitle>
          <DialogDescription>
            Nhập thông tin thanh toán mới cho hóa đơn này.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">
              Số tiền <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Số tiền còn lại: {formatCurrency(maxAmount)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate">
              Ngày thanh toán <span className="text-red-500">*</span>
            </Label>
            <Input
              id="paymentDate"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">
              Phương thức <span className="text-red-500">*</span>
            </Label>
            <Select value={method} onValueChange={(value) => setMethod(value as PaymentMethod)}>
              <SelectTrigger id="method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tiền mặt</SelectItem>
                <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                <SelectItem value="check">Séc</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(method === 'bank_transfer' || method === 'check') && (
            <div className="space-y-2">
              <Label htmlFor="reference">
                Mã giao dịch <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reference"
                placeholder="TF20260223001"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              placeholder="Nhập ghi chú..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-[#1E88E5] hover:bg-[#1976D2]">
              Xác nhận
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}