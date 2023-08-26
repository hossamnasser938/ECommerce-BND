import { Exclude } from 'class-transformer';
import { IProduct } from 'src/core/entities/product.entity.abstract';
import {
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { CartItemEntity } from './cart-item.entity';
import { CategoryEntity } from './category.entity';
import { FavoriteItemEntity } from './favorite-item.entity';
import { FileEntity } from './file.entity';
import { VisualResourceEntity } from './visual-resource.entity';

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
    this.visualResource = new VisualResourceEntity();
  }

  @Index({ fulltext: true })
  @Column()
  name: string;

  @Index({ fulltext: true })
  @Column()
  description: string;

  @Column()
  amount: number;

  @Exclude()
  @OneToOne(() => VisualResourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  visualResource: VisualResourceEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
  })
  category: CategoryEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
  cartItems: CartItemEntity[];

  @OneToMany(() => FavoriteItemEntity, (favoriteItem) => favoriteItem.product)
  favoriteItems: FavoriteItemEntity[];

  images?: FileEntity[];

  @AfterLoad()
  hideVisualResource() {
    this.images = this.visualResource.images;
  }
}
