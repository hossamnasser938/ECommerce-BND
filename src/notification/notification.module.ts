import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/core/data-layer/mysql-typeorm/entities/notification.entity';
import { NotificationTokenModule } from 'src/notification-token/notification-token.module';
import { PushNotificationSenderModule } from 'src/push-notification-sender/push-notification-sender.module';

import { NOTIFICATION_REPOSITORY_PROVIDER_TOKEN } from './notification.constants';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    NotificationTokenModule,
    PushNotificationSenderModule,
  ],
  providers: [
    NotificationService,
    {
      provide: NOTIFICATION_REPOSITORY_PROVIDER_TOKEN,
      useClass: NotificationRepository,
    },
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
