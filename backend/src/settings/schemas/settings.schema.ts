import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ collection: 'settings', timestamps: true })
export class Settings {
  @Prop({ type: String, required: true })
  companyName: string;

  @Prop({ type: String, default: '' })
  companyTaxCode: string;

  @Prop({ type: String, default: '' })
  companyAddress: string;

  @Prop({ type: String, default: '' })
  companyPhone: string;

  @Prop({ type: String, default: '' })
  companyEmail: string;

  @Prop({ type: String, required: true, default: 'HD-' })
  invoicePrefix: string;

  @Prop({ type: String, required: true, default: 'BG-' })
  quotationPrefix: string;

  @Prop({ type: Number, required: true, default: 30 })
  defaultDueDays: number;

  @Prop({ type: Number, required: true, default: 10 })
  defaultTaxRate: number;

  @Prop({ type: Boolean, required: true, default: true })
  autoTax: boolean;

  @Prop({ type: String, default: '' })
  invoiceTemplateHtml: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
