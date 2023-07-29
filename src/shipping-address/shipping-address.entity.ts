import { Order } from 'src/order/order.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({})
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  area: string;

  @Column()
  street: string;

  @Column()
  building: number;

  @Column()
  apartment: number;

  @Column()
  isDefault: boolean;

  @ManyToOne(() => User, (user) => user.shippingAddresses)
  user: User;

  @OneToMany(() => Order, (order) => order.shippingAddress)
  orders: Order[];
}
