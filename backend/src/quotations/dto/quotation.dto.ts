import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateInvoiceItemDto } from '../../invoices/dto/invoice.dto';

export class CreateQuotationDto {
  @IsMongoId({ message: 'V-CI-01' })
  customerId: string;

  @IsDateString({}, { message: 'V-Q-02' })
  issueDate: string;

  @IsDateString({}, { message: 'V-Q-02' })
  validUntil: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'V-CI-02' })
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'V-CI-07' })
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'V-CI-07' })
  tax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'V-CI-07' })
  shipping?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'V-CI-09' })
  notes?: string;
}

export class UpdateQuotationDto {
  @IsOptional()
  @IsDateString({})
  issueDate?: string;

  @IsOptional()
  @IsDateString({})
  validUntil?: string;

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

export class RejectQuotationDto {
  @IsString()
  @MaxLength(500)
  rejectReason: string;
}
