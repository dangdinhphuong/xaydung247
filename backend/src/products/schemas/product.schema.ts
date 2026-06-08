import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop({ type: String, required: true, unique: true, index: true })
  code: string;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  category: string;

  @Prop({ type: String, required: true, trim: true })
  unit: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ type: String, trim: true })
  description?: string;

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

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ deletedAt: 1, status: 1, category: 1 });
