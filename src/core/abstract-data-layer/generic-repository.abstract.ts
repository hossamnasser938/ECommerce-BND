import { Query, Identifier } from './types';

export abstract class GenericRepository<T> {
  abstract getAll(): Promise<T[]>;

  abstract getAllByCondition(query: Query): Promise<T[]>;

  abstract getOneById(id: Identifier): Promise<T>;

  abstract getOneByCondition(query: Query): Promise<T>;

  abstract updateOneById(
    id: Identifier,
    partialEntity: Partial<T>,
  ): Promise<boolean>;

  abstract updateOneByCondition(
    query: Query,
    partialEntity: Partial<T>,
  ): Promise<boolean>;

  abstract deleteOneById(id: Identifier): Promise<boolean>;

  abstract deleteOneByCondition(query: Query): Promise<boolean>;
}
