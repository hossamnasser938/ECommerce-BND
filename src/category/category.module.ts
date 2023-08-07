import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/core/data-layer/mysql-typeorm/entities/category.entity';

import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    CategoryService,
    { provide: 'ICategoryRepository', useClass: CategoryRepository },
  ],
  controllers: [CategoryController],
  exports: [CategoryService, 'ICategoryRepository'],
})
export class CategoryModule {}
