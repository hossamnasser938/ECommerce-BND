import { IArea } from './area-entity.abstract';
import { BaseEntity } from './base-entity.abstract';
import { IUser } from './user.entity.abstract';

export interface IShippingAddress extends BaseEntity {
  area: IArea;
  street: string;
  building: number;
  apartment: number;
  isDefault: boolean;
  user: IUser;
}
