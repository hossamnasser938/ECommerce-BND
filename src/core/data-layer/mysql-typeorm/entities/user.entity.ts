import { Exclude } from 'class-transformer';
import { Role } from 'src/auth/auth.enums';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { CartItemEntity } from './cart-item.entity';
import { FavoriteItemEntity } from './favorite-item.entity';
import { NotificationEntity } from './notification.entity';
import { NotificationTokenEntity } from './notification-token.entity';
import { OrderEntity } from './order.entity';
import { PreferenceEntity } from './preference.entity';
import { ProfileEntity } from './profile.entity';
import { ShippingAddressEntity } from './shipping-address.entity';
import { VerificationCodeEntity } from './verification-code.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity implements IUser {
  constructor(
    email: string,
    password: string,
    roles: Role[],
    verified = false,
  ) {
    super();
    this.email = email;
    this.password = password;
    this.roles = JSON.stringify(roles);
    this.verified = verified;
    this.profile = new ProfileEntity();
    this.preference = new PreferenceEntity();
  }

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  roles: string;

  @Column()
  verified: boolean;

  @OneToOne(() => ProfileEntity, { eager: true, cascade: true })
  @JoinColumn()
  profile: ProfileEntity;

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

  @OneToMany(
    () => NotificationEntity,
    (notificationEntity) => notificationEntity.user,
  )
  notifications: NotificationEntity[];

  @OneToMany(
    () => NotificationTokenEntity,
    (notificationTokenEntity) => notificationTokenEntity.user,
  )
  notificationTokens: NotificationTokenEntity[];

  @OneToOne(() => PreferenceEntity, { cascade: true })
  @JoinColumn()
  preference: PreferenceEntity;
}
