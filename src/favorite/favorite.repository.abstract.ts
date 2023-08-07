import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IFavoriteItem } from 'src/core/entities/favorite-item.entity.abstract';

import { FavoriteDTO } from './models/favorite.dto';

export interface IFavoriteRepository<T extends IFavoriteItem>
  extends GenericRepository<T> {
  createOne(favoriteDTO: FavoriteDTO, userId: Identifier): Promise<T>;
}
