import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/types';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  VoidInvoiceDto,
} from './dto/invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoices: InvoicesService) {}

  @Get()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  list(
    @CurrentUser() user: AuthUser,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('isOverdue') isOverdue?: string,
  ) {
    return this.invoices.list(user, {
      search,
      status,
      customerId,
      from,
      to,
      isOverdue,
    });
  }

  @Get(':id')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  get(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.invoices.getWithPayments(id, user);
  }

  @Post()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  create(@Body() dto: CreateInvoiceDto, @CurrentUser() user: AuthUser) {
    return this.invoices.create(dto, user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.invoices.update(id, dto, user);
  }

  @Post(':id/finalize')
  @Roles('ADMIN', 'ACCOUNTANT')
  finalize(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.invoices.finalize(id, user);
  }

  @Post(':id/void')
  @Roles('ADMIN')
  void(
    @Param('id') id: string,
    @Body() dto: VoidInvoiceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.invoices.void(id, dto, user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(204)
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    await this.invoices.remove(id, user);
  }
}
