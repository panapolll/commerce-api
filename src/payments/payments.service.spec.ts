import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Order, OrderStatus } from 'src/orders/schema/orders.schema';
import { CartService } from 'src/cart/cart.service';
import { NotificationsService } from 'src/notfications/notfications.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;
  let orderModel: any;
  let cartService: jest.Mocked<CartService>;
  let notificationsService: jest.Mocked<NotificationsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: CartService,
          useValue: {
            clearCart: jest.fn(),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            sendPaymentSuccess: jest.fn(),
          },
        },
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);
    orderModel = module.get(getModelToken(Order.name));
    cartService = module.get(CartService);
    notificationsService = module.get(NotificationsService);
  });

  describe('charge', () => {
    it('should throw NotFoundException if order not found', async () => {
      orderModel.findById.mockResolvedValue(null);

      await expect(
        paymentsService.charge('orderId123', 'token123', 'userId123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not order owner', async () => {
      orderModel.findById.mockResolvedValue({
        _id: 'orderId123',
        userId: 'anotherUserId',
        status: OrderStatus.PENDING,
        totalPrice: 100,
      });

      await expect(
        paymentsService.charge('orderId123', 'token123', 'userId123'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if order is not pending', async () => {
      orderModel.findById.mockResolvedValue({
        _id: 'orderId123',
        userId: 'userId123',
        status: OrderStatus.PAID,
        totalPrice: 100,
      });

      await expect(
        paymentsService.charge('orderId123', 'token123', 'userId123'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
