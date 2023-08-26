import { Exclude } from 'class-transformer';
import { ICategory } from 'src/core/entities/category.entity.abstract';
import {
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { FileEntity } from './file.entity';
import { ProductEntity } from './product.entity';
import { VisualResourceEntity } from './visual-resource.entity';

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity implements ICategory {
  constructor(name: string, parentCategory: CategoryEntity) {
    super();
    this.name = name;
    this.parentCategory = parentCategory;
    this.visualResource = new VisualResourceEntity();
  }

  @Index({ fulltext: true })
  @Column()
  name: string;

  @Exclude()
  @OneToOne(() => VisualResourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  visualResource: VisualResourceEntity;

  @ManyToOne(() => CategoryEntity)
  parentCategory: CategoryEntity;

  @OneToMany(() => CategoryEntity, (categroy) => categroy.parentCategory)
  childCategories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];

  images?: FileEntity[];

  @AfterLoad()
  hideVisualResource() {
    this.images = this.visualResource.images;
  }
}
