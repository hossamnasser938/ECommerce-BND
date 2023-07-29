import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CreateOrderDTO } from './models/create-order.dto';
import { ShippingAddressService } from 'src/shipping-address/shipping-address.service';
import { CartService } from 'src/cart/cart.service';
import { checkTypeORMUpdateDeleteResult } from 'src/utils/helper-functions';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @Inject(ShippingAddressService)
    private shippingAddressService: ShippingAddressService,
    @Inject(CartService) private cartService: CartService,
  ) {}

  findAll() {
    return this.orderRepository.find();
  }

  findUserAll(user: User) {
    return this.orderRepository.findBy({ user: { id: user.id } });
  }

  async findOneById(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException();
    return order;
  }

  async createOne(createOrderDTO: CreateOrderDTO, user: User) {
    const { shippingAddressId } = createOrderDTO;

    const shippingAddress = await this.shippingAddressService.findOneById(
      shippingAddressId,
    );
    if (!shippingAddress)
      throw new NotFoundException(
        `No shipping address with id = ${shippingAddressId}`,
      );

    const cartItems = await this.cartService.findUserInCartItems(user);
    if (!cartItems.length) throw new NotFoundException('User has empty cart');

    const order = new Order();
    order.user = user;
    order.shippingAddress = shippingAddress;
    order.cartItems = cartItems;

    const orderSaved = await this.orderRepository.save(order);

    await this.cartService.updateUserInCartItemsWithOrder(orderSaved, user);

    return orderSaved;
  }

  async deleteOne(id: number) {
    const result = await this.orderRepository.delete(id);
    return checkTypeORMUpdateDeleteResult(result);
  }
}
