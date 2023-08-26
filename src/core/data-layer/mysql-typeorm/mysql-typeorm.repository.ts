import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import {
  Identifier,
  PaginationResponse,
  Query,
} from 'src/core/abstract-data-layer/types';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BaseEntity } from './base-entity.abstract';
import { DEFAULT_PAGE_SIZE, DEFAULT_STARTING_PAGE } from './config-constants';
import { PaginateConfig } from './types';

export class MySQLTypeORMDataLayerRepository<
  T extends BaseEntity,
> extends GenericRepository<T> {
  private readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    super();
    this.repository = repository;
  }

  async getAllPaginated({
    paginationParameters,
    query = {},
    otherOptions = {},
  }: PaginateConfig<T>): Promise<PaginationResponse<T>> {
    const { page = DEFAULT_STARTING_PAGE, pageSize = DEFAULT_PAGE_SIZE } =
      paginationParameters;

    const [result, count] = await this.repository.findAndCount({
      take: pageSize,
      skip: pageSize * (page - 1),
      where: query,
      ...otherOptions,
    });

    return this.formatPaginationResponse(result, count, paginationParameters);
  }

  getAll(
    paginationParameters: PaginationParamsDTO,
  ): Promise<PaginationResponse<T>> {
    return this.getAllPaginated({ paginationParameters });
  }

  getAllByCondition(
    paginationParameters: PaginationParamsDTO,
    query: Query,
  ): Promise<PaginationResponse<T>> {
    return this.getAllPaginated({ paginationParameters, query });
  }

  getOneById(id: Identifier): Promise<T> {
    return this.repository.findOneOrFail({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  getOneByCondition(query: Query): Promise<T> {
    return this.repository.findOneByOrFail(query);
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

  async search(keyword: string): Promise<T[]> {
    const indices = this.repository.metadata.indices;
    const fullTextIndices = indices.filter((index) => index.isFulltext);
    const fullTextColumnNames: string[] = fullTextIndices.reduce((acc, val) => {
      return acc.concat(val.givenColumnNames);
    }, []);

    if (fullTextColumnNames.length === 0) return [];

    const [firstFullTextColumn, ...restFullTextColumns] = fullTextColumnNames;

    let queryBuilder = this.repository
      .createQueryBuilder()
      .select()
      .where(
        `MATCH(${firstFullTextColumn}) AGAINST ('*${keyword}*' IN BOOLEAN MODE)`,
      );

    restFullTextColumns.forEach((fullTextColumn) => {
      queryBuilder = queryBuilder.orWhere(
        `MATCH(${fullTextColumn}) AGAINST ('*${keyword}*' IN BOOLEAN MODE)`,
      );
    });

    return queryBuilder.getMany();
  }
}
