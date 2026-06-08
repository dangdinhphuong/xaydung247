import { BadRequestException } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

describe('InvoicesService - logic nghiệp vụ', () => {
  function makeService(opts: {
    autoTax?: boolean;
    defaultTaxRate?: number;
    products?: Record<string, any>;
  }) {
    const productMap = new Map<string, any>(
      Object.entries(opts.products ?? {}),
    );
    const products = {
      ensureManyActive: jest.fn(async () => productMap),
    };
    const settings = {
      get: jest.fn(async () => ({
        autoTax: opts.autoTax ?? true,
        defaultTaxRate: opts.defaultTaxRate ?? 10,
      })),
    };
    return new InvoicesService(
      null as any,
      null as any,
      null as any,
      products as any,
      settings as any,
      null as any,
    );
  }

  describe('calculateStatus (F-9)', () => {
    const svc = makeService({});
    it('void luôn ưu tiên', () => {
      expect(svc.calculateStatus(100, 100, false, true)).toBe('void');
    });
    it('draft khi isDraft', () => {
      expect(svc.calculateStatus(100, 0, true, false)).toBe('draft');
    });
    it('unpaid khi chưa trả', () => {
      expect(svc.calculateStatus(100, 0, false, false)).toBe('unpaid');
    });
    it('partial khi trả một phần', () => {
      expect(svc.calculateStatus(100, 40, false, false)).toBe('partial');
    });
    it('paid khi trả đủ', () => {
      expect(svc.calculateStatus(100, 100, false, false)).toBe('paid');
    });
  });

  describe('computeTotals (F-1..F-4)', () => {
    const P = '507f1f77bcf86cd799439011';
    const product = { _id: P, name: 'Xi măng', unit: 'bao' };

    it('tính lineTotal, subtotal, tax tự động và total', async () => {
      const svc = makeService({
        autoTax: true,
        defaultTaxRate: 10,
        products: { [P]: product },
      });
      const r = await svc.computeTotals(
        [{ productId: P, quantity: 10, unitPrice: 95000, discount: 0 }],
        50000, // invoice discount
        undefined, // requestedTax → auto
        20000, // shipping
      );
      expect(r.subtotal).toBe(950000);
      // taxBase = 950000 - 50000 = 900000; tax = 10% = 90000
      expect(r.tax).toBe(90000);
      // total = 950000 - 50000 + 90000 + 20000
      expect(r.total).toBe(1010000);
    });

    it('dùng tax do client cung cấp khi có', async () => {
      const svc = makeService({ products: { [P]: product } });
      const r = await svc.computeTotals(
        [{ productId: P, quantity: 1, unitPrice: 100000, discount: 0 }],
        0,
        7777, // requested tax
        0,
      );
      expect(r.tax).toBe(7777);
      expect(r.total).toBe(107777);
    });

    it('ném V-CI-08 khi line discount vượt thành tiền', async () => {
      const svc = makeService({ products: { [P]: product } });
      await expect(
        svc.computeTotals(
          [{ productId: P, quantity: 1, unitPrice: 100000, discount: 200000 }],
          0,
          undefined,
          0,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('ném V-CI-06 khi invoice discount vượt subtotal', async () => {
      const svc = makeService({ products: { [P]: product } });
      await expect(
        svc.computeTotals(
          [{ productId: P, quantity: 1, unitPrice: 100000, discount: 0 }],
          200000,
          undefined,
          0,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
