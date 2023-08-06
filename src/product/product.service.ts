import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './models/create-product.dto';
import { UpdateProductDTO } from './models/update-product.dto';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { IProductRepository } from './product.repository.abstract';
import { IProduct } from 'src/core/entities/product.entity.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';

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

  findAll() {
    return this.productRepository.getAll();
  }

  findCategoryProducts(categoryId: Identifier) {
    return this.productRepository.getCategoryProducts(categoryId);
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
