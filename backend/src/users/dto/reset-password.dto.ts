import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export class ResetPasswordDto {
  @IsString()
  @Matches(PASSWORD_REGEX, { message: 'V-USR-05' })
  newPassword: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @Matches(PASSWORD_REGEX, { message: 'V-USR-05' })
  newPassword: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^0\d{9,10}$/, { message: 'V-USR-02' })
  phone?: string;
}
