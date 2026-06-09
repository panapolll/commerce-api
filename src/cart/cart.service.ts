import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  async getCart(userId: string) {
    const cart = await this.cartModel
      .findOne({ userId })
      .populate('items.productId');
    if (!cart) return { items: [] };
    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number) {
    await this.productsService.findById(productId);

    let cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      cart = new this.cartModel({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId: productId as any, quantity });
    }

    return cart.save();
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    return cart.save();
  }
}