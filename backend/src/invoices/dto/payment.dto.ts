import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class AddPaymentDto {
  @IsNumber()
  @Min(0.01, { message: 'V-PAY-01' })
  amount: number;

  @IsDateString({}, { message: 'V-PAY-03' })
  paymentDate: string;

  @IsEnum(['cash', 'bank_transfer', 'check', 'other'])
  method: 'cash' | 'bank_transfer' | 'check' | 'other';

  @ValidateIf((o) => o.method === 'bank_transfer' || o.method === 'check')
  @IsString({ message: 'V-PAY-06' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  reference?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
