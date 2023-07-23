import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';

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

  @Post()
  createOne(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('amount', ParseIntPipe) amount: number,
    @Body('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productService.createOne(name, description, amount, categoryId);
  }
}