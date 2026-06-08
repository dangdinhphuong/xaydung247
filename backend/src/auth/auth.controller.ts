import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthUser } from '../common/types';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Public()
  @Get('csrf')
  csrf(@Req() req: Request) {
    return { csrfToken: req.csrfToken!() };
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request, @Body() dto: LoginDto) {
    const user = await this.auth.validate(dto.email, dto.password);
    req.session.userId = user.id;
    return { user };
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Req() req: Request): Promise<void> {
    return new Promise((resolve) => {
      req.session.destroy(() => resolve());
    });
  }

  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const fresh = await this.users.findById(user._id);
    return { user: fresh };
  }
}
