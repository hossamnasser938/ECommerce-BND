import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { ICartItem } from 'src/core/entities/cart-item.entity.abstract';
import { CreateCartItemDTO } from './models/create-cart-item.dto';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IOrder } from 'src/core/entities/order.entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';

export interface ICartRepository<T extends ICartItem>
  extends GenericRepository<T> {
  getUserInCartItems(userId: Identifier): Promise<T[]>;
  getUserInCartItemByProduct(
    userId: Identifier,
    productId: Identifier,
  ): Promise<T>;
  createOne(createCartItemDTO: CreateCartItemDTO, user: IUser): Promise<T>;
  deleteAllUserInCartItems(userId: Identifier): Promise<boolean>;
  updateUserInCartItemsWithOrder(order: IOrder, userId: Identifier);
}
