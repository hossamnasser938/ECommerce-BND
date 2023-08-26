import { INotification } from 'src/core/entities/notification.entity.abstract';
import { INotificationToken } from 'src/core/entities/notification-token.entity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { UserEntity } from './user.entity';

@Entity({ name: 'notification' })
export class NotificationEntity extends BaseEntity implements INotification {
  constructor(title: string, body: string, user: UserEntity) {
    super();
    this.title = title;
    this.body = body;
    this.read = false;
    this.user = user;
  }
  notificationToken: INotificationToken;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  read: boolean;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.notifications)
  user: UserEntity;
}
