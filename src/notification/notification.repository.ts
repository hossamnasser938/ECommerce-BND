import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { PaginationResponse } from 'src/core/abstract-data-layer/types';
import { NotificationEntity } from 'src/core/data-layer/mysql-typeorm/entities/notification.entity';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { NOTIFICATION_TOKEN_REPOSITORY_PROVIDER_TOKEN } from 'src/notification-token/notification-token.constants';
import { NotificationTokenRepository } from 'src/notification-token/notification-token.repository';
import { In, Repository } from 'typeorm';

import { INotificationRepositoy } from './notification.repository.abstract';

@Injectable()
export class NotificationRepository
  extends MySQLTypeORMDataLayerRepository<NotificationEntity>
  implements INotificationRepositoy<NotificationEntity>
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationEntityRepo: Repository<NotificationEntity>,
    @Inject(NOTIFICATION_TOKEN_REPOSITORY_PROVIDER_TOKEN)
    private readonly notificationTokenRepository: NotificationTokenRepository,
  ) {
    super(notificationEntityRepo);
  }

  async getUserNotifications(
    paginationParameters: PaginationParamsDTO,
    userId: number,
  ): Promise<PaginationResponse<NotificationEntity>> {
    const userNotificationTokens =
      await this.notificationTokenRepository.getUserAll(userId);

    const userNotificationTokenIds = userNotificationTokens.map(
      (userNotificationToken) => userNotificationToken.id,
    );

    return this.getAllPaginated({
      paginationParameters,
      otherOptions: {
        where: { notificationToken: { id: In(userNotificationTokenIds) } },
      },
    });
  }

  async createOne(
    title: string,
    body: string,
    user: UserEntity,
  ): Promise<NotificationEntity> {
    const notification = new NotificationEntity(title, body, user);

    return this.notificationEntityRepo.save(notification);
  }

  async markOneAsRead(id: number, userId: number): Promise<boolean> {
    const userNotificationTokens =
      await this.notificationTokenRepository.getUserAll(userId);

    const userNotificationTokenIds = userNotificationTokens.map(
      (userNotificationToken) => userNotificationToken.id,
    );

    const updateResult = await this.notificationEntityRepo.update(
      { id, notificationToken: { id: In(userNotificationTokenIds) } },
      { read: true },
    );

    return !!updateResult.affected;
  }

  async markAllAsRead(userId: number): Promise<boolean> {
    const userNotificationTokens =
      await this.notificationTokenRepository.getUserAll(userId);

    const userNotificationTokenIds = userNotificationTokens.map(
      (userNotificationToken) => userNotificationToken.id,
    );

    const updateResult = await this.notificationEntityRepo.update(
      { notificationToken: { id: In(userNotificationTokenIds) } },
      { read: true },
    );

    return !!updateResult.affected;
  }
}
