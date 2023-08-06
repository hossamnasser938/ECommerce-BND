import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  parentCategoryId?: number;
}
