import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({})
export class FavoriteItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.favoriteItems, { eager: true })
  product: Product;

  @ManyToOne(() => User, (user) => user.favoriteItems, { eager: true })
  user: User;
}
