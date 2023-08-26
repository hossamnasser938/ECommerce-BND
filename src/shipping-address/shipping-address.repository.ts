import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingAddressEntity } from 'src/core/data-layer/mysql-typeorm/entities/shipping-address.entity';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { AREA_REPOSITORY_PROVIDER_TOKEN } from './area/area.constants';
import { AreaRepository } from './area/area.repository';
import { CreateShippingAddressDTO } from './dtos/create-shipping-address.dto';
import { IShippingAddressRepositoy } from './shipping-address.repository.abstract';

@Injectable()
export class ShippingAddressRepository
  extends MySQLTypeORMDataLayerRepository<ShippingAddressEntity>
  implements IShippingAddressRepositoy<ShippingAddressEntity>
{
  constructor(
    @InjectRepository(ShippingAddressEntity)
    private readonly shippingAddressEntityRepo: Repository<ShippingAddressEntity>,
    @Inject(AREA_REPOSITORY_PROVIDER_TOKEN)
    private readonly areaRespository: AreaRepository,
  ) {
    super(shippingAddressEntityRepo);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const shippingAddressRepositoryInstance = this;
    ShippingAddressEntity.prototype.setCity = async function () {
      const area =
        await shippingAddressRepositoryInstance.areaRespository.getOneById(
          (this as ShippingAddressEntity).area.id,
        );
      const city = area.city;
      delete city.areas;
      (this as ShippingAddressEntity).city = city;
    };
  }

  async createOne(
    createShippingAddressDTO: CreateShippingAddressDTO,
    user: UserEntity,
  ): Promise<ShippingAddressEntity> {
    const { areaId, street, building, apartment, isDefault } =
      createShippingAddressDTO;

    const area = await this.areaRespository.getOneById(areaId);

    const shippingAddress = new ShippingAddressEntity(
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
