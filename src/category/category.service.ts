import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categroyRespositoy: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categroyRespositoy.find();
  }

  findOne(id: number): Promise<Category | null> {
    return this.categroyRespositoy.findOneBy({ id });
  }

  createOne(name: string): Promise<Category> {
    const category = new Category();
    category.name = name;
    return this.categroyRespositoy.save(category);
  }
}
