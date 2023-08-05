import { IOrder } from './order.entity.abstract';
import { IProduct } from './product.entity.abstract';
import { IUser } from './user.entity.abstract';

export interface ICartItem {
  product: IProduct;
  user: IUser;
  order: IOrder;
  amount: number;
}
