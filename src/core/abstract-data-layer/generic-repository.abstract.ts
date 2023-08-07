import { PaginationParamsDTO } from './dtos';
import { Identifier, PaginateConfig, PaginationResponse, Query } from './types';

export abstract class GenericRepository<T> {
  abstract paginate(
    paginateConfig: PaginateConfig<T>,
  ): Promise<PaginationResponse<T>>;

  abstract getAll(
    paginationParameters: PaginationParamsDTO,
  ): Promise<PaginationResponse<T>>;

  abstract getAllByCondition(
    paginationParameters: PaginationParamsDTO,
    query: Query,
  ): Promise<PaginationResponse<T>>;

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
