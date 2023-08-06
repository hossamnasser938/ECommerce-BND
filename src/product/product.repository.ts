import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { IProductRepository } from './product.repository.abstract';
import { ProductEntity } from 'src/core/data-layer/mysql-typeorm/entities/product.entity';
import { CreateProductDTO } from './models/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/category/category.repository';

@Injectable()
export class ProductRepository
  extends MySQLTypeORMDataLayerRepository<ProductEntity>
  implements IProductRepository<ProductEntity>
{
  constructor(
    @InjectRepository(ProductEntity)
    private productEntityRepository: Repository<ProductEntity>,
    @Inject('ICategoryRepository')
    private categoryRepository: CategoryRepository,
  ) {
    super(productEntityRepository);
  }
  async getCategoryProducts(categoryId: number): Promise<ProductEntity[]> {
    const category = await this.categoryRepository.getOneById(categoryId);
    if (!category) {
      return [];
    }
    return this.productEntityRepository.findBy({
      category: { id: category.id },
    });
  }

  async createOne(createProductDTO: CreateProductDTO): Promise<ProductEntity> {
    const { name, description, amount, categoryId } = createProductDTO;

    const category = await this.categoryRepository.getOneById(categoryId);

    const product = new ProductEntity(name, description, amount, category);

    return this.productEntityRepository.save(product);
  }
}
