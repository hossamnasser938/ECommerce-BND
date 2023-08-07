import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { IShippingAddress } from 'src/core/entities/shipping-address.entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';

import { CreateShippingAddressDTO } from './dtos/create-shipping-address.dto';

export interface IShippingAddressRepositoy<T extends IShippingAddress>
  extends GenericRepository<T> {
  createOne(
    createShippingAddressDTO: CreateShippingAddressDTO,
    user: IUser,
  ): Promise<T>;
}
