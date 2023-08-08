import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';

export class FindCategoryProducts extends PaginationParamsDTO {
  @IsNumber()
  @Type(() => Number)
  categoryId: number;
}
