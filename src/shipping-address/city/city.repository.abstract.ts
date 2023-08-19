import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { ICity } from 'src/core/entities/city-entity.abstract';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICityRepository<T extends ICity>
  extends GenericRepository<T> {}
