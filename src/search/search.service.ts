import { Inject, Injectable } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class SearchService {
  constructor(
    @Inject(CategoryService) private readonly categoryService: CategoryService,
    @Inject(ProductService) private readonly productService: ProductService,
  ) {}

  async search(keyword: string) {
    const categories = await this.categoryService.search(keyword);
    const products = await this.productService.search(keyword);
    return { categories, products };
  }
}
