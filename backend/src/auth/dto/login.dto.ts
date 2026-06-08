import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'V-AUTH-02' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'V-AUTH-01' })
  password: string;
}
