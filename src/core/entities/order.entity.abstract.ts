import { ICartItem } from './cart-item.entity.abstract';
import { IShippingAddress } from './shipping-address.entity.abstract';
import { IUser } from './user.entity.abstract';

export interface IOrder {
  shippingAddress: IShippingAddress;
  cartItems: ICartItem[];
  user: IUser;
}
