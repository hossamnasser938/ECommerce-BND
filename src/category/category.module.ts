import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/core/data-layer/mysql-typeorm/entities/category.entity';
import { FileModule } from 'src/file/file.module';

import { CATEGORY_REPOSITORY_PROVIDER_TOKEN } from './category.constants';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), FileModule],
  providers: [
    CategoryService,
    {
      provide: CATEGORY_REPOSITORY_PROVIDER_TOKEN,
      useClass: CategoryRepository,
    },
  ],
  controllers: [CategoryController],
  exports: [CategoryService, CATEGORY_REPOSITORY_PROVIDER_TOKEN],
})
export class CategoryModule {}
