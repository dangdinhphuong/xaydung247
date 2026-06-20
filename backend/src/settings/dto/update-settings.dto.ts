import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  companyTaxCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  companyAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  companyPhone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'V-SET-02' })
  @MaxLength(120)
  companyEmail?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9-]+$/, { message: 'V-SET-06' })
  @MaxLength(10)
  invoicePrefix?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9-]+$/, { message: 'V-SET-06' })
  @MaxLength(10)
  quotationPrefix?: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'V-SET-04' })
  @Max(365, { message: 'V-SET-04' })
  defaultDueDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'V-SET-05' })
  @Max(100, { message: 'V-SET-05' })
  defaultTaxRate?: number;

  @IsOptional()
  @IsBoolean()
  autoTax?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  invoiceTemplateHtml?: string;

  @IsOptional()
  @IsString()
  invoiceTemplatePaperSize?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  bankAccountNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  bankAccountName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  bankBranch?: string;

  @IsOptional()
  @IsBoolean()
  bankQrEnabled?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000000)
  bankQrImageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bankQrNote?: string;
}
