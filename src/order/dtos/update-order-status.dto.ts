import { IsEnum } from 'class-validator';

import { OrderStatusTransition } from '../types';

export class UpdateOrderStatusDTO {
  @IsEnum(OrderStatusTransition)
  transition: OrderStatusTransition;
}
