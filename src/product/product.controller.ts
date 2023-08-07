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
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { updateDeleteResponse } from 'src/utils/helper-functions';

import { CreateProductDTO } from './dtos/create-product.dto';
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
  findAllForCategory(
    @Query('categoryId', ParseIntPipe) categoryId: number,
    @Query() paginationParametersDTO: PaginationParamsDTO,
  ) {
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
}
