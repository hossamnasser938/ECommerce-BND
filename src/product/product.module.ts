import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductEntity } from 'src/core/data-layer/mysql-typeorm/entities/product.entity';
import { ProductRepository } from './product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), CategoryModule],
  providers: [
    ProductService,
    { provide: 'IProductRepository', useClass: ProductRepository },
  ],
  controllers: [ProductController],
  exports: [ProductService, 'IProductRepository'],
})
export class ProductModule {}
