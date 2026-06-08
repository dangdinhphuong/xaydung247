import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from '../customers/customers.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { SettingsModule } from '../settings/settings.module';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { Quotation, QuotationSchema } from './schemas/quotation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quotation.name, schema: QuotationSchema },
    ]),
    SettingsModule,
    CustomersModule,
    InvoicesModule,
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
