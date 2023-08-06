import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { ProductModule } from 'src/product/product.module';
import { FavoriteItemEntity } from 'src/core/data-layer/mysql-typeorm/entities/favorite-item.entity';
import { Favoriterepository } from './favorite.repository';

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
