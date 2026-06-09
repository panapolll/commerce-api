import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;
  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ])
  items!: { productId: Types.ObjectId; quantity: number; price: number }[];

  @Prop({ required: true })
  totalPrice!: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
