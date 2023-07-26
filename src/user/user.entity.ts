import { Exclude } from 'class-transformer';
import { CartItem } from 'src/cart/cart-item.entity';
import { FavoriteItem } from 'src/favorite/favorite-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => FavoriteItem, (favoriteItem) => favoriteItem.user)
  favoriteItems: FavoriteItem[];
}
