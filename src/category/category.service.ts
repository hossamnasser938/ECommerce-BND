import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './models/create-category.dto';
import { UpdateCategoryDTO } from './models/update-category.dto';
import { checkTypeORMUpdateDeleteResult } from 'src/utils/helper-functions';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categroyRepositoy: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categroyRepositoy.find({
      relations: { parentCategory: true },
    });
  }

  async findOneById(id: number): Promise<Category | null> {
    const category = await this.categroyRepositoy.findOne({
      where: { id },
      relations: { parentCategory: true, childCategories: true },
    });

    if (!category) throw new NotFoundException();
    return category;
  }

  async createOne(createCategoryDTO: CreateCategoryDTO): Promise<Category> {
    const { name, parentCategoryId } = createCategoryDTO;

    const parentCategory = await this.findOneById(parentCategoryId);
    const category = new Category();
    category.name = name;
    if (parentCategory) {
      category.parentCategory = parentCategory;
    }
    return this.categroyRepositoy.save(category);
  }

  async updateOneById(
    id: number,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<boolean> {
    const result = await this.categroyRepositoy.update(id, updateCategoryDTO);
    return checkTypeORMUpdateDeleteResult(result);
  }

  async deleteOneById(id: number) {
    const result = await this.categroyRepositoy.delete(id);
    return checkTypeORMUpdateDeleteResult(result);
  }
}
