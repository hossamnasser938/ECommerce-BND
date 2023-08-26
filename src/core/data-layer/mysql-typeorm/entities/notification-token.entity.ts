import { INotificationToken } from 'src/core/entities/notification-token.entity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';

import { DeviceType } from '../../../../notification-token/notification-token.types';
import { BaseEntity } from '../base-entity.abstract';
import { UserEntity } from './user.entity';

@Entity({ name: 'notification_token' })
export class NotificationTokenEntity
  extends BaseEntity
  implements INotificationToken
{
  constructor(user: UserEntity, value: string, deviceType: DeviceType) {
    super();
    this.user = user;
    this.value = value;
    this.deviceType = deviceType;
  }

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.notificationTokens)
  user: UserEntity;

  @Column()
  value: string;

  @Column({ enum: DeviceType })
  deviceType: DeviceType;
}
