import { BaseEntity } from './base-entity.abstract';
import { IProduct } from './product.entity.abstract';
import { IUser } from './user.entity.abstract';

export interface IFavoriteItem extends BaseEntity {
  product: IProduct;
  user: IUser;
}
