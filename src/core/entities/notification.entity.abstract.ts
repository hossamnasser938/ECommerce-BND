import { BaseEntity } from './base-entity.abstract';
import { INotificationToken } from './notification-token.entity.abstract';

export interface INotification extends BaseEntity {
  title: string;
  body: string;
  read: boolean;
  notificationToken: INotificationToken;
}
