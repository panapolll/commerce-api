import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrdersModule } from 'src/orders/orders.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [OrdersModule, CartModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
