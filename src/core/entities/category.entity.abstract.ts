import { BaseEntity } from './base-entity.abstract';
import { IProduct } from './product.entity.abstract';
import { IVisualResource } from './visual-resource.entity.abstract';

export interface ICategory extends BaseEntity {
  name: string;
  parentCategory: ICategory;
  childCategories: ICategory[];
  products: IProduct[];
  visualResource: IVisualResource;
}
