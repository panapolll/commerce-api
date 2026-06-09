import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  addItem(@Req() req, @Body() body: { productId: string; quantity: number }) {
    return this.cartService.addItem(req.user.id, body.productId, body.quantity);
  }

  @Delete('items/:productId')
  removeItem(@Req() req, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.id, productId);
  }
}
