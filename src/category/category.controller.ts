import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Controller('category')
export class CategoryController {
  constructor(
    @Inject(CategoryService)
    private categoryService: CategoryService,
  ) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category | null> {
    return this.categoryService.findOneById(id);
  }

  @Post()
  createOne(
    @Body('name') name: string,
    @Body('parentCategoryId', ParseIntPipe) parentCategoryId: number,
  ) {
    return this.categoryService.createOne(name, parentCategoryId);
  }
}
