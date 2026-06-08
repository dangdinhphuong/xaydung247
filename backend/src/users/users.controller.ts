import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/types';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.users.list({ search, role, status });
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.users.create(dto);
    return { user };
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.users.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Post(':id/reset-password')
  async resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    await this.users.resetPassword(id, dto.newPassword);
    return { ok: true };
  }
}

@Controller('profile')
export class ProfileController {
  constructor(private readonly users: UsersService) {}

  @Get()
  me(@CurrentUser() user: AuthUser) {
    return this.users.findById(user._id);
  }

  @Patch()
  update(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user._id, dto);
  }

  @Post('change-password')
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.users.changeOwnPassword(
      user._id,
      dto.currentPassword,
      dto.newPassword,
    );
    return { ok: true };
  }
}
