import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShippingAddressDTO } from './models/create-shipping-address.dto';
import { UpdateShippingAddressDTO } from './models/update-shipping-address.dto';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { IShippingAddressRepositoy } from './shipping-address.repository.abstract';
import { IShippingAddress } from 'src/core/entities/shipping-address.entity.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IUser } from 'src/core/entities/user.entity.abstract';

@Injectable()
export class ShippingAddressService {
  constructor(
    @Inject('IShippingAddressRepository')
    private readonly shippingAddressRepository: IShippingAddressRepositoy<IShippingAddress>,
  ) {}

  findAll() {
    return this.shippingAddressRepository.getAll();
  }

  findUserAll(userId: Identifier) {
    return this.shippingAddressRepository.getOneByCondition({
      user: { id: userId },
    });
  }

  async findOneById(id: Identifier) {
    const shippingAddress = await this.shippingAddressRepository.getOneById(id);
    if (!shippingAddress)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('ShippingAddress', 'id', id),
      );
    return shippingAddress;
  }

  createOne(createShippingAddressDTO: CreateShippingAddressDTO, user: IUser) {
    return this.shippingAddressRepository.createOne(
      createShippingAddressDTO,
      user,
    );
  }

  async updateOne(
    id: Identifier,
    updateShippingAddressDTO: UpdateShippingAddressDTO,
    userId: Identifier,
  ) {
    const updated = await this.shippingAddressRepository.updateOneByCondition(
      { id, user: { id: userId } },
      updateShippingAddressDTO,
    );
    return updated;
  }

  async deleteOne(id: Identifier, userId: Identifier) {
    const deleted = await this.shippingAddressRepository.deleteOneByCondition({
      id,
      user: { id: userId },
    });
    return deleted;
  }

  async setOneAsDefault(id: Identifier, userId: Identifier) {
    await this.resetDefault(userId);
    return this.updateOne(id, { isDefault: true }, userId);
  }

  resetDefault(userId: Identifier) {
    return this.shippingAddressRepository.updateOneByCondition(
      { user: { id: userId }, isDefault: true },
      { isDefault: false },
    );
  }
}
