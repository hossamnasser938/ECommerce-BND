import { IsNumber } from 'class-validator';

export class CreateOrderDTO {
  @IsNumber()
  shippingAddressId: number;
}
