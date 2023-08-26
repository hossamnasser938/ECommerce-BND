import { IArea } from './area-entity.abstract';
import { BaseEntity } from './base-entity.abstract';

export interface ICity extends BaseEntity {
  name: string;
  areas: IArea[];
}
