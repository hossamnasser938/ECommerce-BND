import { IUser } from './user.entity.abstract';

export interface IShippingAddress {
  city: string;
  area: string;
  street: string;
  building: number;
  apartment: number;
  isDefault: boolean;
  user: IUser;
}
