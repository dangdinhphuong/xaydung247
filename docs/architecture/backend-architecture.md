# Backend Architecture — NestJS MVP v1

## 1. Triết lý

- CRUD thuần.
- Logic business trong service layer, giữ tối thiểu.
- Validation = DTO + class-validator.
- Không service interface trừ khi cần test mock.
- Không repository layer trừ khi cần abstract Mongoose.

## 2. Stack

- NestJS 10
- Mongoose 8 (qua `@nestjs/mongoose`)
- class-validator + class-transformer
- @nestjs/passport + passport-local + bcrypt
- express-session + connect-mongo
- csurf
- @nestjs/config

## 3. Module structure

```
src/
├── main.ts                         # bootstrap
├── app.module.ts                   # root
├── common/
│   ├── decorators/
│   │   ├── roles.decorator.ts      # @Roles('ADMIN', 'ACCOUNTANT')
│   │   └── current-user.decorator.ts # @CurrentUser()
│   ├── guards/
│   │   ├── session-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── pipes/
│       └── (built-in ValidationPipe)
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts          # POST login/logout/csrf, GET me
│   ├── auth.service.ts
│   └── strategies/
│       └── local.strategy.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── customers/
│   ├── customers.module.ts
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   ├── schemas/
│   │   └── customer.schema.ts
│   └── dto/
├── products/                       (same pattern)
├── invoices/
│   ├── invoices.module.ts
│   ├── invoices.controller.ts
│   ├── invoices.service.ts
│   ├── payments.controller.ts      # /invoices/:id/payments subresource
│   ├── payments.service.ts
│   ├── counters.service.ts         # invoice number allocation
│   ├── schemas/
│   │   ├── invoice.schema.ts
│   │   ├── payment.schema.ts
│   │   └── counter.schema.ts
│   └── dto/
├── quotations/                     (same pattern + convert endpoint)
├── settings/
│   ├── settings.module.ts
│   ├── settings.controller.ts
│   ├── settings.service.ts
│   └── schemas/settings.schema.ts
├── dashboard/
│   ├── dashboard.module.ts
│   ├── dashboard.controller.ts
│   └── dashboard.service.ts
└── health/
    └── health.controller.ts
```

## 4. Bootstrap (main.ts)

```typescript
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import csurf from 'csurf'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,  // 1 day
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI!,
      ttl: 24 * 60 * 60,
    })
  }))

  // CSRF: skip cho các endpoint không có session HOẶC public health check.
  // Định nghĩa tập trung — thêm endpoint mới phải sửa ở đây.
  const CSRF_EXEMPT_PATHS = new Set([
    '/api/auth/login',     // chưa có session khi login
    '/api/auth/csrf',      // chính endpoint phát token, không thể yêu cầu token
    '/api/health',         // health check public cho monitoring
  ])
  const csrfMiddleware = csurf({ cookie: false })
  app.use((req, res, next) => {
    if (CSRF_EXEMPT_PATHS.has(req.path)) return next()
    csrfMiddleware(req, res, next)
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  app.setGlobalPrefix('api')

  await app.listen(3000)
}
bootstrap()
```

## 5. Auth flow

### 5.1 Login

```typescript
@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Body() dto: LoginDto) {
    // LocalAuthGuard đã verify + attach req.user
    req.session.userId = req.user._id.toString()
    return { user: this.toPublicUser(req.user) }
  }

  @Post('logout')
  async logout(@Req() req) {
    req.session.destroy()
    return { ok: true }
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  async me(@CurrentUser() user) {
    return { user: this.toPublicUser(user) }
  }

  @Get('csrf')
  async csrf(@Req() req) {
    return { csrfToken: req.csrfToken() }
  }
}
```

### 5.2 SessionAuthGuard

```typescript
@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest()
    const userId = req.session?.userId
    if (!userId) throw new UnauthorizedException()
    const user = await this.usersService.findById(userId)
    if (!user || user.status !== 'active') throw new UnauthorizedException()
    req.user = user
    return true
  }
}
```

### 5.3 RolesGuard + decorator

```typescript
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>('roles', [
      ctx.getHandler(), ctx.getClass(),
    ])
    if (!required) return true
    const { user } = ctx.switchToHttp().getRequest()
    return required.includes(user.role)
  }
}
```

### 5.4 Usage trong controller

```typescript
@Controller('invoices')
@UseGuards(SessionAuthGuard, RolesGuard)
export class InvoicesController {
  @Post()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  create(@Body() dto: CreateInvoiceDto, @CurrentUser() user) { ... }

  @Post(':id/finalize')
  @Roles('ADMIN', 'ACCOUNTANT')
  finalize(@Param('id') id: string) { ... }

  @Post(':id/payments')
  @Roles('ADMIN', 'ACCOUNTANT')
  addPayment(@Param('id') id: string, @Body() dto: AddPaymentDto) { ... }

  @Post(':id/void')
  @Roles('ADMIN')
  void(@Param('id') id: string, @Body() dto: VoidDto) { ... }
}
```

## 6. Service pattern

```typescript
@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private counters: CountersService,
    private settings: SettingsService,
  ) {}

  async findAll(filters: InvoiceFilters): Promise<Invoice[]> {
    const query: any = { deletedAt: null }
    if (filters.status) query.status = { $in: filters.status }
    if (filters.customerId) query.customerId = filters.customerId
    if (filters.search) {
      query.$or = [
        { invoiceNumber: { $regex: filters.search, $options: 'i' } },
        { customerName: { $regex: filters.search, $options: 'i' } },
      ]
    }
    const invoices = await this.invoiceModel.find(query).sort({ createdAt: -1 }).lean()
    return this.attachIsOverdue(invoices)
  }

  private attachIsOverdue(invoices: any[]): any[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return invoices.map(i => ({
      ...i,
      isOverdue: (i.status === 'unpaid' || i.status === 'partial')
              && i.remainingBalance > 0
              && new Date(i.dueDate) < today,
    }))
  }

  async create(dto: CreateInvoiceDto, userId: string): Promise<Invoice> {
    // Recompute totals
    const subtotal = dto.items.reduce((s, i) => s + (i.quantity * i.unitPrice - i.discount), 0)
    const settings = await this.settings.get()
    const tax = dto.tax ?? (settings.autoTax ? Math.round((subtotal - dto.discount) * settings.defaultTaxRate / 100) : 0)
    const total = subtotal - dto.discount + tax + dto.shipping
    const invoiceNumber = dto.status === 'unpaid'
      ? await this.counters.allocateInvoiceNumber(new Date().getFullYear())
      : null

    return this.invoiceModel.create({
      ...dto,
      invoiceNumber,
      subtotal,
      tax,
      total,
      paidAmount: 0,
      remainingBalance: total,
      createdBy: userId,
    })
  }

  async addPayment(invoiceId: string, dto: AddPaymentDto, userId: string) {
    const invoice = await this.invoiceModel.findOne({ _id: invoiceId, deletedAt: null })
    if (!invoice) throw new NotFoundException()
    if (invoice.status === 'draft') throw new UnprocessableEntityException('DOMAIN-DRAFT-PAYMENT')
    if (invoice.status === 'void') throw new UnprocessableEntityException('DOMAIN-VOID-PAYMENT')
    if (invoice.remainingBalance === 0) throw new UnprocessableEntityException('DOMAIN-PAID-PAYMENT')
    if (dto.amount > invoice.remainingBalance) throw new BadRequestException('V-PAY-02')

    const payment = await this.paymentModel.create({ ...dto, invoiceId, createdBy: userId })

    // H-3 + H-4: Recompute từ DB, post-recompute guard
    const allPayments = await this.paymentModel.find({ invoiceId }).lean()
    const paidAmount = allPayments.reduce((s, p) => s + p.amount, 0)

    if (paidAmount > invoice.total) {
      this.logger.warn(
        `[Payment race] invoice=${invoice._id} total=${invoice.total} paid=${paidAmount} ` +
        `paymentJustInserted=${payment._id}`
      )
      throw new UnprocessableEntityException({
        code: 'DOMAIN-PAID-EXCEEDS-TOTAL',
        message: 'Tổng thanh toán vượt quá tổng hoá đơn. Vui lòng tải lại và thử lại.',
      })
    }

    const remainingBalance = invoice.total - paidAmount
    const status = paidAmount >= invoice.total ? 'paid' : 'partial'

    invoice.paidAmount = paidAmount
    invoice.remainingBalance = remainingBalance
    invoice.status = status
    await invoice.save()

    return { invoice, payments: allPayments }
  }
}
```

## 7. Counter service (atomic invoice number)

```typescript
@Injectable()
export class CountersService {
  constructor(
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    private settings: SettingsService,
  ) {}

  async allocateInvoiceNumber(year: number): Promise<string> {
    const settings = await this.settings.get()
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: `invoice-${year}` },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    )
    const padded = String(counter.seq).padStart(3, '0')
    return `${settings.invoicePrefix}${year}-${padded}`
  }

  async allocateQuotationNumber(year: number): Promise<string> {
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: `quotation-${year}` },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    )
    return `BG-${year}-${String(counter.seq).padStart(3, '0')}`
  }
}
```

## 8. Error handling

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse()
    const status = exception.getStatus()
    const message = exception.getResponse()

    res.status(status).json({
      statusCode: status,
      message: typeof message === 'string' ? message : message['message'],
      code: typeof message === 'object' ? message['code'] : undefined,
      timestamp: new Date().toISOString(),
    })
  }
}
```

FE đọc `code` để hiển thị message tiếng Việt phù hợp.

## 9. Health check

```typescript
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private conn: Connection) {}

  @Get()
  async check() {
    const mongoState = this.conn.readyState  // 1 = connected
    return {
      ok: mongoState === 1,
      version: process.env.npm_package_version,
      timestamp: new Date().toISOString(),
    }
  }
}
```

## 10. Cấu hình môi trường

```env
# .env
NODE_ENV=production
PORT=3000
TZ=Asia/Ho_Chi_Minh
MONGODB_URI=mongodb://localhost:27017/invoicepro
SESSION_SECRET=<openssl rand -hex 32>
```

## 11. Logging

NestJS Logger built-in, output stdout. Docker capture qua `docker logs`. Production rotate qua Docker logging driver `json-file` với `max-size: 10m, max-file: 3`.

Không cần structured JSON log cho MVP. Khi có nhu cầu → switch sang pino.

## 12. Testing

| Loại | Tool | Coverage target |
|---|---|---|
| Unit (service logic) | Jest | 70%+ cho service files |
| Integration (controller + Mongo) | Jest + MongoMemoryServer | Happy path mỗi endpoint |
| E2E | Supertest | Login → tạo invoice → add payment → query dashboard |

Không cần load test cho MVP.

## 13. Out of scope

- Microservices, gateway, mesh
- Background workers, queues
- Caching layer (Redis)
- API versioning (chỉ có v1, không cần /v2 ở MVP)
- OpenAPI/Swagger auto-gen (viết tay docs ở /docs/api/)
- Distributed tracing
- Feature flags
