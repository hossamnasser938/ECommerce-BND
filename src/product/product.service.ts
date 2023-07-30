import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { CreateProductDTO } from './models/create-product.dto';
import { UpdateProductDTO } from './models/update-product.dto';
import { handleTypeORMUpdateDeleteResult } from 'src/utils/helper-functions';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRespository: Repository<Product>,
    @Inject(CategoryService) private categoryService: CategoryService,
  ) {}

  async findOneById(id: number): Promise<Product> {
    const product = await this.productRespository.findOneBy({ id });

    if (!product)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND(Product, 'id', id),
      );
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
    return this.productRespository.findBy({ category: { id: category.id } });
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
    return handleTypeORMUpdateDeleteResult({ result });
  }

  async deleteOneById(id: number) {
    const result = await this.productRespository.delete(id);
    return handleTypeORMUpdateDeleteResult({ result });
  }
}
