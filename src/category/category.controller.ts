import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';

@Controller('categories')
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

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Post()
  createOne(
    @Body('name') name: string,
    @Body('parentCategoryId', ParseIntPipe) parentCategoryId: number,
  ) {
    return this.categoryService.createOne(name, parentCategoryId);
  }
}
