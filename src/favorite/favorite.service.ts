import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IFavoriteItem } from 'src/core/entities/favorite-item.entity.abstract';
import { ProductService } from 'src/product/product.service';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

import { IFavoriteRepository } from './favorite.repository.abstract';
import { FavoriteDTO } from './dtos/favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @Inject('IFavoriteRepository')
    private readonly favoriteRepository: IFavoriteRepository<IFavoriteItem>,
    @Inject(ProductService) private readonly productService: ProductService,
  ) {}

  findAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.favoriteRepository.getAll(paginationParametersDTO);
  }

  findUserFavorites(
    userId: Identifier,
    paginationParametersDTO: PaginationParamsDTO,
  ) {
    return this.favoriteRepository.getAllByCondition(paginationParametersDTO, {
      user: { id: userId },
    });
  }

  async favorite(favoriteDTO: FavoriteDTO, userId: Identifier) {
    const { productId } = favoriteDTO;
    const product = await this.productService.findOneById(productId);
    if (!product)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('Product', 'id', productId),
      );

    const potentialDuplicateFavoriteItem =
      await this.favoriteRepository.getOneByCondition({
        product: { id: productId },
        user: { id: userId },
      });
    if (potentialDuplicateFavoriteItem)
      throw new ConflictException(ERROR_MESSAGES.PRODUCT_ALREADY_FAVORITED);

    return this.favoriteRepository.createOne(favoriteDTO, userId);
  }

  async unfavorite(favoriteDTO: FavoriteDTO, userId: Identifier) {
    const { productId } = favoriteDTO;
    const product = await this.productService.findOneById(productId);
    if (!product)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('Product', 'id', productId),
      );

    const deleted = await this.favoriteRepository.deleteOneByCondition({
      product: { id: productId },
      user: { id: userId },
    });
    return deleted;
  }
}
