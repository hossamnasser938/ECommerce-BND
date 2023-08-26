import { BaseEntity } from './base-entity.abstract';
import { ICategory } from './category.entity.abstract';
import { IVisualResource } from './visual-resource.entity.abstract';

export interface IProduct extends BaseEntity {
  name: string;
  description: string;
  amount: number;
  category: ICategory;
  visualResource: IVisualResource;
}
