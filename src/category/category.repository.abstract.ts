import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { ICategory } from 'src/core/entities/category.entity.abstract';

import { CreateCategoryDTO } from './dtos/create-category.dto';

export interface ICategoryRepository<T extends ICategory>
  extends GenericRepository<T> {
  createOne(createCategoryDTO: CreateCategoryDTO): Promise<T>;
}
