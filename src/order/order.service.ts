import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IOrder } from 'src/core/entities/order.entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

import { CreateOrderDTO } from './dtos/create-order.dto';
import { IOrderRepository } from './order.repository.abstract';

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
