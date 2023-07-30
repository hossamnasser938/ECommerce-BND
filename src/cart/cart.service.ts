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
import { handleTypeORMUpdateDeleteResult } from 'src/utils/helper-functions';
import { UserService } from 'src/user/user.service';
import { UpdateCartItemDTO } from './models/update-cart-item.dto';
import { Order } from 'src/order/order.entity';
import { UpdateCartItemAmountOperation } from './models/cart.enums';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { Product } from 'src/product/product.entity';

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
    return this.cartItemRepository.findBy({ user: { id: user.id } });
  }

  findUserInCartItems(user: User) {
    return this.cartItemRepository.findBy({
      user: { id: user.id },
      order: IsNull(),
    });
  }

  async createOne(createCartItemDTO: CreateCartItemDTO, user: User) {
    const { productId, amount } = createCartItemDTO;

    const product = await this.productService.findOneById(productId);
    if (!product)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND(Product, 'id', productId),
      );

    const potentialDuplicateCartItem = await this.cartItemRepository.findOneBy({
      product: { id: product.id },
      user: { id: user.id },
      order: IsNull(),
    });
    if (potentialDuplicateCartItem)
      throw new ConflictException(ERROR_MESSAGES.CART_ITEM_EXIST);

    if (amount > product.amount)
      throw new ForbiddenException(ERROR_MESSAGES.AMOUNT_NOT_AVAILABLE);

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
        throw new ForbiddenException(ERROR_MESSAGES.AMOUNT_NOT_AVAILABLE);
    }

    const result = await this.cartItemRepository.update(id, updateCartItemDTO);
    return handleTypeORMUpdateDeleteResult({ result });
  }

  async updateAmount(
    id: number,
    user: User,
    operation: UpdateCartItemAmountOperation,
  ) {
    const cartItem = await this.cartItemRepository.findOneBy({
      id,
      user: { id: user.id },
    });

    if (!cartItem)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND(CartItem, 'id', id),
      );

    const newAmount =
      cartItem.amount +
      (operation === UpdateCartItemAmountOperation.INCREMENT ? 1 : -1);

    if (newAmount > cartItem.product.amount)
      throw new ForbiddenException(ERROR_MESSAGES.AMOUNT_NOT_AVAILABLE);

    let result: UpdateResult | DeleteResult;

    if (newAmount === 0) {
      result = await this.cartItemRepository.delete(id);
    } else {
      result = await this.cartItemRepository.update(id, {
        amount: newAmount,
      });
    }

    return handleTypeORMUpdateDeleteResult({ result });
  }

  async deleteOne(id: number, user: User) {
    const result = await this.cartItemRepository.delete({ id, user });
    return handleTypeORMUpdateDeleteResult({ result });
  }

  async deleteAllUserInCartItems(user: User) {
    const cartItems = await this.findUserInCartItems(user);
    if (cartItems.length === 0)
      throw new NotFoundException(ERROR_MESSAGES.EMPTY_CART);

    const result = await this.cartItemRepository.delete({
      user,
      order: IsNull(),
    });
    return handleTypeORMUpdateDeleteResult({ result, multipleEntities: true });
  }

  async updateUserInCartItemsWithOrder(order: Order, user: User) {
    const result = await this.cartItemRepository.update(
      { user, order: IsNull() },
      { order },
    );
    // return handleTypeORMUpdateDeleteResult({ result, multipleEntities: true });
    // TODO: Ask Affan why orders are updated successfully here while result.affected = 0
    // I expect result.affected to match the number of cart items updated
    return !!result;
  }
}
