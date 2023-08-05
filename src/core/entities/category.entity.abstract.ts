import { IProduct } from './product.entity.abstract';

export interface Icategory {
  name: string;
  parentCategory: Icategory;
  childCategories: Icategory[];
  products: IProduct[];
}
