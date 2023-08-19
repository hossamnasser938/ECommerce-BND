import { AbstractPaginateConfig } from 'src/core/abstract-data-layer/types';
import { FindManyOptions } from 'typeorm';

import { BaseEntity } from './base-entity.abstract';

export class PaginateConfig<
  T extends BaseEntity,
> extends AbstractPaginateConfig {
  otherOptions?: FindManyOptions<T>;
}

export type DB_TYPE = 'mysql' | 'mariadb';
