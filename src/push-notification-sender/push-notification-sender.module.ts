import { Module } from '@nestjs/common';
import { NotificationTokenModule } from 'src/notification-token/notification-token.module';

import { FirebasePushNotificationSenderService } from './firebase-push-notification-sender.service';
import { PUSH_NOTIFICATION_SENDER_SERVICE_PROVIDER_TOKEN } from './push-notifiction-sender.constants';

@Module({
  imports: [NotificationTokenModule],
  providers: [
    {
      provide: PUSH_NOTIFICATION_SENDER_SERVICE_PROVIDER_TOKEN,
      useClass: FirebasePushNotificationSenderService,
    },
  ],
  exports: [PUSH_NOTIFICATION_SENDER_SERVICE_PROVIDER_TOKEN],
})
export class PushNotificationSenderModule {}
