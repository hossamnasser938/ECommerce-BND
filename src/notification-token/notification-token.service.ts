import { Inject, Injectable } from '@nestjs/common';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { INotificationToken } from 'src/core/entities/notification-token.entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';

import { CreateNotificationTokenDTO } from './dtos/create-notification-token.dto';
import { NOTIFICATION_TOKEN_REPOSITORY_PROVIDER_TOKEN } from './notification-token.constants';
import { INotificationTokenRepository } from './notification-token.repository.abstract';

@Injectable()
export class NotificationTokenService {
  constructor(
    @Inject(NOTIFICATION_TOKEN_REPOSITORY_PROVIDER_TOKEN)
    private readonly notificationTokenRepository: INotificationTokenRepository<INotificationToken>,
  ) {}

  createOne(
    createNotificationTokenDTO: CreateNotificationTokenDTO,
    user: IUser,
  ) {
    return this.notificationTokenRepository.createOne(
      createNotificationTokenDTO,
      user,
    );
  }

  async createOneIfNoExists(
    createNotificationTokenDTO: CreateNotificationTokenDTO,
    user: IUser,
  ): Promise<INotificationToken | undefined> {
    const exists = await this.notificationTokenRepository.exists(
      createNotificationTokenDTO,
      user,
    );
    if (exists) {
      return undefined;
    }

    return this.createOne(createNotificationTokenDTO, user);
  }

  getUserAll(userId) {
    return this.notificationTokenRepository.getUserAll(userId);
  }

  deleteOneById(id: Identifier) {
    return this.notificationTokenRepository.deleteOneById(id);
  }
}
