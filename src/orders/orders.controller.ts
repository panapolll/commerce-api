import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/role/roles.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { OrderStatus } from './schema/orders.schema';
import { UpdateOrderStatusDto } from './orders.dto.ts/irders.dto';

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

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
