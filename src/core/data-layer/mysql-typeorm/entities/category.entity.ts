import { Icategory } from 'src/core/entities/category.entity.abstract';
import { BaseEntity } from '../base-entity.abstract';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity()
export class CategoryEntity extends BaseEntity implements Icategory {
  @Column()
  name: string;

  @ManyToOne(() => CategoryEntity)
  parentCategory: CategoryEntity;

  @OneToMany(() => CategoryEntity, (categroy) => categroy.parentCategory)
  childCategories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
