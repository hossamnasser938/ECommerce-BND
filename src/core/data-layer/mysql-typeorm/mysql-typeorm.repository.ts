import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import {
  Identifier,
  PaginateConfig,
  PaginationResponse,
  Query,
} from 'src/core/abstract-data-layer/types';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from './base-entity.abstract';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { DEFAULT_PAGE_SIZE, DEFAULT_STARTING_PAGE } from './config-constants';

export abstract class MySQLTypeORMDataLayerRepository<T extends BaseEntity>
  implements GenericRepository<T>
{
  private readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async paginate({
    paginationParameters,
    query = {},
    findManyOptions = {},
  }: PaginateConfig<T>): Promise<PaginationResponse<T>> {
    const { page = DEFAULT_STARTING_PAGE, pageSize = DEFAULT_PAGE_SIZE } =
      paginationParameters;

    const [result, count] = await this.repository.findAndCount({
      take: pageSize,
      skip: pageSize * (page - 1),
      where: query,
      ...findManyOptions,
    });

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

  getAll(
    paginationParameters: PaginationParamsDTO,
  ): Promise<PaginationResponse<T>> {
    return this.paginate({ paginationParameters });
  }

  getAllByCondition(
    paginationParameters: PaginationParamsDTO,
    query: Query,
  ): Promise<PaginationResponse<T>> {
    return this.paginate({ paginationParameters, query });
  }

  getOneById(id: Identifier): Promise<T> {
    return this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  getOneByCondition(query: Query): Promise<T> {
    return this.repository.findOneBy(query);
  }

  async updateOneById(
    id: Identifier,
    partialEntity: Partial<T>,
  ): Promise<boolean> {
    const updateResult = await this.repository.update(
      id,
      partialEntity as QueryDeepPartialEntity<T>,
    );
    return !!updateResult.affected;
  }

  async updateOneByCondition(
    query: Query,
    partialEntity: Partial<T>,
  ): Promise<boolean> {
    const updateResult = await this.repository.update(
      query,
      partialEntity as QueryDeepPartialEntity<T>,
    );
    return !!updateResult.affected;
  }

  async deleteOneById(id: Identifier): Promise<boolean> {
    const deleteResult = await this.repository.delete(id);
    return !!deleteResult.affected;
  }

  async deleteOneByCondition(query: Query): Promise<boolean> {
    const deleteResult = await this.repository.delete(query);
    return !!deleteResult.affected;
  }
}
