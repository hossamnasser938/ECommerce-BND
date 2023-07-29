import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { CreateCategoryDTO } from './models/create-category.dto';
import { UpdateCategoryDTO } from './models/update-category.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';

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
  createOne(@Body() createCategoryDTO: CreateCategoryDTO) {
    return this.categoryService.createOne(createCategoryDTO);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Put(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ) {
    const updatedSuccessfully = await this.categoryService.updateOneById(
      id,
      updateCategoryDTO,
    );

    return updateDeleteResponse(updatedSuccessfully);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const deletedSuccessfully = await this.categoryService.deleteOneById(id);
    return updateDeleteResponse(deletedSuccessfully);
  }
}
