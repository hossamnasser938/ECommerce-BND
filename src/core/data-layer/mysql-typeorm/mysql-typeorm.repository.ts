import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { Identifier, Query } from 'src/core/abstract-data-layer/types';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from './base-entity.abstract';

export abstract class MySQLTypeORMDataLayerRepository<T extends BaseEntity>
  implements GenericRepository<T>
{
  private readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  getAll(): Promise<T[]> {
    return this.repository.find();
  }

  getAllByCondition(query: Query): Promise<T[]> {
    return this.repository.findBy(query);
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
