import { todayVn } from './date.util';

/**
 * F-8: isOverdue = (status ∈ {unpaid, partial}) AND remainingBalance > 0 AND dueDate < today.
 * Dẫn xuất ở thời điểm đọc, không lưu DB. So sánh "<" nghiêm ngặt (đến hạn hôm nay chưa quá hạn).
 */
export function attachIsOverdueOne<
  T extends { status: string; remainingBalance: number; dueDate: Date | string },
>(invoice: T, today: Date = todayVn()): T & { isOverdue: boolean } {
  const isOverdue =
    (invoice.status === 'unpaid' || invoice.status === 'partial') &&
    invoice.remainingBalance > 0 &&
    new Date(invoice.dueDate) < today;
  return { ...invoice, isOverdue };
}

export function attachIsOverdueMany<
  T extends { status: string; remainingBalance: number; dueDate: Date | string },
>(invoices: T[]): Array<T & { isOverdue: boolean }> {
  const today = todayVn();
  return invoices.map((i) => attachIsOverdueOne(i, today));
}
