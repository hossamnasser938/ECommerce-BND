import { IFavoriteItem } from 'src/core/entities/favorite-item.entity.abstract';
import { Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'favorite_item' })
export class FavoriteItemEntity extends BaseEntity implements IFavoriteItem {
  constructor(product: ProductEntity, user: UserEntity) {
    super();
    this.product = product;
    this.user = user;
  }

  @ManyToOne(() => ProductEntity, (product) => product.favoriteItems, {
    eager: true,
  })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.favoriteItems, { eager: true })
  user: UserEntity;
}
