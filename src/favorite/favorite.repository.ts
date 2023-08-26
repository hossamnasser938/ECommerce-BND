import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteItemEntity } from 'src/core/data-layer/mysql-typeorm/entities/favorite-item.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { PRODUCT_REPOSITORY_PROVIDER_TOKEN } from 'src/product/product.constants';
import { ProductRepository } from 'src/product/product.repository';
import { USER_REPOSITORY_PROVIDER_TOKEN } from 'src/user/user.constants';
import { UserRepository } from 'src/user/user.repository';
import { Repository } from 'typeorm';

import { FavoriteDTO } from './dtos/favorite.dto';
import { IFavoriteRepository } from './favorite.repository.abstract';

@Injectable()
export class Favoriterepository
  extends MySQLTypeORMDataLayerRepository<FavoriteItemEntity>
  implements IFavoriteRepository<FavoriteItemEntity>
{
  constructor(
    @InjectRepository(FavoriteItemEntity)
    private readonly favoriteItemEntityRepository: Repository<FavoriteItemEntity>,
    @Inject(PRODUCT_REPOSITORY_PROVIDER_TOKEN)
    private readonly productRepository: ProductRepository,
    @Inject(USER_REPOSITORY_PROVIDER_TOKEN)
    private readonly userRepository: UserRepository,
  ) {
    super(favoriteItemEntityRepository);
  }

  async createOne(
    favoriteDTO: FavoriteDTO,
    userId: number,
  ): Promise<FavoriteItemEntity> {
    const { productId } = favoriteDTO;

    const product = await this.productRepository.getOneById(productId);
    const user = await this.userRepository.getOneById(userId);

    const favoriteItem = new FavoriteItemEntity(product, user);

    return this.favoriteItemEntityRepository.save(favoriteItem);
  }
}
