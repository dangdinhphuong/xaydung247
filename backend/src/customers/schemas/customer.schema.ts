import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ collection: 'customers', timestamps: true })
export class Customer {
  @Prop({ type: String, required: true, unique: true, index: true })
  code: string;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  phone: string;

  @Prop({ type: String, required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  address: string;

  @Prop({ type: String, trim: true })
  taxCode?: string;

  @Prop({
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ deletedAt: 1, status: 1, name: 1 });
CustomerSchema.index({ phone: 1 });
