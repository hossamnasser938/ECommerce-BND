import { ShippingAddressEntity } from 'src/core/data-layer/mysql-typeorm/entities/shipping-address.entity';
import { IShippingAddressRepositoy } from './shipping-address.repository.abstract';
import { CreateShippingAddressDTO } from './models/create-shipping-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';

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