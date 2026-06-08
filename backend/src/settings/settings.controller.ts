import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  // Mọi vai trò đã đăng nhập đều cần đọc settings (thông tin công ty + mẫu in hóa đơn).
  @Get()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER')
  get() {
    return this.settings.get();
  }

  @Patch()
  @Roles('ADMIN')
  update(@Body() dto: UpdateSettingsDto) {
    return this.settings.update(dto);
  }
}
