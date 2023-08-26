import { BaseEntity } from './base-entity.abstract';
import { IUser } from './user.entity.abstract';

export interface IPreference extends BaseEntity {
  user: IUser;
  getNotifications: boolean;
}
