import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'other';
export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ collection: 'payments', timestamps: { createdAt: true, updatedAt: false } })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Invoice', required: true, index: true })
  invoiceId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0.01 })
  amount: number;

  @Prop({ type: Date, required: true })
  paymentDate: Date;

  @Prop({
    type: String,
    required: true,
    enum: ['cash', 'bank_transfer', 'check', 'other'],
  })
  method: PaymentMethod;

  @Prop({ type: String })
  reference?: string;

  @Prop({ type: String, maxlength: 500 })
  note?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ invoiceId: 1, paymentDate: -1 });
PaymentSchema.index({ paymentDate: -1 });
