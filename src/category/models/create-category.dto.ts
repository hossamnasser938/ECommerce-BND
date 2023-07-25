import { IsString, IsNumber } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  name: string;

  @IsNumber()
  parentCategoryId: number;
}
