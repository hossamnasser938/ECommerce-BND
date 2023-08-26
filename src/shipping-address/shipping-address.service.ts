import { Inject, Injectable } from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IShippingAddress } from 'src/core/entities/shipping-address.entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';

import { CreateShippingAddressDTO } from './dtos/create-shipping-address.dto';
import { UpdateShippingAddressDTO } from './dtos/update-shipping-address.dto';
import { SHIPPING_ADDRESS_REPOSITORY_PROVIDER_TOKEN } from './shipping-address.constants';
import { IShippingAddressRepositoy } from './shipping-address.repository.abstract';

@Injectable()
export class ShippingAddressService {
  constructor(
    @Inject(SHIPPING_ADDRESS_REPOSITORY_PROVIDER_TOKEN)
    private readonly shippingAddressRepository: IShippingAddressRepositoy<IShippingAddress>,
  ) {}

  findAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.shippingAddressRepository.getAll(paginationParametersDTO);
  }

  findUserAll(
    userId: Identifier,
    paginationParametersDTO: PaginationParamsDTO,
  ) {
    return this.shippingAddressRepository.getAllByCondition(
      paginationParametersDTO,
      {
        user: { id: userId },
      },
    );
  }

  async findOneById(id: Identifier) {
    const shippingAddress = await this.shippingAddressRepository.getOneById(id);
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
