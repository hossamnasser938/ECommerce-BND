import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingAddressEntity } from 'src/core/data-layer/mysql-typeorm/entities/shipping-address.entity';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { CreateShippingAddressDTO } from './models/create-shipping-address.dto';
import { IShippingAddressRepositoy } from './shipping-address.repository.abstract';

@Injectable()
export class ShippingAddressRepository
  extends MySQLTypeORMDataLayerRepository<ShippingAddressEntity>
  implements IShippingAddressRepositoy<ShippingAddressEntity>
{
  constructor(
    @InjectRepository(ShippingAddressEntity)
    private readonly shippingAddressEntityRepo: Repository<ShippingAddressEntity>,
  ) {
    super(shippingAddressEntityRepo);
  }

  async createOne(
    createShippingAddressDTO: CreateShippingAddressDTO,
    user: UserEntity,
  ): Promise<ShippingAddressEntity> {
    const { city, area, street, building, apartment, isDefault } =
      createShippingAddressDTO;

    const shippingAddress = new ShippingAddressEntity(
      city,
      area,
      street,
      building,
      apartment,
      user,
      isDefault,
    );

    return this.shippingAddressEntityRepo.save(shippingAddress);
  }
}
