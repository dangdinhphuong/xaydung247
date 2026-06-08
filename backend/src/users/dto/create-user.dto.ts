import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/types';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export class CreateUserDto {
  @IsEmail({}, { message: 'V-AUTH-02' })
  @MaxLength(100)
  email: string;

  @IsString()
  @Matches(PASSWORD_REGEX, { message: 'V-USR-05' })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string;

  @IsOptional()
  @IsString()
  @Matches(/^0\d{9,10}$/, { message: 'V-USR-02' })
  phone?: string;

  @IsEnum(['ADMIN', 'ACCOUNTANT', 'SALES', 'VIEWER'])
  role: Role;
}
