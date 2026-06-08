import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PublicUser, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  async validate(email: string, password: string): Promise<PublicUser> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        code: 'AUTH-INVALID',
        message: 'Email hoặc mật khẩu không đúng',
      });
    }
    if (user.status !== 'active') {
      throw new ForbiddenException({
        code: 'AUTH-INACTIVE',
        message: 'Tài khoản đã bị vô hiệu hoá',
      });
    }
    const ok = await this.users.verifyPassword(user, password);
    if (!ok) {
      throw new UnauthorizedException({
        code: 'AUTH-INVALID',
        message: 'Email hoặc mật khẩu không đúng',
      });
    }
    await this.users.markLoggedIn(user._id.toString());
    return this.users.toPublic(user);
  }
}
