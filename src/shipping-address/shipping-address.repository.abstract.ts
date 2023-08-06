import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { IShippingAddress } from 'src/core/entities/shipping-address.entity.abstract';
import { CreateShippingAddressDTO } from './models/create-shipping-address.dto';
import { IUser } from 'src/core/entities/user.entity.abstract';

export interface IShippingAddressRepositoy<T extends IShippingAddress>
  extends GenericRepository<T> {
  createOne(
    createShippingAddressDTO: CreateShippingAddressDTO,
    user: IUser,
  ): Promise<T>;
}
