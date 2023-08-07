import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { IProductRepository } from './product.repository.abstract';
import { ProductEntity } from 'src/core/data-layer/mysql-typeorm/entities/product.entity';
import { CreateProductDTO } from './models/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from 'src/category/category.repository';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { PaginationResponse } from 'src/core/abstract-data-layer/types';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

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
