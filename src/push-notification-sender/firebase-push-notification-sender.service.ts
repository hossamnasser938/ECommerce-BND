import { Inject, Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase-admin/app';
import { getMessaging, Message } from 'firebase-admin/messaging';
import { INotification } from 'src/core/entities/notification.entity.abstract';
import { NotificationTokenService } from 'src/notification-token/notification-token.service';

import { AbstractPushNotificationSenderService } from './push-notification-sender.service.abstract';

@Injectable()
export class FirebasePushNotificationSenderService extends AbstractPushNotificationSenderService {
  constructor(
    @Inject(NotificationTokenService)
    private readonly notificationTokenService: NotificationTokenService,
  ) {
    super();
    initializeApp();
  }

  async sendPushNotification(notification: INotification): Promise<string[]> {
    const { title, body, user } = notification;
    const notificationTokens = await this.notificationTokenService.getUserAll(
      user.id,
    );
    const messageIds = notificationTokens.map((notificationToken) => {
      const message: Message = {
        notification: { title, body },
        token: notificationToken.value,
      };
      return getMessaging().send(message);
    });

    return messageIds.reduce((acc, val) => acc.concat(val), []);
  }
}
