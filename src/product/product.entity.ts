import { CartItem } from 'src/cart/cart-item.entity';
import { Category } from 'src/category/category.entity';
import { FavoriteItem } from 'src/favorite/favorite-item.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => FavoriteItem, (favoriteItem) => favoriteItem.product)
  favoriteItems: FavoriteItem[];
}
