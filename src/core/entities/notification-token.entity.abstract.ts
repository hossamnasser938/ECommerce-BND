import { DeviceType } from '../../notification-token/notification-token.types';
import { BaseEntity } from './base-entity.abstract';
import { IUser } from './user.entity.abstract';

export interface INotificationToken extends BaseEntity {
  user: IUser;
  value: string;
  deviceType: DeviceType;
}
