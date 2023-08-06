import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { IFavoriteRepository } from './favorite.repository.abstract';
import { FavoriteItemEntity } from 'src/core/data-layer/mysql-typeorm/entities/favorite-item.entity';
import { FavoriteDTO } from './models/favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/product/product.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class Favoriterepository
  extends MySQLTypeORMDataLayerRepository<FavoriteItemEntity>
  implements IFavoriteRepository<FavoriteItemEntity>
{
  constructor(
    @InjectRepository(FavoriteItemEntity)
    private readonly favoriteItemEntityRepository: Repository<FavoriteItemEntity>,
    @Inject('IProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('IUserRepository') private readonly userRepository: UserRepository,
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
