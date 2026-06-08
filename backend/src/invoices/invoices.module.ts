import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { SettingsModule } from '../settings/settings.module';
import { CountersService } from './counters.service';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Counter, CounterSchema } from './schemas/counter.schema';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
    SettingsModule,
    CustomersModule,
    ProductsModule,
  ],
  controllers: [InvoicesController, PaymentsController],
  providers: [InvoicesService, PaymentsService, CountersService],
  exports: [InvoicesService, CountersService],
})
export class InvoicesModule {}
