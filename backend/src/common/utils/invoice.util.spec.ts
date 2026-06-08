import { attachIsOverdueOne } from './invoice.util';

describe('attachIsOverdueOne (F-8)', () => {
  const today = new Date('2026-06-08T00:00:00+07:00');

  it('đánh dấu quá hạn khi unpaid + còn nợ + dueDate < hôm nay', () => {
    const r = attachIsOverdueOne(
      { status: 'unpaid', remainingBalance: 1000, dueDate: '2026-06-01' },
      today,
    );
    expect(r.isOverdue).toBe(true);
  });

  it('không quá hạn khi đến hạn đúng hôm nay (so sánh "<" nghiêm ngặt)', () => {
    const r = attachIsOverdueOne(
      { status: 'unpaid', remainingBalance: 1000, dueDate: '2026-06-08' },
      today,
    );
    expect(r.isOverdue).toBe(false);
  });

  it('không quá hạn khi đã thanh toán đủ (remainingBalance = 0)', () => {
    const r = attachIsOverdueOne(
      { status: 'paid', remainingBalance: 0, dueDate: '2026-01-01' },
      today,
    );
    expect(r.isOverdue).toBe(false);
  });

  it('không quá hạn với hoá đơn nháp', () => {
    const r = attachIsOverdueOne(
      { status: 'draft', remainingBalance: 1000, dueDate: '2026-01-01' },
      today,
    );
    expect(r.isOverdue).toBe(false);
  });

  it('đánh dấu quá hạn cho hoá đơn partial', () => {
    const r = attachIsOverdueOne(
      { status: 'partial', remainingBalance: 500, dueDate: '2026-05-01' },
      today,
    );
    expect(r.isOverdue).toBe(true);
  });
});
