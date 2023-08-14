import { Inject, Injectable } from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IProduct } from 'src/core/entities/product.entity.abstract';

import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { IProductRepository } from './product.repository.abstract';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository<IProduct>,
  ) {}

  async findOneById(id: Identifier) {
    const product = await this.productRepository.getOneById(id);
    return product;
  }

  findAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.productRepository.getAll(paginationParametersDTO);
  }

  findCategoryProducts(
    categoryId: Identifier,
    paginationParametersDTO: PaginationParamsDTO,
  ) {
    return this.productRepository.getCategoryProducts(
      categoryId,
      paginationParametersDTO,
    );
  }

  async createOne(createProductDTO: CreateProductDTO) {
    return this.productRepository.createOne(createProductDTO);
  }

  async updateOneById(id: Identifier, updateProductDTO: UpdateProductDTO) {
    const updated = await this.productRepository.updateOneById(
      id,
      updateProductDTO,
    );
    return updated;
  }

  async deleteOneById(id: Identifier) {
    const deleted = await this.productRepository.deleteOneById(id);
    return deleted;
  }
}
