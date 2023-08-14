import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/core/data-layer/mysql-typeorm/entities/category.entity';
import { FileModule } from 'src/file/file.module';
import { FSWrapperModule } from 'src/fs-wrapper/fs-wrapper.module';

import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    FileModule,
    FSWrapperModule,
  ],
  providers: [
    CategoryService,
    { provide: 'ICategoryRepository', useClass: CategoryRepository },
  ],
  controllers: [CategoryController],
  exports: [CategoryService, 'ICategoryRepository'],
})
export class CategoryModule {}
