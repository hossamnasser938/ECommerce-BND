import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { CreateProductDTO } from './models/create-product.dto';
import { UpdateProductDTO } from './models/update-product.dto';
import { checkTypeORMUpdateDeleteResult } from 'src/utils/helper-functions';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRespository: Repository<Product>,
    @Inject(CategoryService) private categoryService: CategoryService,
  ) {}

  async findOneById(id: number): Promise<Product> {
    const product = await this.productRespository.findOneBy({ id });

    if (!product) throw new NotFoundException();
    return product;
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

  async updateOneById(id: number, updateProductDTO: UpdateProductDTO) {
    const result = await this.productRespository.update(id, updateProductDTO);
    return checkTypeORMUpdateDeleteResult(result);
  }

  async deleteOneById(id: number) {
    const result = await this.productRespository.delete(id);
    return checkTypeORMUpdateDeleteResult(result);
  }
}
