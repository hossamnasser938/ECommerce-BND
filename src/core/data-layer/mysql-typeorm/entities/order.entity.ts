import { IOrder } from 'src/core/entities/order.entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { orderTrackingStateMachine } from '../../../../order/order-tracking.state-machie';
import { OrderStatus } from '../../../../order/types';
import { BaseEntity } from '../base-entity.abstract';
import { CartItemEntity } from './cart-item.entity';
import { ShippingAddressEntity } from './shipping-address.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'order' })
export class OrderEntity extends BaseEntity implements IOrder {
  constructor(
    user: UserEntity,
    shippingAddress: ShippingAddressEntity,
    cartItems: CartItemEntity[],
  ) {
    super();
    this.status = orderTrackingStateMachine.initial as OrderStatus;
    this.user = user;
    this.shippingAddress = shippingAddress;
    this.cartItems = cartItems;
  }

  @Column({ enum: OrderStatus })
  status: OrderStatus;

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
