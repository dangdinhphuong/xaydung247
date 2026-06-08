import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { todayVn } from '../common/utils/date.util';
import { escapeRegex } from '../common/utils/regex.util';
import { Invoice, InvoiceDocument } from '../invoices/schemas/invoice.schema';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly model: Model<CustomerDocument>,
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
  ) {}

  async findById(id: string): Promise<CustomerDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.model.findOne({ _id: id, deletedAt: null });
  }

  async list(query: { search?: string; status?: string }) {
    const filter: FilterQuery<CustomerDocument> = { deletedAt: null };
    if (query.status) filter.status = query.status;
    if (query.search) {
      const r = escapeRegex(query.search);
      filter.$or = [
        { name: { $regex: r, $options: 'i' } },
        { phone: { $regex: r } },
        { email: { $regex: r, $options: 'i' } },
      ];
    }
    const customers = await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();
    return {
      data: customers,
      page: { page: 1, size: customers.length, total: customers.length },
    };
  }

  async get(id: string) {
    const c = await this.findById(id);
    if (!c) throw new NotFoundException({ code: 'NOT_FOUND' });
    const summary = await this.summary(id);
    return { ...c.toObject(), summary };
  }

  /** Tổng hợp: tổng hoá đơn, số hoá đơn còn nợ, công nợ hiện tại */
  private async summary(customerId: string) {
    const cid = new Types.ObjectId(customerId);
    const [totalInvoices, open] = await Promise.all([
      this.invoiceModel.countDocuments({ customerId: cid, deletedAt: null }),
      this.invoiceModel
        .find({
          customerId: cid,
          deletedAt: null,
          status: { $in: ['unpaid', 'partial'] },
        })
        .select('remainingBalance')
        .lean(),
    ]);
    const currentDebt = open.reduce(
      (s, i) => s + (i.remainingBalance || 0),
      0,
    );
    return {
      totalInvoices,
      openInvoicesCount: open.length,
      currentDebt,
    };
  }

  /** F-7: aging buckets công nợ theo số ngày quá hạn */
  async aging(id: string) {
    const c = await this.findById(id);
    if (!c) throw new NotFoundException({ code: 'NOT_FOUND' });
    const cid = new Types.ObjectId(id);
    const open = await this.invoiceModel
      .find({
        customerId: cid,
        deletedAt: null,
        status: { $in: ['unpaid', 'partial'] },
      })
      .select('remainingBalance dueDate')
      .lean();

    const today = todayVn().getTime();
    const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
    let overdueInvoicesCount = 0;
    let totalDebt = 0;
    for (const inv of open) {
      const bal = inv.remainingBalance || 0;
      totalDebt += bal;
      const daysPastDue = Math.floor(
        (today - new Date(inv.dueDate).getTime()) / DAY_MS,
      );
      if (daysPastDue > 0) overdueInvoicesCount++;
      if (daysPastDue <= 30) buckets['0-30'] += bal;
      else if (daysPastDue <= 60) buckets['31-60'] += bal;
      else if (daysPastDue <= 90) buckets['61-90'] += bal;
      else buckets['90+'] += bal;
    }
    return {
      customerId: id,
      totalDebt,
      openInvoicesCount: open.length,
      overdueInvoicesCount,
      aging: buckets,
    };
  }

  private async generateCode(): Promise<string> {
    const count = await this.model.estimatedDocumentCount();
    return `CUST${String(count + 1).padStart(5, '0')}`;
  }

  async create(dto: CreateCustomerDto): Promise<CustomerDocument> {
    const code = await this.generateCode();
    return this.model.create({ ...dto, code, status: dto.status ?? 'active' });
  }

  async update(
    id: string,
    dto: UpdateCustomerDto,
  ): Promise<CustomerDocument> {
    const c = await this.findById(id);
    if (!c) throw new NotFoundException({ code: 'NOT_FOUND' });
    Object.assign(c, dto);
    await c.save();
    return c;
  }

  async remove(id: string): Promise<void> {
    const c = await this.findById(id);
    if (!c) throw new NotFoundException({ code: 'NOT_FOUND' });
    const inUse = await this.invoiceModel.exists({
      customerId: new Types.ObjectId(id),
      deletedAt: null,
    });
    if (inUse) {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-CUSTOMER-IN-USE',
        message: 'Không thể xoá khách hàng đang có hoá đơn',
      });
    }
    c.deletedAt = new Date();
    await c.save();
  }

  /** Dùng khi tạo hoá đơn: đảm bảo khách hàng tồn tại và đang hoạt động */
  async ensureActiveForInvoice(id: string): Promise<CustomerDocument> {
    const c = await this.findById(id);
    if (!c) {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-CUSTOMER-DELETED',
        message: 'Khách hàng đã bị xoá',
      });
    }
    if (c.status === 'inactive') {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-CUSTOMER-INACTIVE',
        message:
          'Khách hàng đã ngừng hoạt động. Kích hoạt lại trước khi tạo hoá đơn.',
      });
    }
    return c;
  }
}
