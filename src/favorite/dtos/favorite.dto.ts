import { IsNumber } from 'class-validator';

export class FavoriteDTO {
  @IsNumber()
  productId: number;
}
