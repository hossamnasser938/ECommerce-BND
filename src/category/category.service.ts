import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';

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

  findOneById(id: number): Promise<Category | null> {
    return this.categroyRepositoy.findOne({
      where: { id },
      relations: { parentCategory: true, childCategories: true },
    });
  }

  async createOne(name: string, parentCategoryId?: number): Promise<Category> {
    const parentCategory = await this.findOneById(parentCategoryId);
    const category = new Category();
    category.name = name;
    if (parentCategory) {
      category.parentCategory = parentCategory;
    }
    return this.categroyRepositoy.save(category);
  }
}
