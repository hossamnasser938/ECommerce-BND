import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { ICartItem } from 'src/core/entities/cart-item.entity.abstract';
import { IOrder } from 'src/core/entities/order.entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { ProductService } from 'src/product/product.service';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

import { ICartRepository } from './cart.repository.abstract';
import { UpdateCartItemAmountOperation } from './models/cart.enums';
import { CreateCartItemDTO } from './models/create-cart-item.dto';
import { UpdateCartItemDTO } from './models/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository<ICartItem>,
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  findAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.cartRepository.getAll(paginationParametersDTO);
  }

  findUserAll(
    userId: Identifier,
    paginationParametersDTO: PaginationParamsDTO,
  ) {
    return this.cartRepository.getAllByCondition(paginationParametersDTO, {
      user: { id: userId },
    });
  }

  findOneById(id: Identifier) {
    return this.cartRepository.getOneById(id);
  }

  findUserInCartItems(userId: Identifier) {
    return this.cartRepository.getUserInCartItems(userId);
  }

  async createOne(createCartItemDTO: CreateCartItemDTO, user: IUser) {
    const { productId, amount } = createCartItemDTO;

    const product = await this.productService.findOneById(productId);
    if (!product)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('Product', 'id', productId),
      );

    const potentialDuplicateCartItem =
      await this.cartRepository.getUserInCartItemByProduct(user.id, productId);

    if (potentialDuplicateCartItem)
      throw new ConflictException(ERROR_MESSAGES.CART_ITEM_EXIST);

    if (amount > product.amount)
      throw new ForbiddenException(ERROR_MESSAGES.AMOUNT_NOT_AVAILABLE);

    return this.cartRepository.createOne(createCartItemDTO, user);
  }

  async updateOne(id: Identifier, updateCartItemDTO: UpdateCartItemDTO) {
    if (updateCartItemDTO.amount) {
      const cartItem = await this.findOneById(id);
      if (updateCartItemDTO.amount > cartItem.product.amount)
        throw new ForbiddenException(ERROR_MESSAGES.AMOUNT_NOT_AVAILABLE);
    }

    const updated = await this.cartRepository.updateOneById(
      id,
      updateCartItemDTO,
    );
    return updated;
  }

  async updateAmount(
    id: Identifier,
    userId: Identifier,
    operation: UpdateCartItemAmountOperation,
  ) {
    const cartItem = await this.cartRepository.getOneByCondition({
      id,
      user: { id: userId },
    });

    if (!cartItem)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('CartItem', 'id', id),
      );

    const newAmount =
      cartItem.amount +
      (operation === UpdateCartItemAmountOperation.INCREMENT ? 1 : -1);

    if (newAmount > cartItem.product.amount)
      throw new ForbiddenException(ERROR_MESSAGES.AMOUNT_NOT_AVAILABLE);

    let altered: boolean;

    if (newAmount === 0) {
      altered = await this.cartRepository.deleteOneById(id);
    } else {
      altered = await this.cartRepository.updateOneById(id, {
        amount: newAmount,
      });
    }

    return altered;
  }

  async deleteOne(id: Identifier, userId: Identifier) {
    const deleted = await this.cartRepository.deleteOneByCondition({
      id,
      user: { id: userId },
    });
    return deleted;
  }

  async deleteAllUserInCartItems(userId: Identifier) {
    return this.cartRepository.deleteAllUserInCartItems(userId);
  }

  updateUserInCartItemsWithOrder(order: IOrder, userId: Identifier) {
    return this.cartRepository.updateUserInCartItemsWithOrder(order, userId);
  }
}
