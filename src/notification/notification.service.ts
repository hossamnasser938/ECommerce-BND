import { Inject, Injectable } from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { INotification } from 'src/core/entities/notification.entity.abstract';
import { INotificationToken } from 'src/core/entities/notification-token.entity.abstract';

import { NOTIFICATION_REPOSITORY_PROVIDER_TOKEN } from './notification.constants';
import { INotificationRepositoy } from './notification.repository.abstract';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PROVIDER_TOKEN)
    private readonly notificationRepository: INotificationRepositoy<INotification>,
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

  createOne(
    title: string,
    body: string,
    notificationToken: INotificationToken,
  ) {
    return this.notificationRepository.createOne(
      title,
      body,
      notificationToken,
    );
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
