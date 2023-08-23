import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { INotificationToken } from 'src/core/entities/notification-token.entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';

import { CreateNotificationTokenDTO } from './dtos/create-notification-token.dto';

export interface INotificationTokenRepository<T extends INotificationToken>
  extends GenericRepository<T> {
  getUserAll(userId: Identifier): Promise<T[]>;

  createOne(
    createNotificationTokenDTO: CreateNotificationTokenDTO,
    user: IUser,
  ): Promise<T>;
}
