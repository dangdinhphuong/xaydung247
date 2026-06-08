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
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER')
  list(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    return this.products.list({ search, category, status });
  }

  @Get('categories')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER')
  async categories() {
    const data = await this.products.listCategories();
    return { data };
  }

  @Get(':id')
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER')
  get(@Param('id') id: string) {
    return this.products.get(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.products.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.products.remove(id);
  }
}
