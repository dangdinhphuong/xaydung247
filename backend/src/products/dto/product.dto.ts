import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2, { message: 'V-PROD-01' })
  @MaxLength(200, { message: 'V-PROD-01' })
  name: string;

  @IsString()
  @MinLength(1, { message: 'V-PROD-04' })
  @MaxLength(100)
  category: string;

  @IsString()
  @MinLength(1, { message: 'V-PROD-05' })
  @MaxLength(20)
  unit: string;

  @IsNumber()
  @Min(0, { message: 'V-PROD-02' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'V-PROD-03' })
  stock: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'V-PROD-02' })
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'V-PROD-03' })
  stock?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
