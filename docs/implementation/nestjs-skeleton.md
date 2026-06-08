# NestJS Skeleton — Generate Order

Hướng dẫn build backend từ scratch theo đúng `architecture/backend-architecture.md`.

## 1. Bootstrap project

```bash
mkdir apps/backend && cd apps/backend
npx @nestjs/cli new . --package-manager pnpm --strict
```

Chọn `pnpm`. Cấu hình `tsconfig.json` strict mode (đã default).

## 2. Install dependencies

```bash
pnpm add @nestjs/mongoose mongoose \
         @nestjs/passport passport passport-local @types/passport-local \
         bcrypt @types/bcrypt \
         express-session @types/express-session connect-mongo \
         csurf @types/csurf \
         cookie-parser @types/cookie-parser \
         class-validator class-transformer \
         @nestjs/config

pnpm add -D @types/express
```

## 3. Generate modules theo thứ tự

```bash
# Theo dependency order (modules ít ref ngoài generate trước)
nest g module common
nest g module users
nest g service users --no-spec
nest g controller users --no-spec

nest g module auth
nest g service auth --no-spec
nest g controller auth --no-spec

nest g module customers
nest g service customers --no-spec
nest g controller customers --no-spec

nest g module products
nest g service products --no-spec
nest g controller products --no-spec

nest g module settings
nest g service settings --no-spec
nest g controller settings --no-spec

nest g module invoices
nest g service invoices --no-spec
nest g controller invoices --no-spec
nest g service invoices/counters --no-spec
nest g service invoices/payments --no-spec
nest g controller invoices/payments --no-spec

nest g module quotations
nest g service quotations --no-spec
nest g controller quotations --no-spec

nest g module dashboard
nest g service dashboard --no-spec
nest g controller dashboard --no-spec

nest g module health
nest g controller health --no-spec
```

## 4. Common: guards, decorators, filters

```typescript
// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common'
export type Role = 'ADMIN' | 'ACCOUNTANT' | 'SALES' | 'VIEWER'
export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)

// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext) =>
  ctx.switchToHttp().getRequest().user
)

// src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common'
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

// src/common/guards/session-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UsersService } from '../../users/users.service'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private users: UsersService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(), ctx.getClass(),
    ])
    if (isPublic) return true
    const req = ctx.switchToHttp().getRequest()
    const userId = req.session?.userId
    if (!userId) throw new UnauthorizedException({ code: 'AUTH-NEEDED' })
    const user = await this.users.findById(userId)
    if (!user || user.status !== 'active') throw new UnauthorizedException({ code: 'AUTH-INACTIVE' })
    req.user = user
    return true
  }
}

// src/common/guards/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role, ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(), ctx.getClass(),
    ])
    if (!required) return true
    const { user } = ctx.switchToHttp().getRequest()
    if (!required.includes(user.role)) throw new ForbiddenException({ code: 'AUTH-FORBIDDEN' })
    return true
  }
}

// src/common/filters/http-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse()
    const status = exception.getStatus()
    const body = exception.getResponse()
    const payload = typeof body === 'object' ? body as any : { message: body }
    res.status(status).json({
      statusCode: status,
      code: payload.code,
      message: payload.message ?? exception.message,
      timestamp: new Date().toISOString(),
    })
  }
}
```

## 5. main.ts

```typescript
import { NestFactory, Reflector } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.use(cookieParser())
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86_400_000,
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI! }),
  }))
  // CSRF exempt — định nghĩa tập trung, thêm endpoint mới phải sửa ở đây
  const CSRF_EXEMPT_PATHS = new Set([
    '/api/auth/login',
    '/api/auth/csrf',
    '/api/health',
  ])
  const csrfMiddleware = csurf({ cookie: false })
  app.use((req: any, res: any, next: any) => {
    if (CSRF_EXEMPT_PATHS.has(req.path)) return next()
    csrfMiddleware(req, res, next)
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, forbidNonWhitelisted: true, transform: true,
  }))
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(parseInt(process.env.PORT ?? '3000'))
}
bootstrap()
```

## 6. app.module.ts

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { APP_GUARD } from '@nestjs/core'
import { SessionAuthGuard } from './common/guards/session-auth.guard'
import { RolesGuard } from './common/guards/roles.guard'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { CustomersModule } from './customers/customers.module'
import { ProductsModule } from './products/products.module'
import { InvoicesModule } from './invoices/invoices.module'
import { QuotationsModule } from './quotations/quotations.module'
import { SettingsModule } from './settings/settings.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    AuthModule, UsersModule, CustomersModule, ProductsModule,
    InvoicesModule, QuotationsModule, SettingsModule,
    DashboardModule, HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: SessionAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
```

## 7. Generate order với CLAUDE-CODE / Cursor

Khi dùng AI assistant tạo backend, prompt theo thứ tự:

1. "Tạo skeleton 8 module Nest theo `docs/architecture/backend-architecture.md` §3"
2. "Tạo common guards/decorators/filters theo `docs/implementation/nestjs-skeleton.md` §4"
3. "Tạo main.ts + app.module.ts"
4. "Cho mỗi module: tạo Mongoose schema theo `docs/database/mongodb-schema.md`"
5. "Cho mỗi module: tạo DTO theo `docs/api/<module>.md` validation table"
6. "Cho mỗi module: tạo service methods theo `docs/api/<module>.md` endpoints"
7. "Cho mỗi module: tạo controller wiring DTO + service + guards + roles theo permission matrix `docs/architecture/auth-and-rbac.md` §2.2"
8. "Tạo seed script `scripts/seed.ts` theo `docs/database/seed-data.md`"
9. "Tạo Jest tests theo `docs/qa/test-scenarios.md`"
10. "Tạo Dockerfile + docker-compose"

## 8. Verify

```bash
pnpm install
pnpm build           # tsc compile check
pnpm test            # Jest unit
pnpm test:e2e        # supertest E2E
pnpm seed
pnpm start:dev       # localhost:3000
curl http://localhost:3000/api/health
# { "ok": true, "version": "...", "timestamp": "..." }
```
