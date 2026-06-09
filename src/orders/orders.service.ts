import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { Order, OrderDocument, OrderStatus } from './schema/orders.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
  ) {}

  async checkout(userId: string) {
    const cart = await this.cartService.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const items = cart.items.map((item: any) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = new this.orderModel({ userId, items, totalPrice });
    return order.save();
  }

  async getMyOrders(userId: string) {
    return this.orderModel
      .find({ userId })
      .populate('items.productId', 'name price');
  }

  async getAllOrders() {
    return this.orderModel
      .find()
      .populate('items.productId', 'name price')
      .populate('userId', 'email');
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    if (!Object.values(OrderStatus).includes(status)) {
      throw new BadRequestException(
        `Status must be one of: ${Object.values(OrderStatus).join(', ')}`,
      );
    }
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
