import { FindManyOptions } from 'typeorm';
import { PaginationParamsDTO } from './dtos';

export type Query = Record<string, any>;
export type Identifier = number | string;

export type PaginationResponse<T> = {
  data: T[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    nextPage: number | null;
    prevPage: number | null;
  };
};

export type PaginateConfig<T> = {
  paginationParameters: PaginationParamsDTO;
  query?: Query;
  findManyOptions?: FindManyOptions<T>;
};
