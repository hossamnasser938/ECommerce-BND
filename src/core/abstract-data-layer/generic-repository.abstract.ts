import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_STARTING_PAGE,
} from '../data-layer/mysql-typeorm/config-constants';
import { PaginationParamsDTO } from './dtos';
import {
  AbstractPaginateConfig,
  Identifier,
  PaginationResponse,
  Query,
} from './types';

export abstract class GenericRepository<T> {
  abstract getAllPaginated(
    paginateConfig: AbstractPaginateConfig,
  ): Promise<PaginationResponse<T>>;

  formatPaginationResponse(
    result: T[],
    count: number,
    paginationParameters: PaginationParamsDTO,
  ): PaginationResponse<T> {
    const { page = DEFAULT_STARTING_PAGE, pageSize = DEFAULT_PAGE_SIZE } =
      paginationParameters;

    const totalRecords = count;
    const currentPage = page;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const nextPage = totalPages > page ? page + 1 : null;
    const prevPage = currentPage === 1 ? null : currentPage - 1;

    return {
      data: result,
      pagination: {
        totalRecords,
        currentPage,
        totalPages,
        pageSize,
        nextPage,
        prevPage,
      },
    };
  }

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

  abstract search(keyword: string): Promise<T[]>;
}
