import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteItemEntity } from 'src/core/data-layer/mysql-typeorm/entities/favorite-item.entity';
import { ProductModule } from 'src/product/product.module';

import { FavoriteController } from './favorite.controller';
import { Favoriterepository } from './favorite.repository';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteItemEntity]), ProductModule],
  providers: [
    FavoriteService,
    { provide: 'IFavoriteRepository', useClass: Favoriterepository },
  ],
  controllers: [FavoriteController],
  exports: [FavoriteService, 'IFavoriteRepository'],
})
export class FavoriteModule {}
