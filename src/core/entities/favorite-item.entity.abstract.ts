import { IProduct } from './product.entity.abstract';
import { IUser } from './user.entity.abstract';

export interface IFavoriteItem {
  product: IProduct;
  user: IUser;
}
