import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDTO } from './models/create-order.dto';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { IOrderRepository } from './order.repository.abstract';
import { IOrder } from 'src/core/entities/order.entity.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { CartService } from 'src/cart/cart.service';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository<IOrder>,
    @Inject(CartService)
    private readonly cartService: CartService,
  ) {}

  findAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.orderRepository.getAll(paginationParametersDTO);
  }

  findUserAll(
    userId: Identifier,
    paginationParametersDTO: PaginationParamsDTO,
  ) {
    return this.orderRepository.getAllByCondition(paginationParametersDTO, {
      user: { id: userId },
    });
  }

  async findOneById(id: Identifier) {
    const order = await this.orderRepository.getOneById(id);
    if (!order)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('Order', 'id', id),
      );
    return order;
  }

  async createOne(createOrderDTO: CreateOrderDTO, user: IUser) {
    const cartItems = await this.cartService.findUserInCartItems(user.id);
    if (!cartItems.length)
      throw new NotFoundException(ERROR_MESSAGES.EMPTY_CART);

    const orderSaved = await this.orderRepository.createOne(
      createOrderDTO,
      user,
    );

    await this.cartService.updateUserInCartItemsWithOrder(orderSaved, user.id);

    return orderSaved;
  }

  async deleteOne(id: Identifier) {
    const deleted = await this.orderRepository.deleteOneById(id);
    return deleted;
  }
}
