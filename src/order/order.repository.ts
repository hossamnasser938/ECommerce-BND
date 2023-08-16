import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CART_REPOSITORY_PROVIDER_TOKEN } from 'src/cart/cart.constants';
import { CartRepository } from 'src/cart/cart.repository';
import { OrderEntity } from 'src/core/data-layer/mysql-typeorm/entities/order.entity';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { SHIPPING_ADDRESS_REPOSITORY_PROVIDER_TOKEN } from 'src/shipping-address/shipping-address.constants';
import { ShippingAddressRepository } from 'src/shipping-address/shipping-address.repository';
import { Repository } from 'typeorm';

import { CreateOrderDTO } from './dtos/create-order.dto';
import { IOrderRepository } from './order.repository.abstract';

@Injectable()
export class OrderRepository
  extends MySQLTypeORMDataLayerRepository<OrderEntity>
  implements IOrderRepository<OrderEntity>
{
  constructor(
    @InjectRepository(OrderEntity)
    private readonly OrderEntityRepository: Repository<OrderEntity>,
    @Inject(SHIPPING_ADDRESS_REPOSITORY_PROVIDER_TOKEN)
    private readonly shippingAddressRepository: ShippingAddressRepository,
    @Inject(CART_REPOSITORY_PROVIDER_TOKEN)
    private readonly cartRepository: CartRepository,
  ) {
    super(OrderEntityRepository);
  }

  async createOne(
    createOrderDTO: CreateOrderDTO,
    user: UserEntity,
  ): Promise<OrderEntity> {
    const { shippingAddressId } = createOrderDTO;

    const shippingAddress = await this.shippingAddressRepository.getOneById(
      shippingAddressId,
    );

    const cartItems = await this.cartRepository.getUserInCartItems(user.id);

    const order = new OrderEntity(user, shippingAddress, cartItems);

    return this.OrderEntityRepository.save(order);
  }
}
