import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './common/guards/roles.guard';
import { SessionAuthGuard } from './common/guards/session-auth.guard';
import { CustomersModule } from './customers/customers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './health/health.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ProductsModule } from './products/products.module';
import { QuotationsModule } from './quotations/quotations.module';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/invoicepro',
    ),
    // Phục vụ bản build frontend (Vite outDir = <repo>/dist) trên cùng cổng với API.
    // FRONTEND_DIST cho phép override; mặc định là thư mục dist ở thư mục gốc repo.
    ServeStaticModule.forRoot({
      rootPath:
        process.env.FRONTEND_DIST || join(process.cwd(), '..', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    UsersModule,
    AuthModule,
    SettingsModule,
    CustomersModule,
    ProductsModule,
    InvoicesModule,
    QuotationsModule,
    DashboardModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: SessionAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
