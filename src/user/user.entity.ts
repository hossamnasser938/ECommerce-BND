import { Exclude } from 'class-transformer';
import { VerificationCode } from 'src/auth/verification-code/verification-code.entity';
import { CartItem } from 'src/cart/cart-item.entity';
import { FavoriteItem } from 'src/favorite/favorite-item.entity';
import { Order } from 'src/order/order.entity';
import { ShippingAddress } from 'src/shipping-address/shipping-address.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column()
  roles: string;

  @Column()
  verified: boolean;

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => FavoriteItem, (favoriteItem) => favoriteItem.user)
  favoriteItems: FavoriteItem[];

  @OneToMany(
    () => VerificationCode,
    (verificationCode) => verificationCode.user,
  )
  verificationCodes: VerificationCode[];

  @OneToMany(() => ShippingAddress, (shippingAddress) => shippingAddress.user)
  shippingAddresses: ShippingAddress[];

  @OneToMany(() => Order, (order) => order.shippingAddress)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
