import type { Invoice } from '../types';

const STATUS_LABEL: Record<string, string> = {
  draft: 'Nháp',
  unpaid: 'Chưa thanh toán',
  partial: 'Thanh toán một phần',
  paid: 'Đã thanh toán',
  void: 'Đã hủy',
};

function csvCell(value: string | number): string {
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Xuất danh sách hóa đơn ra file CSV (mở được bằng Excel), UTF-8 BOM cho tiếng Việt. */
export function exportInvoicesToExcel(invoices: Invoice[]) {
  const headers = [
    'Mã hóa đơn', 'Khách hàng', 'Ngày tạo', 'Ngày đến hạn',
    'Trạng thái', 'Tổng tiền', 'Đã thanh toán', 'Còn lại',
  ];
  const rows = invoices.map((inv) => [
    inv.invoiceNumber ?? '(Nháp)',
    inv.customerName,
    new Date(inv.issueDate).toLocaleDateString('vi-VN'),
    new Date(inv.dueDate).toLocaleDateString('vi-VN'),
    inv.isOverdue && (inv.status === 'unpaid' || inv.status === 'partial')
      ? 'Quá hạn'
      : STATUS_LABEL[inv.status] ?? inv.status,
    inv.total,
    inv.paidAmount,
    inv.remainingBalance,
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map(csvCell).join(','))
    .join('\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `hoa-don-${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
