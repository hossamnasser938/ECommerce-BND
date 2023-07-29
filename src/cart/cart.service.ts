import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { DeleteResult, IsNull, Repository, UpdateResult } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { CreateCartItemDTO } from './models/create-cart-item.dto';
import { User } from 'src/user/user.entity';
import { checkTypeORMUpdateDeleteResult } from 'src/utils/helper-functions';
import { UserService } from 'src/user/user.service';
import { UpdateCartItemDTO } from './models/update-cart-item.dto';
import { Order } from 'src/order/order.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @Inject(ProductService) private productService: ProductService,
    @Inject(UserService) private userService: UserService,
  ) {}

  findAll() {
    return this.cartItemRepository.find();
  }

  findOneById(id: number) {
    return this.cartItemRepository.findOneBy({ id });
  }

  findUserAll(user: User) {
    return this.cartItemRepository.findBy({ user });
  }

  findUserInCartItems(user: User) {
    return this.cartItemRepository.findBy({ user, order: IsNull() });
  }

  async createOne(createCartItemDTO: CreateCartItemDTO, user: User) {
    const { productId, amount } = createCartItemDTO;

    const product = await this.productService.findOneById(productId);
    if (!product)
      throw new NotFoundException(`Product with id = ${productId} not found`);

    const potentialDuplicateCartItem = await this.cartItemRepository.findOneBy({
      product,
      user,
      order: IsNull(),
    });
    if (potentialDuplicateCartItem)
      throw new ConflictException(
        'Cart item already exists. You can update its amount',
      );

    if (amount > product.amount)
      throw new ForbiddenException(
        'Amount requested is not available in stock',
      );

    const cartItem = new CartItem();
    cartItem.product = product;
    cartItem.user = user;
    cartItem.amount = amount;

    return this.cartItemRepository.save(cartItem);
  }

  async updateOne(id: number, updateCartItemDTO: UpdateCartItemDTO) {
    if (updateCartItemDTO.amount) {
      const cartItem = await this.findOneById(id);
      if (updateCartItemDTO.amount > cartItem.product.amount)
        throw new ForbiddenException(
          'Amount requested is not available in stock',
        );
    }

    const result = await this.cartItemRepository.update(id, updateCartItemDTO);
    return checkTypeORMUpdateDeleteResult(result);
  }

  async updateAmount(
    id: number,
    user: User,
    operation: 'increment' | 'decrement',
  ) {
    const cartItem = await this.cartItemRepository.findOneBy({ id, user });

    if (!cartItem) throw new NotFoundException();

    const newAmount = cartItem.amount + (operation === 'increment' ? 1 : -1);

    if (newAmount > cartItem.product.amount)
      throw new ForbiddenException(
        'Amount requested is not available in stock',
      );

    let result: UpdateResult | DeleteResult;

    if (newAmount === 0) {
      result = await this.cartItemRepository.delete(id);
    } else {
      result = await this.cartItemRepository.update(id, {
        amount: newAmount,
      });
    }

    return checkTypeORMUpdateDeleteResult(result);
  }

  async deleteOne(id: number, user: User) {
    const result = await this.cartItemRepository.delete({ id, user });
    return checkTypeORMUpdateDeleteResult(result);
  }

  async deleteAllUserInCartItems(user: User) {
    const cartItems = await this.findUserInCartItems(user);
    if (cartItems.length === 0)
      throw new NotFoundException('User has empty cart');

    const result = await this.cartItemRepository.delete({
      user,
      order: IsNull(),
    });
    return checkTypeORMUpdateDeleteResult(result, true);
  }

  async updateUserInCartItemsWithOrder(order: Order, user: User) {
    const result = await this.cartItemRepository.update(
      { user, order: IsNull() },
      { order },
    );
    // return checkTypeORMUpdateDeleteResult(result, true);
    // TODO: Ask Affan why orders are updated successfully here while result.affected = 0
    // I expect result.affected to match the number of cart items updated
    return !!result;
  }
}
