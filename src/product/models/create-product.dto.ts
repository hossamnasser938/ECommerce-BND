import { IsString, IsNumber } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  categoryId: number;
}
