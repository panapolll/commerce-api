import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  fromUserId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  toUserId!: Types.ObjectId;

  @Prop({ required: true })
  amount!: number;

  @Prop({ enum: TransactionType, required: true })
  type!: TransactionType;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);