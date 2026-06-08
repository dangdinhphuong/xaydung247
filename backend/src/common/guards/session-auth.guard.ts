import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();
    const userId = req.session?.userId;
    if (!userId) {
      throw new UnauthorizedException({
        code: 'AUTH-NEEDED',
        message: 'Vui lòng đăng nhập',
      });
    }

    const usersService = this.moduleRef.get(UsersService, { strict: false });
    const user = await usersService.findByIdRaw(userId);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException({
        code: 'AUTH-INACTIVE',
        message: 'Tài khoản đã bị vô hiệu hoá',
      });
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
    return true;
  }
}
