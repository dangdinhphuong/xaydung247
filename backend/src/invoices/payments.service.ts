import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthUser } from '../common/types';
import { parseVnDate, todayVn } from '../common/utils/date.util';
import { attachIsOverdueOne } from '../common/utils/invoice.util';
import { AddPaymentDto } from './dto/payment.dto';
import {
  Invoice,
  InvoiceDocument,
  InvoiceStatus,
} from './schemas/invoice.schema';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  private calculateStatus(total: number, paidAmount: number): InvoiceStatus {
    if (paidAmount === 0) return 'unpaid';
    if (paidAmount < total) return 'partial';
    return 'paid';
  }

  async list(invoiceId: string, user: AuthUser) {
    if (!Types.ObjectId.isValid(invoiceId)) {
      throw new NotFoundException({ code: 'NOT_FOUND' });
    }
    const invoice = await this.invoiceModel.findOne({
      _id: invoiceId,
      deletedAt: null,
    });
    if (!invoice) throw new NotFoundException({ code: 'NOT_FOUND' });
    if (user.role === 'SALES' && invoice.createdBy.toString() !== user._id) {
      throw new NotFoundException({ code: 'NOT_FOUND' });
    }
    const payments = await this.paymentModel
      .find({ invoiceId: invoice._id })
      .sort({ paymentDate: -1, createdAt: -1 })
      .lean();
    return { data: payments };
  }

  /** H-4: ghi nhận thanh toán, tính lại paidAmount từ DB, guard chống vượt total (race). */
  async addPayment(invoiceId: string, dto: AddPaymentDto, user: AuthUser) {
    if (!Types.ObjectId.isValid(invoiceId)) {
      throw new NotFoundException({ code: 'NOT_FOUND' });
    }
    const invoice = await this.invoiceModel.findOne({
      _id: invoiceId,
      deletedAt: null,
    });
    if (!invoice) throw new NotFoundException({ code: 'NOT_FOUND' });

    if (invoice.status === 'draft') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-DRAFT-PAYMENT',
        message: 'Không thể thanh toán hoá đơn nháp',
      });
    }
    if (invoice.status === 'void') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-VOID-PAYMENT',
        message: 'Không thể thanh toán hoá đơn đã huỷ',
      });
    }
    if (invoice.remainingBalance === 0) {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-PAID-PAYMENT',
        message: 'Hoá đơn đã được thanh toán đủ',
      });
    }
    if (dto.amount > invoice.remainingBalance) {
      throw new BadRequestException({
        code: 'V-PAY-02',
        message: `Số tiền vượt quá số tiền còn lại (${invoice.remainingBalance})`,
      });
    }
    const paymentDate = parseVnDate(dto.paymentDate);
    const tomorrow = todayVn();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (paymentDate > tomorrow) {
      throw new BadRequestException({
        code: 'V-PAY-03',
        message: 'Ngày thanh toán không hợp lệ (không được quá ngày mai)',
      });
    }

    const payment = await this.paymentModel.create({
      invoiceId: invoice._id,
      amount: dto.amount,
      paymentDate,
      method: dto.method,
      reference: dto.reference,
      note: dto.note,
      createdBy: new Types.ObjectId(user._id),
    });

    // Tính lại từ DB (không dùng bộ nhớ) — guard race condition.
    const allPayments = await this.paymentModel
      .find({ invoiceId: invoice._id })
      .lean();
    const paidAmount = allPayments.reduce((s, p) => s + p.amount, 0);
    if (paidAmount > invoice.total) {
      this.logger.warn(
        `[Payment.race] invoice=${invoice._id} number=${invoice.invoiceNumber} ` +
          `total=${invoice.total} paid=${paidAmount} paymentJustInserted=${payment._id} ` +
          `amount=${dto.amount}. Admin cần xoá payment dư hoặc void invoice + tạo lại.`,
      );
      throw new UnprocessableEntityException({
        code: 'DOMAIN-PAID-EXCEEDS-TOTAL',
        message:
          'Tổng thanh toán vượt quá tổng hoá đơn (race condition). Vui lòng tải lại và thử lại.',
      });
    }

    invoice.paidAmount = paidAmount;
    invoice.remainingBalance = invoice.total - paidAmount;
    invoice.status = this.calculateStatus(invoice.total, paidAmount);
    await invoice.save();
    this.logger.log(
      `[Payment.create] id=${payment._id} invoice=${invoice.invoiceNumber} ` +
        `amount=${dto.amount} newStatus=${invoice.status} by=${user._id}`,
    );

    return {
      payment,
      invoice: attachIsOverdueOne(invoice.toObject()),
    };
  }
}
