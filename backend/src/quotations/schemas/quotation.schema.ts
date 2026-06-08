import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  CustomerSnapshot,
  CustomerSnapshotSchema,
  InvoiceItem,
  InvoiceItemSchema,
} from '../../invoices/schemas/invoice.schema';

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected';
export type QuotationDocument = HydratedDocument<Quotation>;

@Schema({ collection: 'quotations', timestamps: true })
export class Quotation {
  @Prop({ type: String, default: null })
  quotationNumber?: string | null;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: CustomerSnapshotSchema, required: true })
  customerSnapshot: CustomerSnapshot;

  @Prop({ type: Date, required: true })
  issueDate: Date;

  @Prop({ type: Date, required: true })
  validUntil: Date;

  @Prop({
    type: String,
    required: true,
    enum: ['draft', 'sent', 'accepted', 'rejected'],
  })
  status: QuotationStatus;

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

  @Prop({ type: String, maxlength: 1000 })
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'Invoice', default: null })
  convertedInvoiceId?: Types.ObjectId | null;

  @Prop({ type: String })
  rejectReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
QuotationSchema.index({ quotationNumber: 1 }, { unique: true, sparse: true });
QuotationSchema.index({ deletedAt: 1, status: 1, createdAt: -1 });
QuotationSchema.index({ customerId: 1, status: 1, deletedAt: 1 });
