import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const sessionSecret =
    process.env.SESSION_SECRET || 'change-me-in-production-32-bytes-min';
  if (sessionSecret.length < 32) {
    logger.warn(
      'SESSION_SECRET ngắn hơn 32 ký tự — production cần openssl rand -hex 32',
    );
  }

  const mongoUrl =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/invoicepro';

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      },
      store: MongoStore.create({ mongoUrl, ttl: 24 * 60 * 60 }),
    }),
  );

  // CSRF: bỏ qua các route không cần token (login, lấy csrf, health).
  const CSRF_EXEMPT_PATHS = new Set([
    '/api/auth/login',
    '/api/health',
  ]);
  const csrfMiddleware = csurf({ cookie: false });
  app.use((req: any, res: any, next: any) => {
    if (CSRF_EXEMPT_PATHS.has(req.path)) return next();
    csrfMiddleware(req, res, next);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  logger.log(`🚀 Invoice Pro API chạy tại http://localhost:${port}/api`);
  logger.log(`📦 Mongo: ${mongoUrl}`);
  logger.log(`🌏 TZ: ${process.env.TZ || '(mặc định OS)'}`);
}

bootstrap();
