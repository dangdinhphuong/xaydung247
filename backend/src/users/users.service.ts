import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { FilterQuery, Model, Types } from 'mongoose';
import { escapeRegex } from '../common/utils/regex.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

const BCRYPT_COST = 10;

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  status: string;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  toPublic(user: UserDocument | (User & Record<string, any>)): PublicUser {
    const u: any = (user as any).toObject ? (user as any).toObject() : user;
    return {
      id: u._id.toString(),
      email: u.email,
      fullName: u.fullName,
      phone: u.phone,
      role: u.role,
      status: u.status,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }

  async findByIdRaw(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() });
  }

  async verifyPassword(user: UserDocument, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async markLoggedIn(userId: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { lastLoginAt: new Date() } },
    );
  }

  async list(query: { search?: string; role?: string; status?: string }) {
    const filter: FilterQuery<UserDocument> = {};
    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.search) {
      const r = escapeRegex(query.search);
      filter.$or = [
        { email: { $regex: r, $options: 'i' } },
        { fullName: { $regex: r, $options: 'i' } },
      ];
    }
    const users = await this.userModel.find(filter).sort({ createdAt: -1 }).lean();
    return {
      data: users.map((u) => this.toPublic(u as any)),
      page: { page: 1, size: users.length, total: users.length },
    };
  }

  async findById(id: string): Promise<PublicUser> {
    const user = await this.findByIdRaw(id);
    if (!user) throw new NotFoundException({ code: 'NOT_FOUND' });
    return this.toPublic(user);
  }

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const existing = await this.userModel.exists({
      email: dto.email.toLowerCase().trim(),
    });
    if (existing) {
      throw new ConflictException({
        code: 'V-USR-01',
        message: 'Email đã được sử dụng',
      });
    }
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);
    const user = await this.userModel.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phone: dto.phone,
      role: dto.role,
      status: 'active',
    });
    return this.toPublic(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<PublicUser> {
    const user = await this.findByIdRaw(id);
    if (!user) throw new NotFoundException({ code: 'NOT_FOUND' });

    const willDemote =
      user.role === 'ADMIN' && !!dto.role && dto.role !== 'ADMIN';
    const willDeactivate =
      user.status === 'active' && dto.status === 'inactive';
    if (user.role === 'ADMIN' && (willDemote || willDeactivate)) {
      const activeAdmins = await this.userModel.countDocuments({
        role: 'ADMIN',
        status: 'active',
      });
      if (activeAdmins <= 1) {
        throw new UnprocessableEntityException({
          code: 'DOMAIN-LAST-ADMIN',
          message: 'Không thể vô hiệu hoá quản trị viên cuối cùng',
        });
      }
    }
    Object.assign(user, dto);
    await user.save();
    return this.toPublic(user);
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findByIdRaw(id);
    if (!user) throw new NotFoundException({ code: 'NOT_FOUND' });
    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST);
    await user.save();
  }

  async changeOwnPassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findByIdRaw(id);
    if (!user) throw new NotFoundException({ code: 'NOT_FOUND' });
    const ok = await this.verifyPassword(user, currentPassword);
    if (!ok) {
      throw new BadRequestException({
        code: 'AUTH-WRONG-PASSWORD',
        message: 'Mật khẩu hiện tại không đúng',
      });
    }
    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST);
    await user.save();
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<PublicUser> {
    const user = await this.findByIdRaw(id);
    if (!user) throw new NotFoundException({ code: 'NOT_FOUND' });
    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.phone !== undefined) user.phone = dto.phone;
    await user.save();
    return this.toPublic(user);
  }
}
