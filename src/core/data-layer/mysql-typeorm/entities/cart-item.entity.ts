import { ICartItem } from 'src/core/entities/cart-item.entity.abstract';
import { BaseEntity } from '../base-entity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';
import { OrderEntity } from './order.entity';

@Entity()
export class CartItemEntity extends BaseEntity implements ICartItem {
  @ManyToOne(() => ProductEntity, (product) => product.cartItems, {
    eager: true,
  })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.cartItems)
  user: UserEntity;

  @ManyToOne(() => OrderEntity, (order) => order.cartItems)
  order: OrderEntity;

  @Column()
  amount: number;
}
