import { Product } from 'src/product/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity({})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category)
  parentCategory: Category;

  @OneToMany(() => Category, (categroy) => categroy.parentCategory)
  childCategories: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
