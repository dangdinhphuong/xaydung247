import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MinLength(2, { message: 'V-CUST-01' })
  @MaxLength(200, { message: 'V-CUST-01' })
  name: string;

  @IsString()
  @Matches(/^0\d{9,10}$/, { message: 'V-CUST-02' })
  phone: string;

  @IsEmail({}, { message: 'V-CUST-03' })
  @MaxLength(120)
  email: string;

  @IsString()
  @MaxLength(300, { message: 'V-CUST-06' })
  address: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'V-CUST-04' })
  taxCode?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^0\d{9,10}$/, { message: 'V-CUST-02' })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'V-CUST-03' })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  taxCode?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
