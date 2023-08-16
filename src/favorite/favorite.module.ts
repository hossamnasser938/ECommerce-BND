import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteItemEntity } from 'src/core/data-layer/mysql-typeorm/entities/favorite-item.entity';
import { ProductModule } from 'src/product/product.module';

import { FAVORITE_REPOSITORY_PROVIDER_TOKEN } from './favorite.constants';
import { FavoriteController } from './favorite.controller';
import { Favoriterepository } from './favorite.repository';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteItemEntity]), ProductModule],
  providers: [
    FavoriteService,
    {
      provide: FAVORITE_REPOSITORY_PROVIDER_TOKEN,
      useClass: Favoriterepository,
    },
  ],
  controllers: [FavoriteController],
  exports: [FavoriteService, FAVORITE_REPOSITORY_PROVIDER_TOKEN],
})
export class FavoriteModule {}
