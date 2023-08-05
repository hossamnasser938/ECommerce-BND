import { IShippingAddress } from 'src/core/entities/shipping-address.entity.abstract';
import { BaseEntity } from '../base-entity.abstract';
import { Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { OrderEntity } from './order.entity';

export class ShippingAddressEntity
  extends BaseEntity
  implements IShippingAddress
{
  @Column()
  city: string;

  @Column()
  area: string;

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
}
