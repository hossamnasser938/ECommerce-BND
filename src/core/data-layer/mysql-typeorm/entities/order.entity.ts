import { IOrder } from 'src/core/entities/order.entity.abstract';
import { BaseEntity } from '../base-entity.abstract';
import { JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ShippingAddressEntity } from './shipping-address.entity';
import { CartItemEntity } from './cart-item.entity';
import { UserEntity } from './user.entity';

export class OrderEntity extends BaseEntity implements IOrder {
  @ManyToOne(
    () => ShippingAddressEntity,
    (shippingAddress) => shippingAddress.orders,
    {
      eager: true,
    },
  )
  @JoinColumn()
  shippingAddress: ShippingAddressEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.order, {
    eager: true,
  })
  cartItems: CartItemEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders, { eager: true })
  user: UserEntity;
}
