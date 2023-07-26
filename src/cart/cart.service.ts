import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { CreateCartItemDTO } from './models/create-cart-item.dto';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';
import { checkTypeORMUpdateDeleteResult } from 'src/utils/helper-functions';
import { UserService } from 'src/user/user.service';
import { UpdateCartItemDTO } from './models/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @Inject(ProductService) private productService: ProductService,
    @Inject(UserService) private userService: UserService,
  ) {}

  findOneById(id: number) {
    return this.cartItemRepository.findOneBy({ id });
  }

  findOneByProduct(product: Product, user: User) {
    return this.cartItemRepository.findOneBy({ product, user });
  }

  async createOne(createCartItemDTO: CreateCartItemDTO, user: User) {
    const { productId, amount } = createCartItemDTO;

    const product = await this.productService.findOneById(productId);
    if (!product)
      throw new NotFoundException(`Product with id = ${productId} not found`);

    const potentialDuplicateCartItem = await this.findOneByProduct(
      product,
      user,
    );
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

    const result = await this.cartItemRepository.update(id, {
      amount: newAmount,
    });

    return checkTypeORMUpdateDeleteResult(result);
  }

  async deleteOne(id: number, user: User) {
    const result = await this.cartItemRepository.delete({ id, user });
    return checkTypeORMUpdateDeleteResult(result);
  }

  async deleteAllUserCartItems(user: User) {
    const cartItems = await this.userService.findCartItems(user.id);
    if (cartItems.length === 0)
      throw new NotFoundException('User has empty cart');

    const result = await this.cartItemRepository.delete({ user });
    return checkTypeORMUpdateDeleteResult(result, true);
  }
}
