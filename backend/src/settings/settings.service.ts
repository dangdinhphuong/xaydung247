import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings, SettingsDocument } from './schemas/settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name) private readonly model: Model<SettingsDocument>,
  ) {}

  async get(): Promise<SettingsDocument> {
    const s = await this.model.findOne().sort({ createdAt: 1 });
    if (!s) {
      throw new InternalServerErrorException({
        code: 'SETTINGS-NOT-SEEDED',
        message: 'Hệ thống chưa được khởi tạo, liên hệ quản trị viên',
      });
    }
    return s;
  }

  async getOrNull(): Promise<SettingsDocument | null> {
    return this.model.findOne().sort({ createdAt: 1 });
  }

  async update(dto: UpdateSettingsDto): Promise<SettingsDocument> {
    const s = await this.get();
    Object.assign(s, dto);
    await s.save();
    return s;
  }

  async upsertInitial(data: Partial<Settings>): Promise<SettingsDocument> {
    const existing = await this.getOrNull();
    if (existing) return existing;
    return this.model.create(data as Settings);
  }
}
