import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import {
  Identifier,
  PaginationResponse,
} from 'src/core/abstract-data-layer/types';
import { IProduct } from 'src/core/entities/product.entity.abstract';

import { CreateProductDTO } from './models/create-product.dto';

export interface IProductRepository<T extends IProduct>
  extends GenericRepository<T> {
  createOne(createProductDTO: CreateProductDTO): Promise<T>;
  getCategoryProducts(
    categoryId: Identifier,
    paginationParametersDTO: PaginationParamsDTO,
  ): Promise<PaginationResponse<T>>;
}
