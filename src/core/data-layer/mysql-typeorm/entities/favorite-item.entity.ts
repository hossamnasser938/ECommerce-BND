import { IFavoriteItem } from 'src/core/entities/favorite-item.entity.abstract';
import { BaseEntity } from '../base-entity.abstract';
import { ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

export class FavoriteItemEntity extends BaseEntity implements IFavoriteItem {
  @ManyToOne(() => ProductEntity, (product) => product.favoriteItems, {
    eager: true,
  })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.favoriteItems, { eager: true })
  user: UserEntity;
}
