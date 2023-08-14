import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/category/category.repository';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { PaginationResponse } from 'src/core/abstract-data-layer/types';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_STARTING_PAGE,
} from 'src/core/data-layer/mysql-typeorm/config-constants';
import { ProductEntity } from 'src/core/data-layer/mysql-typeorm/entities/product.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
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

    const { page = DEFAULT_STARTING_PAGE, pageSize = DEFAULT_PAGE_SIZE } =
      paginationParametersDTO;

    const rawCountQuery = `WITH RECURSIVE CategoryHierarchy AS (
      SELECT id FROM category WHERE id = ${categoryId} 
      UNION ALL SELECT c.id FROM category c 
      INNER JOIN CategoryHierarchy ch ON c.parentCategoryId = ch.id
    ) 
      
    SELECT COUNT(p.id) as count FROM product p JOIN category c ON p.categoryId = c.id 
    WHERE c.id IN (SELECT id FROM CategoryHierarchy)`;

    const rawResultQuery = `WITH RECURSIVE CategoryHierarchy AS (
      SELECT id FROM category WHERE id = ${categoryId} 
      UNION ALL SELECT c.id FROM category c 
      INNER JOIN CategoryHierarchy ch ON c.parentCategoryId = ch.id
    ) 
      
    SELECT p.* FROM product p JOIN category c ON p.categoryId = c.id 
    WHERE c.id IN (SELECT id FROM CategoryHierarchy)
    limit ${pageSize} offset ${pageSize * (page - 1)}`;

    const result = await this.productEntityRepository.query(rawResultQuery);
    const count = (await this.productEntityRepository.query(rawCountQuery))[0]
      .count;

    return this.formatPaginationResponse(
      result,
      count,
      paginationParametersDTO,
    );
  }

  async createOne(createProductDTO: CreateProductDTO): Promise<ProductEntity> {
    const { name, description, amount, categoryId } = createProductDTO;

    const category = await this.categoryRepository.getOneById(categoryId);

    const product = new ProductEntity(name, description, amount, category);

    return this.productEntityRepository.save(product);
  }
}
