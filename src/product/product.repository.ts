import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/category/category.repository';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { PaginationResponse } from 'src/core/abstract-data-layer/types';
import { ProductEntity } from 'src/core/data-layer/mysql-typeorm/entities/product.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { Repository } from 'typeorm';

import { CreateProductDTO } from './dtos/create-product.dto';
import { IProductRepository } from './product.repository.abstract';

@Injectable()
export class ProductRepository
  extends MySQLTypeORMDataLayerRepository<ProductEntity>
  implements IProductRepository<ProductEntity>
{
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
    @Inject('ICategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {
    super(productEntityRepository);
  }
  async getCategoryProducts(
    categoryId: number,
    paginationParametersDTO: PaginationParamsDTO,
  ): Promise<PaginationResponse<ProductEntity>> {
    const category = await this.categoryRepository.getOneById(categoryId);
    if (!category) {
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('Category', 'id', categoryId),
      );
    }
    return this.paginate({
      paginationParameters: paginationParametersDTO,
      query: {
        category: { id: category.id },
      },
    });
  }

  async createOne(createProductDTO: CreateProductDTO): Promise<ProductEntity> {
    const { name, description, amount, categoryId } = createProductDTO;

    const category = await this.categoryRepository.getOneById(categoryId);

    const product = new ProductEntity(name, description, amount, category);

    return this.productEntityRepository.save(product);
  }
}
