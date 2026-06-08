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
  CreateQuotationDto,
  RejectQuotationDto,
  UpdateQuotationDto,
} from './dto/quotation.dto';
import { QuotationsService } from './quotations.service';

@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotations: QuotationsService) {}

  @Get()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER')
  list(
    @CurrentUser() user: AuthUser,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('isExpired') isExpired?: string,
  ) {
    return this.quotations.list(user, { search, status, customerId, isExpired });
  }

  @Get(':id')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER')
  get(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.quotations.get(id, user);
  }

  @Post()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  create(@Body() dto: CreateQuotationDto, @CurrentUser() user: AuthUser) {
    return this.quotations.create(dto, user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQuotationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.quotations.update(id, dto, user);
  }

  @Post(':id/send')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  send(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.quotations.send(id, user);
  }

  @Post(':id/accept')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  accept(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.quotations.accept(id, user);
  }

  @Post(':id/reject')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  reject(
    @Param('id') id: string,
    @Body() dto: RejectQuotationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.quotations.reject(id, dto, user);
  }

  @Post(':id/clone')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  clone(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.quotations.clone(id, user);
  }

  @Post(':id/convert')
  @Roles('ADMIN', 'ACCOUNTANT')
  @HttpCode(201)
  convert(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.quotations.convert(id, user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.quotations.remove(id);
  }
}
