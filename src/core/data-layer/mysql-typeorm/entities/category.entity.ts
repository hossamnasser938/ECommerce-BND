import { ICategory } from 'src/core/entities/category.entity.abstract';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { ProductEntity } from './product.entity';

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity implements ICategory {
  constructor(name: string, parentCategory: CategoryEntity) {
    super();
    this.name = name;
    this.parentCategory = parentCategory;
  }

  @Column()
  name: string;

  @ManyToOne(() => CategoryEntity)
  parentCategory: CategoryEntity;

  @OneToMany(() => CategoryEntity, (categroy) => categroy.parentCategory)
  childCategories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
