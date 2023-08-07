import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { IProduct } from 'src/core/entities/product.entity.abstract';
import { CreateProductDTO } from './models/create-product.dto';
import { Identifier } from 'src/core/abstract-data-layer/types';

export interface IProductRepository<T extends IProduct>
  extends GenericRepository<T> {
  createOne(createProductDTO: CreateProductDTO): Promise<T>;
  getCategoryProducts(categoryId: Identifier): Promise<T[]>;
}