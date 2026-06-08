import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { todayVn } from '../common/utils/date.util';
import { attachIsOverdueMany } from '../common/utils/invoice.util';
import { Invoice, InvoiceDocument } from '../invoices/schemas/invoice.schema';
import { Payment, PaymentDocument } from '../invoices/schemas/payment.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async summary() {
    const today = todayVn();
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );
    const startOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );

    // 1. Doanh thu tháng = tổng payment trong tháng hiện tại
    const monthlyPayments = await this.paymentModel
      .find({ paymentDate: { $gte: startOfMonth, $lt: startOfNextMonth } })
      .lean();
    const monthlyRevenue = monthlyPayments.reduce((s, p) => s + p.amount, 0);

    // 2/3. Tổng công nợ + số hoá đơn chưa thanh toán
    const openInvoices = await this.invoiceModel
      .find({ status: { $in: ['unpaid', 'partial'] }, deletedAt: null })
      .lean();
    const totalDebt = openInvoices.reduce(
      (s, i) => s + (i.remainingBalance || 0),
      0,
    );
    const unpaidCount = openInvoices.length;

    // 4. Số hoá đơn quá hạn (derived isOverdue)
    const todayStart = today.getTime();
    const overdueCount = openInvoices.filter(
      (i) =>
        (i.remainingBalance || 0) > 0 &&
        new Date(i.dueDate).getTime() < todayStart,
    ).length;

    // 5. 5 hoá đơn gần nhất
    const recent = await this.invoiceModel
      .find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const recentInvoices = attachIsOverdueMany(recent as any);

    return {
      monthlyRevenue,
      totalDebt,
      unpaidCount,
      overdueCount,
      recentInvoices,
    };
  }
}
