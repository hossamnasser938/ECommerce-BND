import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({})
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.cartItems, { eager: true })
  product: Product;

  @ManyToOne(() => User, (user) => user.cartItems)
  user: User;

  @Column()
  amount: number;
}
