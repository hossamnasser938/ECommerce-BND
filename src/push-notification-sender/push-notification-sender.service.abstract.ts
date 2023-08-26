import { INotification } from 'src/core/entities/notification.entity.abstract';

export abstract class AbstractPushNotificationSenderService {
  abstract sendPushNotification(notification: INotification): Promise<string[]>;
}
