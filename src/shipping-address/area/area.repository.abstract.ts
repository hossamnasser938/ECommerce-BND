import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { IArea } from 'src/core/entities/area-entity.abstract';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAreaRepository<T extends IArea>
  extends GenericRepository<T> {}
