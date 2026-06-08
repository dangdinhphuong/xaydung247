import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../common/types';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true, trim: true })
  fullName: string;

  @Prop({ type: String, trim: true })
  phone?: string;

  @Prop({
    type: String,
    required: true,
    enum: ['ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER'],
  })
  role: Role;

  @Prop({
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  @Prop({ type: Date })
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ role: 1, status: 1 });
