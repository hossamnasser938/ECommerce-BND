import { BaseEntity } from './base-entity.abstract';
import { ICity } from './city-entity.abstract';

export interface IArea extends BaseEntity {
  name: string;
  city: ICity;
}
