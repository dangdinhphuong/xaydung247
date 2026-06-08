import { Controller, Get } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER')
  summary() {
    return this.dashboard.summary();
  }
}
