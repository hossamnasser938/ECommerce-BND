import { IProduct } from 'src/core/entities/product.entity.abstract';
import { BaseEntity } from '../base-entity.abstract';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CartItemEntity } from './cart-item.entity';
import { FavoriteItemEntity } from './favorite-item.entity';

@Entity({ name: 'product' })
export class ProductEntity extends BaseEntity implements IProduct {
  constructor(
    name: string,
    description: string,
    amount: number,
    category: CategoryEntity,
  ) {
    super();
    this.name = name;
    this.description = description;
    this.amount = amount;
    this.category = category;
  }

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
  })
  category: CategoryEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
  cartItems: CartItemEntity[];

  @OneToMany(() => FavoriteItemEntity, (favoriteItem) => favoriteItem.product)
  favoriteItems: FavoriteItemEntity[];
}
