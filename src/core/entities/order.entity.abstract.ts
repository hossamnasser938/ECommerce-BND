import { OrderStatus } from 'src/order/types';

import { BaseEntity } from './base-entity.abstract';
import { ICartItem } from './cart-item.entity.abstract';
import { IShippingAddress } from './shipping-address.entity.abstract';
import { IUser } from './user.entity.abstract';

export interface IOrder extends BaseEntity {
  status: OrderStatus;
  shippingAddress: IShippingAddress;
  cartItems: ICartItem[];
  user: IUser;
}
