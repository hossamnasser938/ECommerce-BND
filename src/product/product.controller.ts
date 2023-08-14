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
import { updateDeleteResponse } from 'src/utils/helper-functions';

import { CreateProductDTO } from './dtos/create-product.dto';
import { FindCategoryProducts } from './dtos/find-category-products.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(
    @Inject(ProductService) private readonly productService: ProductService,
  ) {}

  @Get()
  findAll(@Query() paginationParametersDTO: PaginationParamsDTO) {
    return this.productService.findAll(paginationParametersDTO);
  }

  @Get('category')
  findAllForCategory(@Query() findCategoryProducts: FindCategoryProducts) {
    const { categoryId, ...paginationParametersDTO } = findCategoryProducts;

    return this.productService.findCategoryProducts(
      categoryId,
      paginationParametersDTO,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOneById(id);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Post()
  createOne(@Body() createProductDTO: CreateProductDTO) {
    return this.productService.createOne(createProductDTO);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Put(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDTO: UpdateProductDTO,
  ) {
    const successfullyUpdated = await this.productService.updateOneById(
      id,
      updateProductDTO,
    );
    return updateDeleteResponse(successfullyUpdated);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const successfullyDeleted = await this.productService.deleteOneById(id);
    return updateDeleteResponse(successfullyDeleted);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @UseInterceptors(FilesInterceptor('images'))
  @Post(':id/add-images')
  addImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const imagesNames = images.map((image) => image.filename);
    return this.productService.addImages(id, imagesNames);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Delete('delete-image/:id')
  deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteImage(id);
  }
}
