import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { IOrder } from 'src/core/entities/order.entity.abstract';
import { CreateOrderDTO } from './models/create-order.dto';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IUser } from 'src/core/entities/user.entity.abstract';

export interface IOrderRepository<T extends IOrder>
  extends GenericRepository<T> {
  createOne(createOrderDTO: CreateOrderDTO, user: IUser): Promise<T>;
}
