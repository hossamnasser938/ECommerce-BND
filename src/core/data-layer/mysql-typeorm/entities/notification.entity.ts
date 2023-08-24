import { INotification } from 'src/core/entities/notification.entity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { NotificationTokenEntity } from './notification-token.entity';

@Entity({ name: 'notification' })
export class NotificationEntity extends BaseEntity implements INotification {
  constructor(
    title: string,
    body: string,
    notificationToken: NotificationTokenEntity,
  ) {
    super();
    this.title = title;
    this.body = body;
    this.notificationToken = notificationToken;
    this.read = false;
  }

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  read: boolean;

  @ManyToOne(
    () => NotificationTokenEntity,
    (notificationTokenEntity) => notificationTokenEntity.notifications,
  )
  notificationToken: NotificationTokenEntity;
}
