import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  parentCategoryId?: number;
}
