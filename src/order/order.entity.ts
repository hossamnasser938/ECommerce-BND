import { CartItem } from 'src/cart/cart-item.entity';
import { ShippingAddress } from 'src/shipping-address/shipping-address.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ShippingAddress,
    (shippingAddress) => shippingAddress.orders,
    {
      eager: true,
    },
  )
  @JoinColumn()
  shippingAddress: ShippingAddress;

  @OneToMany(() => CartItem, (cartItem) => cartItem.order, { eager: true })
  cartItems: CartItem[];

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  user: User;
}
