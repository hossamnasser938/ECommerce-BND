import { Inject, Injectable } from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { INotification } from 'src/core/entities/notification.entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { AbstractPushNotificationSenderService } from 'src/push-notification-sender/push-notification-sender.service.abstract';
import { PUSH_NOTIFICATION_SENDER_SERVICE_PROVIDER_TOKEN } from 'src/push-notification-sender/push-notifiction-sender.constants';

import { NOTIFICATION_REPOSITORY_PROVIDER_TOKEN } from './notification.constants';
import { INotificationRepositoy } from './notification.repository.abstract';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PROVIDER_TOKEN)
    private readonly notificationRepository: INotificationRepositoy<INotification>,
    @Inject(PUSH_NOTIFICATION_SENDER_SERVICE_PROVIDER_TOKEN)
    private readonly pushNotificationSenderService: AbstractPushNotificationSenderService,
  ) {}

  findAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.notificationRepository.getAll(paginationParametersDTO);
  }

  findUserAll(
    paginationParametersDTO: PaginationParamsDTO,
    userId: Identifier,
  ) {
    return this.notificationRepository.getUserNotifications(
      paginationParametersDTO,
      userId,
    );
  }

  async findOneById(id: Identifier) {
    const notification = await this.notificationRepository.getOneById(id);
    return notification;
  }

  createOne(title: string, body: string, user: IUser) {
    return this.notificationRepository.createOne(title, body, user);
  }

  async sendOne(notification: INotification) {
    await this.pushNotificationSenderService.sendPushNotification(notification);
  }

  async createAndSendOne(title: string, body: string, user: IUser) {
    const notification = await this.createOne(title, body, user);
    await this.sendOne(notification);
  }

  async markOneRead(id: Identifier, userId: Identifier) {
    const updated = await this.notificationRepository.markOneAsRead(id, userId);
    return updated;
  }

  async markAllUserRead(userId: Identifier) {
    const updated = await this.notificationRepository.markAllAsRead(userId);
    return updated;
  }
}
