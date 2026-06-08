import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { escapeRegex } from '../common/utils/regex.util';
import { Invoice, InvoiceDocument } from '../invoices/schemas/invoice.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<ProductDocument>,
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
  ) {}

  async findById(id: string): Promise<ProductDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.model.findOne({ _id: id, deletedAt: null });
  }

  async list(query: { search?: string; category?: string; status?: string }) {
    const filter: FilterQuery<ProductDocument> = { deletedAt: null };
    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.search) {
      const r = escapeRegex(query.search);
      filter.$or = [
        { name: { $regex: r, $options: 'i' } },
        { category: { $regex: r, $options: 'i' } },
      ];
    }
    const products = await this.model.find(filter).sort({ name: 1 }).lean();
    return {
      data: products,
      page: { page: 1, size: products.length, total: products.length },
    };
  }

  async listCategories(): Promise<string[]> {
    return this.model.distinct('category', { deletedAt: null });
  }

  async get(id: string): Promise<ProductDocument> {
    const p = await this.findById(id);
    if (!p) throw new NotFoundException({ code: 'NOT_FOUND' });
    return p;
  }

  private async generateCode(): Promise<string> {
    const count = await this.model.estimatedDocumentCount();
    return `PROD${String(count + 1).padStart(5, '0')}`;
  }

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    const code = await this.generateCode();
    return this.model.create({ ...dto, code, status: dto.status ?? 'active' });
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const p = await this.findById(id);
    if (!p) throw new NotFoundException({ code: 'NOT_FOUND' });
    Object.assign(p, dto);
    await p.save();
    return p;
  }

  async remove(id: string): Promise<void> {
    const p = await this.findById(id);
    if (!p) throw new NotFoundException({ code: 'NOT_FOUND' });
    const inUse = await this.invoiceModel.exists({
      'items.productId': new Types.ObjectId(id),
      deletedAt: null,
    });
    if (inUse) {
      throw new UnprocessableEntityException({
        code: 'DOMAIN-PRODUCT-IN-USE',
        message:
          'Không thể xoá sản phẩm đang được dùng trong hoá đơn. Hãy đặt trạng thái ngừng hoạt động.',
      });
    }
    p.deletedAt = new Date();
    await p.save();
  }

  /** Tải nhiều sản phẩm đang hoạt động cho line items hoá đơn/báo giá */
  async ensureManyActive(ids: string[]): Promise<Map<string, ProductDocument>> {
    const unique = Array.from(new Set(ids));
    const valid = unique.filter((id) => Types.ObjectId.isValid(id));
    if (valid.length !== unique.length) {
      throw new UnprocessableEntityException({
        code: 'V-CI-03',
        message: 'Sản phẩm không hợp lệ',
      });
    }
    const products = await this.model.find({
      _id: { $in: valid },
      deletedAt: null,
    });
    const map = new Map<string, ProductDocument>();
    for (const p of products) map.set(p._id.toString(), p);
    for (const id of unique) {
      const p = map.get(id);
      if (!p) {
        throw new UnprocessableEntityException({
          code: 'V-CI-03',
          message: `Sản phẩm không tồn tại: ${id}`,
        });
      }
      if (p.status === 'inactive') {
        throw new UnprocessableEntityException({
          code: 'DOMAIN-PRODUCT-INACTIVE',
          message: `Sản phẩm đã ngừng hoạt động: ${p.name}`,
        });
      }
    }
    return map;
  }
}
