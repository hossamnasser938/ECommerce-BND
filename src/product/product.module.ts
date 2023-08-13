import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { ProductEntity } from 'src/core/data-layer/mysql-typeorm/entities/product.entity';
import { FileModule } from 'src/file/file.module';

import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    CategoryModule,
    FileModule,
  ],
  providers: [
    ProductService,
    { provide: 'IProductRepository', useClass: ProductRepository },
  ],
  controllers: [ProductController],
  exports: [ProductService, 'IProductRepository'],
})
export class ProductModule {}
