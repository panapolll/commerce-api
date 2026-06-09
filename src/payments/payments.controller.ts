import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentServce: PaymentsService) {}

  @Post('charge')
  @UseGuards(JwtAuthGuard)
  charge(@Req() req, @Body() body: { orderId: string; token: string }) {
    console.log(req.user);
    return this.paymentServce.charge(body.orderId, body.token);
  }

  @Post('webhook')
  webhook(@Body() payload: any) {
    return this.paymentServce.webhook(payload);
  }
}
