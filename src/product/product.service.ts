import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IProduct } from 'src/core/entities/product.entity.abstract';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

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

    if (!product)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('Product', 'id', id),
      );
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
