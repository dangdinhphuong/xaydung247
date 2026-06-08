import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/types';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^0\d{9,10}$/, { message: 'V-USR-02' })
  phone?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER'])
  role?: Role;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
