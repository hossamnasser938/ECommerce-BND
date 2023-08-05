import { Icategory } from './category.entity.abstract';

export interface IProduct {
  name: string;
  description: string;
  amount: number;
  category: Icategory;
}
