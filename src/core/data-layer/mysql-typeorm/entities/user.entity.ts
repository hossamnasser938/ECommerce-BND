import { IUser } from 'src/core/entities/user.entity.abstract';
import { BaseEntity } from '../base-entity.abstract';
import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/auth/auth.enums';
import { CartItemEntity } from './cart-item.entity';
import { FavoriteItemEntity } from './favorite-item.entity';
import { VerificationCodeEntity } from './verification-code.entity';
import { ShippingAddressEntity } from './shipping-address.entity';
import { OrderEntity } from './order.entity';

@Entity()
export class UserEntity extends BaseEntity implements IUser {
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column()
  roles: Role[];

  @Column()
  verified: boolean;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.user)
  cartItems: CartItemEntity[];

  @OneToMany(() => FavoriteItemEntity, (favoriteItem) => favoriteItem.user)
  favoriteItems: FavoriteItemEntity[];

  @OneToMany(
    () => VerificationCodeEntity,
    (verificationCode) => verificationCode.user,
  )
  verificationCodes: VerificationCodeEntity[];

  @OneToMany(
    () => ShippingAddressEntity,
    (shippingAddress) => shippingAddress.user,
  )
  shippingAddresses: ShippingAddressEntity[];

  @OneToMany(() => OrderEntity, (order) => order.shippingAddress)
  orders: OrderEntity[];
}
