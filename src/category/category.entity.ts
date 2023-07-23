import { Product } from 'src/product/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity({})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Category)
  @JoinColumn()
  parentCategory: Category;

  @OneToMany(() => Category, (categroy) => categroy.parentCategory)
  childCategories: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
