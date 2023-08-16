import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { ProductEntity } from 'src/core/data-layer/mysql-typeorm/entities/product.entity';
import { FileModule } from 'src/file/file.module';
import { FileStorageModule } from 'src/file-storage/file-storage-module';

import { PRODUCT_REPOSITORY_PROVIDER_TOKEN } from './product.constants';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    CategoryModule,
    FileModule,
    FileStorageModule,
  ],
  providers: [
    ProductService,
    { provide: PRODUCT_REPOSITORY_PROVIDER_TOKEN, useClass: ProductRepository },
  ],
  controllers: [ProductController],
  exports: [ProductService, PRODUCT_REPOSITORY_PROVIDER_TOKEN],
})
export class ProductModule {}
