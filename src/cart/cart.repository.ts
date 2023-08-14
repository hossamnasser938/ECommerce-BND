import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from 'src/core/data-layer/mysql-typeorm/entities/cart-item.entity';
import { OrderEntity } from 'src/core/data-layer/mysql-typeorm/entities/order.entity';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { ProductRepository } from 'src/product/product.repository';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { IsNull, Repository } from 'typeorm';

import { ICartRepository } from './cart.repository.abstract';
import { CreateCartItemDTO } from './dtos/create-cart-item.dto';

@Injectable()
export class CartRepository
  extends MySQLTypeORMDataLayerRepository<CartItemEntity>
  implements ICartRepository<CartItemEntity>
{
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemEntityRepository: Repository<CartItemEntity>,
    @Inject('IProductRepository')
    private readonly productRepository: ProductRepository,
  ) {
    super(cartItemEntityRepository);
  }

  getUserInCartItems(userId: number): Promise<CartItemEntity[]> {
    return this.cartItemEntityRepository.findBy({
      user: { id: userId },
      order: IsNull(),
    });
  }

  getUserInCartItemByProduct(userId: number, productId: number) {
    return this.cartItemEntityRepository.findOneByOrFail({
      product: { id: productId },
      user: { id: userId },
      order: IsNull(),
    });
  }

  async createOne(
    createCartItemDTO: CreateCartItemDTO,
    user: UserEntity,
  ): Promise<CartItemEntity> {
    const { productId, amount } = createCartItemDTO;

    const product = await this.productRepository.getOneById(productId);

    const cartItem = new CartItemEntity(product, user, amount);

    return this.cartItemEntityRepository.save(cartItem);
  }

  async deleteAllUserInCartItems(userId: number): Promise<boolean> {
    const cartItems = await this.getUserInCartItems(userId);
    if (cartItems.length === 0)
      throw new NotFoundException(ERROR_MESSAGES.EMPTY_CART);

    const deleted = await this.deleteOneByCondition({
      user: { id: userId },
      order: IsNull(),
    });

    return deleted;
  }

  async updateUserInCartItemsWithOrder(order: OrderEntity, userId: number) {
    const result = await this.updateOneByCondition(
      { user: { id: userId }, order: IsNull() },
      { order },
    );
    // return handleTypeORMUpdateDeleteResult({ result, multipleEntities: true });
    // TODO: Ask Affan why orders are updated successfully here while result.affected = 0
    // I expect result.affected to match the number of cart items updated
    return !!result;
  }
}
