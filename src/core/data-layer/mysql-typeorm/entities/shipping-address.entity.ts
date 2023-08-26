import { IShippingAddress } from 'src/core/entities/shipping-address.entity.abstract';
import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { AreaEntity } from './area.entity';
import { CityEntity } from './city.entity';
import { OrderEntity } from './order.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'shipping_address' })
export class ShippingAddressEntity
  extends BaseEntity
  implements IShippingAddress
{
  constructor(
    area: AreaEntity,
    street: string,
    building: number,
    apartment: number,
    user: UserEntity,
    isDefault = false,
  ) {
    super();
    this.area = area;
    this.street = street;
    this.building = building;
    this.apartment = apartment;
    this.user = user;
    this.isDefault = isDefault;
  }

  city: CityEntity;

  @ManyToOne(() => AreaEntity, (areaEntity) => areaEntity.shippingAddresses, {
    eager: true,
  })
  area: AreaEntity;

  @Column()
  street: string;

  @Column()
  building: number;

  @Column()
  apartment: number;

  @Column()
  isDefault: boolean;

  @ManyToOne(() => UserEntity, (user) => user.shippingAddresses)
  user: UserEntity;

  @OneToMany(() => OrderEntity, (order) => order.shippingAddress)
  orders: OrderEntity[];

  @AfterLoad()
  setCity() {
    // TODO: discuss with Affan
    // implementation delegated to shipping address repositoy
  }
}
