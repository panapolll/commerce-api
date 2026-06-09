import { IsEnum } from 'class-validator';
import { OrderStatus } from '../schema/orders.schema';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: `Status must be one of: ${Object.values(OrderStatus).join(', ')}`,
  })
  status!: OrderStatus;
}
