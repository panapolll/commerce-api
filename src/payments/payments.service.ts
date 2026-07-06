import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Omise from 'omise';
import { CartService } from 'src/cart/cart.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import {
  Order,
  OrderDocument,
  OrderStatus,
} from 'src/orders/schema/orders.schema';

@Injectable()
export class PaymentsService {
  private omise!: ReturnType<typeof Omise>;
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private notificationsService: NotificationsService,
  ) {
    this.omise = Omise({
      publicKey: process.env.OMISE_PUBLIC_KEY,
      secretKey: process.env.OMISE_SECRET_KEY,
    });
  }

  async charge(oderId: string, token: string) {
    const order = await this.orderModel.findById(oderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not pending');
    }
    const charge = await this.omise.charges.create({
      amount: order.totalPrice * 100,
      currency: 'thb',
      card: token,
    });
    if (charge.status === 'successful') {
      order.status = OrderStatus.PAID;
      await order.save();
      await this.cartService.clearCart(String(order.userId));
      await this.notificationsService.sendPaymentSuccess(
        String(order.userId),
        String(order._id),
        order.totalPrice,
      );
    }

    return { chargeId: charge.id, status: charge.status };
  }

  async webhook(payload: any) {
    if (payload.key !== 'charge.complete') return;
    const charge = payload.data;
    if (charge.status === 'successful') return;
    const order = await this.orderModel.findOne({
      'items.productId': { $exists: true },
      status: OrderStatus.PENDING,
    });
    if (order) {
      order.status = OrderStatus.PAID;
      await order.save();
    }
  }
}
