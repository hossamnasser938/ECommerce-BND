import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryEntity } from 'src/core/data-layer/mysql-typeorm/entities/category.entity';
import { CategoryRepository } from './category.repository';

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
