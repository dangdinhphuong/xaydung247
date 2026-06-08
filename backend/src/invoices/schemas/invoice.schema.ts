import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InvoiceStatus = 'draft' | 'unpaid' | 'partial' | 'paid' | 'void';

@Schema({ _id: true })
export class InvoiceItem {
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId?: Types.ObjectId;

  @Prop({ type: String, required: true })
  productName: string;

  @Prop({ type: String, required: true })
  unit: string;

  @Prop({ type: Number, required: true, min: 0 })
  quantity: number;

  @Prop({ type: Number, required: true, min: 0 })
  unitPrice: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  discount: number;

  @Prop({ type: Number, required: true, min: 0 })
  lineTotal: number;
}
export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);

@Schema({ _id: false })
export class CustomerSnapshot {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String })
  taxCode?: string;
}
export const CustomerSnapshotSchema =
  SchemaFactory.createForClass(CustomerSnapshot);

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ collection: 'invoices', timestamps: true })
export class Invoice {
  @Prop({ type: String, default: null })
  invoiceNumber?: string | null;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: CustomerSnapshotSchema, required: true })
  customerSnapshot: CustomerSnapshot;

  @Prop({ type: Date, required: true })
  issueDate: Date;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({
    type: String,
    required: true,
    enum: ['draft', 'unpaid', 'partial', 'paid', 'void'],
  })
  status: InvoiceStatus;

  @Prop({ type: [InvoiceItemSchema], required: true })
  items: InvoiceItem[];

  @Prop({ type: Number, required: true, min: 0 })
  subtotal: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  discount: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  tax: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  shipping: number;

  @Prop({ type: Number, required: true, min: 0 })
  total: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  paidAmount: number;

  @Prop({ type: Number, required: true, min: 0 })
  remainingBalance: number;

  @Prop({ type: String, maxlength: 1000 })
  notes?: string;

  @Prop({ type: String })
  voidReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
InvoiceSchema.index({ invoiceNumber: 1 }, { unique: true, sparse: true });
InvoiceSchema.index({ deletedAt: 1, status: 1, createdAt: -1 });
InvoiceSchema.index({ customerId: 1, status: 1, deletedAt: 1 });
InvoiceSchema.index({ createdBy: 1 });
