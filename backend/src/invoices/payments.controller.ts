import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/types';
import { AddPaymentDto } from './dto/payment.dto';
import { PaymentsService } from './payments.service';

@Controller('invoices/:invoiceId/payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get()
  @Roles('ADMIN', 'ACCOUNTANT', 'SALES')
  list(@Param('invoiceId') invoiceId: string, @CurrentUser() user: AuthUser) {
    return this.payments.list(invoiceId, user);
  }

  @Post()
  @Roles('ADMIN', 'ACCOUNTANT')
  add(
    @Param('invoiceId') invoiceId: string,
    @Body() dto: AddPaymentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.payments.addPayment(invoiceId, dto, user);
  }
}
