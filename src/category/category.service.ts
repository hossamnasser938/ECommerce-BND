import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDTO } from './models/create-category.dto';
import { UpdateCategoryDTO } from './models/update-category.dto';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { ICategoryRepository } from './category.repository.abstract';
import { ICategory } from 'src/core/entities/category.entity.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categroyRepositoy: ICategoryRepository<ICategory>,
  ) {}

  async findAll() {
    return this.categroyRepositoy.getAll();
  }

  async findOneById(id: Identifier) {
    const category = await this.categroyRepositoy.getOneById(id);

    if (!category)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('Category', 'id', id),
      );
    return category;
  }

  async createOne(createCategoryDTO: CreateCategoryDTO) {
    return this.categroyRepositoy.createOne(createCategoryDTO);
  }

  async updateOneById(
    id: Identifier,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<boolean> {
    const updated = await this.categroyRepositoy.updateOneById(
      id,
      updateCategoryDTO,
    );
    return updated;
  }

  async deleteOneById(id: Identifier) {
    const deleted = await this.categroyRepositoy.deleteOneById(id);
    return deleted;
  }
}
