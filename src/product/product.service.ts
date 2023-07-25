import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { CreateProductDTO } from './models/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRespository: Repository<Product>,
    @Inject(CategoryService) private categoryService: CategoryService,
  ) {}

  findOneById(id: number): Promise<Product> {
    return this.productRespository.findOneBy({ id });
  }

  findAll() {
    return this.productRespository.find();
  }

  async findCategoryProducts(categoryId: number): Promise<Product[]> {
    const category = await this.categoryService.findOneById(categoryId);
    if (!category) {
      return [];
    }
    return this.productRespository.findBy({ category });
  }

  async createOne(createProductDTO: CreateProductDTO) {
    const { name, description, amount, categoryId } = createProductDTO;

    const category = await this.categoryService.findOneById(categoryId);

    const product = new Product();
    product.name = name;
    product.description = description;
    product.amount = amount;
    product.category = category;

    return this.productRespository.save(product);
  }
}
