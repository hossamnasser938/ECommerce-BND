import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteItem } from './favorite-item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { FavoriteDTO } from './models/favorite.dto';
import { ProductService } from 'src/product/product.service';
import { checkTypeORMUpdateDeleteResult } from 'src/utils/helper-functions';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(FavoriteItem)
    private favoriteItemRepository: Repository<FavoriteItem>,
    @Inject(ProductService) private productService: ProductService,
  ) {}

  findAll() {
    return this.favoriteItemRepository.find();
  }

  findUserFavorites(user: User) {
    return this.favoriteItemRepository.findBy({ user });
  }

  async favorite(favoriteDTO: FavoriteDTO, user: User) {
    const { productId } = favoriteDTO;
    const product = await this.productService.findOneById(productId);
    if (!product)
      throw new NotFoundException(`No product with id = ${productId}`);

    const potentialDuplicateFavoriteItem =
      await this.favoriteItemRepository.findOneBy({ product, user });
    if (potentialDuplicateFavoriteItem)
      throw new ConflictException('Product already favorited by user');

    const favoriteItem = new FavoriteItem();
    favoriteItem.product = product;
    favoriteItem.user = user;

    return this.favoriteItemRepository.save(favoriteItem);
  }

  async unfavorite(favoriteDTO: FavoriteDTO, user: User) {
    const { productId } = favoriteDTO;
    const product = await this.productService.findOneById(productId);
    if (!product)
      throw new NotFoundException(`No product with id = ${productId}`);

    const result = await this.favoriteItemRepository.delete({ product, user });
    return checkTypeORMUpdateDeleteResult(result);
  }
}
