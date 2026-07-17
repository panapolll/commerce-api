import { Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@Req() req) {
    return this.ordersService.checkout(req.user.id);
  }

  @Get('me')
  getMyOrders(@Req() req) {
    return this.ordersService.getMyOrders(req.user.id);
  }
}
