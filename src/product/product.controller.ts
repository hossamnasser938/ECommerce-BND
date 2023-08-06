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
import { ProductService } from './product.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { CreateProductDTO } from './models/create-product.dto';
import { UpdateProductDTO } from './models/update-product.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';

@Controller('products')
export class ProductController {
  constructor(@Inject(ProductService) private productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('category')
  findAllForCategory(@Query('categoryId', ParseIntPipe) categoryId?: number) {
    return this.productService.findCategoryProducts(categoryId);
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
