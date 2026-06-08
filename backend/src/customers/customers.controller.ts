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
import { Roles } from '../common/decorators/roles.decorator';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}

  @Get()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER')
  list(@Query('search') search?: string, @Query('status') status?: string) {
    return this.customers.list({ search, status });
  }

  @Get(':id')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER')
  get(@Param('id') id: string) {
    return this.customers.get(id);
  }

  @Get(':id/aging')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER')
  aging(@Param('id') id: string) {
    return this.customers.aging(id);
  }

  @Post()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  create(@Body() dto: CreateCustomerDto) {
    return this.customers.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customers.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.customers.remove(id);
  }
}
