import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { FileService } from 'src/file/file.service';
import { IMAGES_VALIDATORS } from 'src/multer-wrapper/multer-wrapper.constants';
import { updateDeleteResponse } from 'src/utils/helper-functions';

import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
    @Inject(FileService) private readonly fileService: FileService,
  ) {}

  @Get()
  findAll(@Query() paginationParametersDTO: PaginationParamsDTO) {
    return this.categoryService.findAll(paginationParametersDTO);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
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

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @UseInterceptors(FilesInterceptor('images'))
  @Post(':id/add-images')
  async addImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles(
      new ParseFilePipe({
        validators: IMAGES_VALIDATORS,
      }),
    )
    images: Express.Multer.File[],
  ) {
    const imagesNames = images.map((image) => image.filename);
    return this.categoryService.addImages(id, imagesNames);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Delete('delete-image/:id')
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteImage(id);
  }
}
