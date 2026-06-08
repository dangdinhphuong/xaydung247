import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { SettingsService } from '../settings/settings.service';
import { parseVnDate } from '../common/utils/date.util';
import {
  attachIsOverdueMany,
  attachIsOverdueOne,
} from '../common/utils/invoice.util';
import { AuthUser } from '../common/types';
import { escapeRegex } from '../common/utils/regex.util';
import { CountersService } from './counters.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  VoidInvoiceDto,
} from './dto/invoice.dto';
import {
  Invoice,
  InvoiceDocument,
  InvoiceStatus,
} from './schemas/invoice.schema';
import { Payment, PaymentDocument } from './schemas/payment.schema';

interface ItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface InvoiceListQuery {
  search?: string;
  status?: string;
  customerId?: string;
  from?: string;
  to?: string;
  isOverdue?: string;
}

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    private readonly customers: CustomersService,
    private readonly products: ProductsService,
    private readonly settings: SettingsService,
    private readonly counters: CountersService,
  ) {}

  /** F-1..F-4: tính lineTotal, subtotal, tax (tự động nếu cần), total. Server luôn tính lại. */
  async computeTotals(
    items: ItemInput[],
    invoiceDiscount: number,
    requestedTax: number | undefined,
    shipping: number,
  ) {
    const productMap = await this.products.ensureManyActive(
      items.map((i) => i.productId),
    );
    const itemsWithLineTotal = items.map((i) => {
      const product = productMap.get(i.productId)!;
      const lineTotal = i.quantity * i.unitPrice - i.discount;
      if (lineTotal < 0) {
        throw new BadRequestException({
          code: 'V-CI-08',
          message: `Giảm giá dòng "${product.name}" vượt quá thành tiền`,
        });
      }
      return {
        productId: product._id,
        productName: product.name,
        unit: product.unit,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discount: i.discount,
        lineTotal,
      };
    });
    const subtotal = itemsWithLineTotal.reduce((s, i) => s + i.lineTotal, 0);
    if (invoiceDiscount > subtotal) {
      throw new BadRequestException({
        code: 'V-CI-06',
        message: 'Giảm giá vượt quá tạm tính',
      });
    }
    const settings = await this.settings.get();
    let tax: number;
    if (requestedTax !== undefined && requestedTax !== null) {
      tax = requestedTax;
    } else if (settings.autoTax) {
      const taxBase = subtotal - invoiceDiscount;
      tax = Math.round((taxBase * settings.defaultTaxRate) / 100);
    } else {
      tax = 0;
    }
    const total = subtotal - invoiceDiscount + tax + shipping;
    return {
      itemsWithLineTotal,
      subtotal,
      discount: invoiceDiscount,
      tax,
      shipping,
      total,
    };
  }

  /** F-9: xác định trạng thái từ số tiền đã trả */
  calculateStatus(
    total: number,
    paidAmount: number,
    isDraft: boolean,
    isVoid: boolean,
  ): InvoiceStatus {
    if (isVoid) return 'void';
    if (isDraft) return 'draft';
    if (paidAmount === 0) return 'unpaid';
    if (paidAmount < total) return 'partial';
    return 'paid';
  }

  async findById(id: string): Promise<InvoiceDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.invoiceModel.findOne({ _id: id, deletedAt: null });
  }

  async getById(id: string, user: AuthUser) {
    const invoice = await this.findById(id);
    if (!invoice) throw new NotFoundException({ code: 'NOT_FOUND' });
    if (user.role === 'SALES' && invoice.createdBy.toString() !== user._id) {
      throw new NotFoundException({ code: 'NOT_FOUND' });
    }
    return attachIsOverdueOne(invoice.toObject());
  }

  async getWithPayments(id: string, user: AuthUser) {
    const invoice = await this.getById(id, user);
    const payments = await this.paymentModel
      .find({ invoiceId: invoice._id })
      .sort({ paymentDate: -1, createdAt: -1 })
      .lean();
    return { ...invoice, payments };
  }

  async list(user: AuthUser, query: InvoiceListQuery) {
    const filter: FilterQuery<InvoiceDocument> = { deletedAt: null };
    if (query.status) {
      filter.status = { $in: query.status.split(',').map((s) => s.trim()) };
    }
    if (query.customerId && Types.ObjectId.isValid(query.customerId)) {
      filter.customerId = new Types.ObjectId(query.customerId);
    }
    if (query.search) {
      const r = escapeRegex(query.search);
      filter.$or = [
        { invoiceNumber: { $regex: r, $options: 'i' } },
        { 'customerSnapshot.name': { $regex: r, $options: 'i' } },
      ];
    }
    if (query.from || query.to) {
      filter.issueDate = {};
      if (query.from) filter.issueDate.$gte = parseVnDate(query.from);
      if (query.to) filter.issueDate.$lte = parseVnDate(query.to);
    }
    if (user.role === 'SALES') {
      filter.createdBy = new Types.ObjectId(user._id);
    }
    const invoices = await this.invoiceModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();
    let withFlag = attachIsOverdueMany(invoices as any);
    if (query.isOverdue === 'true') {
      withFlag = withFlag.filter((i) => i.isOverdue);
    } else if (query.isOverdue === 'false') {
      withFlag = withFlag.filter((i) => !i.isOverdue);
    }
    return {
      data: withFlag,
      page: { page: 1, size: withFlag.length, total: withFlag.length },
    };
  }

  async create(dto: CreateInvoiceDto, user: AuthUser) {
    if (dto.status === 'unpaid' && user.role === 'SALES') {
      throw new BadRequestException({
        code: 'AUTH-FORBIDDEN',
        message: 'Bạn không có quyền phát hành hoá đơn trực tiếp',
      });
    }
    const customer = await this.customers.ensureActiveForInvoice(dto.customerId);
    const issueDate = parseVnDate(dto.issueDate);
    const dueDate = parseVnDate(dto.dueDate);
    if (dueDate < issueDate) {
      throw new BadRequestException({
        code: 'V-CI-05',
        message: 'Ngày đến hạn phải sau ngày tạo',
      });
    }
    const computed = await this.computeTotals(
      dto.items,
      dto.discount ?? 0,
      dto.tax,
      dto.shipping ?? 0,
    );
    const isDraft = dto.status === 'draft';
    const invoiceNumber = isDraft
      ? null
      : await this.counters.allocateInvoiceNumber(issueDate.getFullYear());
    const invoice = await this.invoiceModel.create({
      invoiceNumber,
      customerId: customer._id,
      customerSnapshot: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        taxCode: customer.taxCode,
      },
      issueDate,
      dueDate,
      status: isDraft ? 'draft' : 'unpaid',
      items: computed.itemsWithLineTotal,
      subtotal: computed.subtotal,
      discount: computed.discount,
      tax: computed.tax,
      shipping: computed.shipping,
      total: computed.total,
      paidAmount: 0,
      remainingBalance: computed.total,
      notes: dto.notes,
      createdBy: new Types.ObjectId(user._id),
    });
    this.logger.log(
      `[Invoice.create] id=${invoice._id} number=${invoice.invoiceNumber ?? '(draft)'} total=${invoice.total} by=${user._id}`,
    );
    return attachIsOverdueOne(invoice.toObject());
  }

  async update(id: string, dto: UpdateInvoiceDto, user: AuthUser) {
    const invoice = await this.findById(id);
    if (!invoice) throw new NotFoundException({ code: 'NOT_FOUND' });

    if (user.role === 'SALES') {
      if (invoice.createdBy.toString() !== user._id) {
        throw new NotFoundException({ code: 'NOT_FOUND' });
      }
      if (invoice.status !== 'draft') {
        throw new UnprocessableEntityException({
          code: 'DOMAIN-LINES-LOCKED',
          message: 'Không thể sửa hoá đơn đã phát hành',
        });
      }
    }

    const itemsChanging =
      dto.items !== undefined ||
      dto.discount !== undefined ||
      dto.tax !== undefined ||
      dto.shipping !== undefined;

    if (itemsChanging && invoice.status !== 'draft') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-LINES-LOCKED',
        message: 'Không thể sửa sản phẩm/tổng khi hoá đơn đã phát hành',
      });
    }
    if (invoice.status === 'void' || invoice.status === 'paid') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-INVALID-STATE',
        message: 'Hoá đơn ở trạng thái này không thể sửa',
      });
    }

    if (itemsChanging) {
      const baseItems: ItemInput[] =
        dto.items ??
        invoice.items.map((i) => ({
          productId: i.productId!.toString(),
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discount: i.discount,
        }));
      const computed = await this.computeTotals(
        baseItems,
        dto.discount ?? invoice.discount,
        dto.tax !== undefined ? dto.tax : invoice.tax,
        dto.shipping ?? invoice.shipping,
      );
      invoice.items = computed.itemsWithLineTotal as any;
      invoice.subtotal = computed.subtotal;
      invoice.discount = computed.discount;
      invoice.tax = computed.tax;
      invoice.shipping = computed.shipping;
      invoice.total = computed.total;
      invoice.remainingBalance = computed.total - invoice.paidAmount;
    }

    if (dto.issueDate) {
      const d = parseVnDate(dto.issueDate);
      const due = dto.dueDate ? parseVnDate(dto.dueDate) : invoice.dueDate;
      if (due < d) throw new BadRequestException({ code: 'V-CI-05' });
      invoice.issueDate = d;
    }
    if (dto.dueDate) {
      const due = parseVnDate(dto.dueDate);
      if (due < invoice.issueDate) {
        throw new BadRequestException({ code: 'V-CI-05' });
      }
      invoice.dueDate = due;
    }
    if (dto.notes !== undefined) invoice.notes = dto.notes;

    await invoice.save();
    this.logger.log(`[Invoice.update] id=${invoice._id} by=${user._id}`);
    return attachIsOverdueOne(invoice.toObject());
  }

  async finalize(id: string, user: AuthUser) {
    const invoice = await this.findById(id);
    if (!invoice) throw new NotFoundException({ code: 'NOT_FOUND' });
    if (invoice.status !== 'draft') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-INVALID-STATE',
        message: 'Chỉ hoá đơn nháp mới có thể phát hành',
      });
    }
    invoice.invoiceNumber = await this.counters.allocateInvoiceNumber(
      invoice.issueDate.getFullYear(),
    );
    invoice.status = 'unpaid';
    await invoice.save();
    this.logger.log(
      `[Invoice.finalize] id=${invoice._id} number=${invoice.invoiceNumber} by=${user._id}`,
    );
    return attachIsOverdueOne(invoice.toObject());
  }

  async void(id: string, dto: VoidInvoiceDto, user: AuthUser) {
    const invoice = await this.findById(id);
    if (!invoice) throw new NotFoundException({ code: 'NOT_FOUND' });
    if (invoice.status === 'paid') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-INVALID-STATE',
        message: 'Hoá đơn đã thanh toán đủ không thể huỷ',
      });
    }
    if (invoice.status === 'void') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-INVALID-STATE',
        message: 'Hoá đơn đã huỷ',
      });
    }
    invoice.status = 'void';
    invoice.remainingBalance = 0;
    invoice.voidReason = dto.voidReason;
    await invoice.save();
    this.logger.warn(
      `[Invoice.void] id=${invoice._id} reason="${dto.voidReason}" by=${user._id}`,
    );
    return attachIsOverdueOne(invoice.toObject());
  }

  async remove(id: string, user: AuthUser): Promise<void> {
    const invoice = await this.findById(id);
    if (!invoice) throw new NotFoundException({ code: 'NOT_FOUND' });
    if (invoice.status !== 'draft' && invoice.status !== 'void') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-INVALID-STATE',
        message: 'Chỉ hoá đơn nháp hoặc đã huỷ mới có thể xoá',
      });
    }
    invoice.deletedAt = new Date();
    await invoice.save();
    this.logger.warn(`[Invoice.delete] id=${invoice._id} by=${user._id}`);
  }
}
