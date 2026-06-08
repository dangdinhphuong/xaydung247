import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateInvoiceItemDto {
  @IsMongoId({ message: 'V-CI-03' })
  productId: string;

  @IsNumber()
  @Min(0.001, { message: 'V-CI-03' })
  quantity: number;

  @IsNumber()
  @Min(0, { message: 'V-CI-03' })
  unitPrice: number;

  @IsNumber()
  @Min(0, { message: 'V-CI-07' })
  discount: number;
}

export class CreateInvoiceDto {
  @IsMongoId({ message: 'V-CI-01' })
  customerId: string;

  @IsDateString({}, { message: 'V-CI-05' })
  issueDate: string;

  @IsDateString({}, { message: 'V-CI-05' })
  dueDate: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'V-CI-02' })
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];

  @IsNumber()
  @Min(0, { message: 'V-CI-07' })
  @IsOptional()
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'V-CI-07' })
  tax?: number;

  @IsNumber()
  @Min(0, { message: 'V-CI-07' })
  @IsOptional()
  shipping?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'V-CI-09' })
  notes?: string;

  @IsEnum(['draft', 'unpaid'])
  status: 'draft' | 'unpaid';
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsDateString({})
  issueDate?: string;

  @IsOptional()
  @IsDateString({})
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items?: CreateInvoiceItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  shipping?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class VoidInvoiceDto {
  @IsString()
  @MaxLength(500)
  voidReason: string;
}
