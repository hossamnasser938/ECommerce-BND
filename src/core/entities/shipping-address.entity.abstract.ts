import { BaseEntity } from './base-entity.abstract';
import { IUser } from './user.entity.abstract';

export interface IShippingAddress extends BaseEntity {
  city: string;
  area: string;
  street: string;
  building: number;
  apartment: number;
  isDefault: boolean;
  user: IUser;
}
