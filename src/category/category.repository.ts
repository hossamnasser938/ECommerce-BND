import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { CategoryEntity } from 'src/core/data-layer/mysql-typeorm/entities/category.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { ICategoryRepository } from './category.repository.abstract';
import { CreateCategoryDTO } from './dtos/create-category.dto';

@Injectable()
export class CategoryRepository
  extends MySQLTypeORMDataLayerRepository<CategoryEntity>
  implements ICategoryRepository<CategoryEntity>
{
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
  ) {
    super(categoryEntityRepository);
  }

  async createOne(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<CategoryEntity> {
    const { name, parentCategoryId } = createCategoryDTO;

    const parentCategory = parentCategoryId
      ? await this.categoryEntityRepository.findOneByOrFail({
          id: parentCategoryId,
        })
      : null;

    const category = new CategoryEntity(name, parentCategory);

    return this.categoryEntityRepository.save(category);
  }

  async getAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.getAllPaginated({
      paginationParameters: paginationParametersDTO,
      otherOptions: {
        relations: { parentCategory: true },
      },
    });
  }

  getOneById(id: number): Promise<CategoryEntity> {
    return this.categoryEntityRepository.findOneOrFail({
      where: { id },
      relations: { parentCategory: true, childCategories: true },
    });
  }
}
