import { BaseEntity } from './base-entity.abstract';
import { IProduct } from './product.entity.abstract';

export interface ICategory extends BaseEntity {
  name: string;
  parentCategory: ICategory;
  childCategories: ICategory[];
  products: IProduct[];
}
