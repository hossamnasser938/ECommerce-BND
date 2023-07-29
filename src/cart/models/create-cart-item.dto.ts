import { IsNumber } from 'class-validator';

export class CreateCartItemDTO {
  @IsNumber()
  productId: number;

  @IsNumber()
  amount: number;
}
