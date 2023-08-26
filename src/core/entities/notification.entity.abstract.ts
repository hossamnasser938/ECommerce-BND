import { BaseEntity } from './base-entity.abstract';
import { IUser } from './user.entity.abstract';

export interface INotification extends BaseEntity {
  user: IUser;
  title: string;
  body: string;
  read: boolean;
}
