import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IOrder } from 'src/core/entities/order.entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { NotificationService } from 'src/notification/notification.service';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

import { CreateOrderDTO } from './dtos/create-order.dto';
import { UpdateOrderStatusDTO } from './dtos/update-order-status.dto';
import { ORDER_REPOSITORY_PROVIDER_TOKEN } from './order.constants';
import { IOrderRepository } from './order.repository.abstract';
import { ORDER_STATUS_NOTIFICATION_MAPPER } from './order-notification-messages';
import { orderTrackingStateMachineService } from './order-tracking.state-machie';
import { OrderStatus } from './types';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY_PROVIDER_TOKEN)
    private readonly orderRepository: IOrderRepository<IOrder>,
    @Inject(CartService)
    private readonly cartService: CartService,
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
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

  async updateOrderStatus(
    id: Identifier,
    updateOrderStatusDTO: UpdateOrderStatusDTO,
  ) {
    const order = await this.orderRepository.getOneById(id);

    orderTrackingStateMachineService.stop();
    orderTrackingStateMachineService.start(order.status);

    const isTransitionValid = orderTrackingStateMachineService
      .getSnapshot()
      .can(updateOrderStatusDTO.transition);

    if (!isTransitionValid) {
      throw new BadRequestException(
        ERROR_MESSAGES.INVALID_ORDER_STATUS_TRANSITION,
      );
    }

    orderTrackingStateMachineService.send({
      type: updateOrderStatusDTO.transition,
    });

    const newOrderStatus = orderTrackingStateMachineService.getSnapshot()
      .value as OrderStatus;

    const result = await this.orderRepository.updateOneById(id, {
      status: newOrderStatus,
    });

    const notificationData = ORDER_STATUS_NOTIFICATION_MAPPER[newOrderStatus];
    try {
      await this.notificationService.createAndSendOne(
        notificationData.title,
        notificationData.body,
        order.user,
      );
    } catch (err) {
      console.log('failed to send push notification for order', order);
    }

    return !!result;
  }

  async deleteOne(id: Identifier) {
    const deleted = await this.orderRepository.deleteOneById(id);
    return deleted;
  }
}
