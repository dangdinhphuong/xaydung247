import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { AuthUser } from '../common/types';
import { parseVnDate, todayVn } from '../common/utils/date.util';
import {
  attachIsExpiredMany,
  attachIsExpiredOne,
} from '../common/utils/quotation.util';
import { escapeRegex } from '../common/utils/regex.util';
import { CustomersService } from '../customers/customers.service';
import { CountersService } from '../invoices/counters.service';
import { InvoicesService } from '../invoices/invoices.service';
import { SettingsService } from '../settings/settings.service';
import {
  CreateQuotationDto,
  RejectQuotationDto,
  UpdateQuotationDto,
} from './dto/quotation.dto';
import { Quotation, QuotationDocument } from './schemas/quotation.schema';

interface QuotationListQuery {
  search?: string;
  status?: string;
  customerId?: string;
  isExpired?: string;
}

function toYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

@Injectable()
export class QuotationsService {
  private readonly logger = new Logger(QuotationsService.name);

  constructor(
    @InjectModel(Quotation.name)
    private readonly model: Model<QuotationDocument>,
    private readonly customers: CustomersService,
    private readonly settings: SettingsService,
    private readonly counters: CountersService,
    private readonly invoices: InvoicesService,
  ) {}

  private async findById(id: string): Promise<QuotationDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.model.findOne({ _id: id, deletedAt: null });
  }

  private ownershipGuard(q: QuotationDocument, user: AuthUser) {
    if (user.role === 'SALES' && q.createdBy.toString() !== user._id) {
      throw new NotFoundException({ code: 'NOT_FOUND' });
    }
  }

  async list(user: AuthUser, query: QuotationListQuery) {
    const filter: FilterQuery<QuotationDocument> = { deletedAt: null };
    if (query.status) {
      filter.status = { $in: query.status.split(',').map((s) => s.trim()) };
    }
    if (query.customerId && Types.ObjectId.isValid(query.customerId)) {
      filter.customerId = new Types.ObjectId(query.customerId);
    }
    if (query.search) {
      const r = escapeRegex(query.search);
      filter.$or = [
        { quotationNumber: { $regex: r, $options: 'i' } },
        { 'customerSnapshot.name': { $regex: r, $options: 'i' } },
      ];
    }
    if (user.role === 'SALES') {
      filter.createdBy = new Types.ObjectId(user._id);
    }
    const quotations = await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();
    let withFlag = attachIsExpiredMany(quotations as any);
    if (query.isExpired === 'true') {
      withFlag = withFlag.filter((q) => q.isExpired);
    } else if (query.isExpired === 'false') {
      withFlag = withFlag.filter((q) => !q.isExpired);
    }
    return {
      data: withFlag,
      page: { page: 1, size: withFlag.length, total: withFlag.length },
    };
  }

  async get(id: string, user: AuthUser) {
    const q = await this.findById(id);
    if (!q) throw new NotFoundException({ code: 'NOT_FOUND' });
    this.ownershipGuard(q, user);
    return attachIsExpiredOne(q.toObject());
  }

  async create(dto: CreateQuotationDto, user: AuthUser) {
    const customer = await this.customers.ensureActiveForInvoice(dto.customerId);
    const issueDate = parseVnDate(dto.issueDate);
    const validUntil = parseVnDate(dto.validUntil);
    if (validUntil < issueDate) {
      throw new BadRequestException({
        code: 'V-Q-02',
        message: 'Ngày hết hạn phải sau ngày báo giá',
      });
    }
    const computed = await this.invoices.computeTotals(
      dto.items,
      dto.discount ?? 0,
      dto.tax,
      dto.shipping ?? 0,
    );
    const q = await this.model.create({
      quotationNumber: null,
      customerId: customer._id,
      customerSnapshot: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        taxCode: customer.taxCode,
      },
      issueDate,
      validUntil,
      status: 'draft',
      items: computed.itemsWithLineTotal,
      subtotal: computed.subtotal,
      discount: computed.discount,
      tax: computed.tax,
      shipping: computed.shipping,
      total: computed.total,
      notes: dto.notes,
      createdBy: new Types.ObjectId(user._id),
    });
    this.logger.log(`[Quotation.create] id=${q._id} by=${user._id}`);
    return attachIsExpiredOne(q.toObject());
  }

  async update(id: string, dto: UpdateQuotationDto, user: AuthUser) {
    const q = await this.findById(id);
    if (!q) throw new NotFoundException({ code: 'NOT_FOUND' });
    this.ownershipGuard(q, user);
    if (q.status !== 'draft') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-QUOTE-LOCKED',
        message: 'Chỉ có thể sửa báo giá ở trạng thái nháp',
      });
    }
    const itemsChanging =
      dto.items !== undefined ||
      dto.discount !== undefined ||
      dto.tax !== undefined ||
      dto.shipping !== undefined;
    if (itemsChanging) {
      const baseItems =
        dto.items ??
        q.items.map((i) => ({
          productId: i.productId!.toString(),
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discount: i.discount,
        }));
      const computed = await this.invoices.computeTotals(
        baseItems,
        dto.discount ?? q.discount,
        dto.tax !== undefined ? dto.tax : q.tax,
        dto.shipping ?? q.shipping,
      );
      q.items = computed.itemsWithLineTotal as any;
      q.subtotal = computed.subtotal;
      q.discount = computed.discount;
      q.tax = computed.tax;
      q.shipping = computed.shipping;
      q.total = computed.total;
    }
    if (dto.issueDate) q.issueDate = parseVnDate(dto.issueDate);
    if (dto.validUntil) q.validUntil = parseVnDate(dto.validUntil);
    if (q.validUntil < q.issueDate) {
      throw new BadRequestException({ code: 'V-Q-02' });
    }
    if (dto.notes !== undefined) q.notes = dto.notes;
    await q.save();
    return attachIsExpiredOne(q.toObject());
  }

  async send(id: string, user: AuthUser) {
    const q = await this.findById(id);
    if (!q) throw new NotFoundException({ code: 'NOT_FOUND' });
    this.ownershipGuard(q, user);
    if (q.status !== 'draft') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-INVALID-STATE',
        message: 'Chỉ báo giá nháp mới có thể gửi',
      });
    }
    q.quotationNumber = await this.counters.allocateQuotationNumber(
      q.issueDate.getFullYear(),
    );
    q.status = 'sent';
    await q.save();
    this.logger.log(
      `[Quotation.send] id=${q._id} number=${q.quotationNumber} by=${user._id}`,
    );
    return attachIsExpiredOne(q.toObject());
  }

  async accept(id: string, user: AuthUser) {
    const q = await this.findById(id);
    if (!q) throw new NotFoundException({ code: 'NOT_FOUND' });
    this.ownershipGuard(q, user);
    if (q.status !== 'sent') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-INVALID-STATE',
        message: 'Chỉ báo giá đã gửi mới có thể chấp nhận',
      });
    }
    const flagged = attachIsExpiredOne(q.toObject());
    if (flagged.isExpired) {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-QUOTE-EXPIRED',
        message: 'Báo giá đã hết hạn, không thể chấp nhận',
      });
    }
    q.status = 'accepted';
    await q.save();
    return attachIsExpiredOne(q.toObject());
  }

  async reject(id: string, dto: RejectQuotationDto, user: AuthUser) {
    const q = await this.findById(id);
    if (!q) throw new NotFoundException({ code: 'NOT_FOUND' });
    this.ownershipGuard(q, user);
    if (q.status !== 'sent') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-INVALID-STATE',
        message: 'Chỉ báo giá đã gửi mới có thể từ chối',
      });
    }
    q.status = 'rejected';
    q.rejectReason = dto.rejectReason;
    await q.save();
    return attachIsExpiredOne(q.toObject());
  }

  async clone(id: string, user: AuthUser) {
    const q = await this.findById(id);
    if (!q) throw new NotFoundException({ code: 'NOT_FOUND' });
    this.ownershipGuard(q, user);
    const customer = await this.customers.ensureActiveForInvoice(
      q.customerId.toString(),
    );
    const issue = todayVn();
    const valid = todayVn();
    valid.setDate(valid.getDate() + 30);
    const clone = await this.model.create({
      quotationNumber: null,
      customerId: customer._id,
      customerSnapshot: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        taxCode: customer.taxCode,
      },
      issueDate: issue,
      validUntil: valid,
      status: 'draft',
      items: q.items,
      subtotal: q.subtotal,
      discount: q.discount,
      tax: q.tax,
      shipping: q.shipping,
      total: q.total,
      notes: q.notes,
      createdBy: new Types.ObjectId(user._id),
    });
    this.logger.log(`[Quotation.clone] from=${q._id} to=${clone._id}`);
    return attachIsExpiredOne(clone.toObject());
  }

  /** Chuyển báo giá accepted → hoá đơn unpaid (không transaction). */
  async convert(id: string, user: AuthUser) {
    const q = await this.findById(id);
    if (!q) throw new NotFoundException({ code: 'NOT_FOUND' });
    if (q.status !== 'accepted') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-INVALID-STATE',
        message: 'Chỉ báo giá đã chấp nhận mới có thể chuyển thành hoá đơn',
      });
    }
    if (q.convertedInvoiceId) {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-ALREADY-CONVERTED',
        message: 'Báo giá đã được chuyển thành hoá đơn',
      });
    }
    const settings = await this.settings.get();
    const issue = todayVn();
    const due = todayVn();
    due.setDate(due.getDate() + settings.defaultDueDays);

    const invoice = await this.invoices.create(
      {
        customerId: q.customerId.toString(),
        issueDate: toYmd(issue),
        dueDate: toYmd(due),
        items: q.items.map((i) => ({
          productId: i.productId!.toString(),
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discount: i.discount,
        })),
        discount: q.discount,
        tax: q.tax,
        shipping: q.shipping,
        notes: `Từ báo giá ${q.quotationNumber ?? ''}${q.notes ? '\n' + q.notes : ''}`,
        status: 'unpaid',
      },
      user,
    );

    q.convertedInvoiceId = new Types.ObjectId(invoice._id.toString());
    await q.save();
    this.logger.log(
      `[Quotation.convert] quotation=${q._id} invoice=${invoice._id} by=${user._id}`,
    );
    return { invoice };
  }

  async remove(id: string): Promise<void> {
    const q = await this.findById(id);
    if (!q) throw new NotFoundException({ code: 'NOT_FOUND' });
    if (q.status !== 'draft') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-INVALID-STATE',
        message: 'Chỉ báo giá nháp mới có thể xoá',
      });
    }
    q.deletedAt = new Date();
    await q.save();
  }
}
