import { OrderEntity } from 'src/core/data-layer/mysql-typeorm/entities/order.entity';
import { IOrderRepository } from './order.repository.abstract';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { CreateOrderDTO } from './models/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShippingAddressRepository } from 'src/shipping-address/shipping-address.repository';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { CartRepository } from 'src/cart/cart.repository';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';

@Injectable()
export class OrderRepository
  extends MySQLTypeORMDataLayerRepository<OrderEntity>
  implements IOrderRepository<OrderEntity>
{
  constructor(
    @InjectRepository(OrderEntity)
    private readonly OrderEntityRepository: Repository<OrderEntity>,
    @Inject('IShippingAddressRepository')
    private readonly shippingAddressRepository: ShippingAddressRepository,
    @Inject('ICartRepository')
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
    if (!shippingAddress)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND(
          'ShippingAddress',
          'id',
          shippingAddressId,
        ),
      );

    const cartItems = await this.cartRepository.getUserInCartItems(user.id);

    const order = new OrderEntity(user, shippingAddress, cartItems);

    return this.OrderEntityRepository.save(order);
  }
}
