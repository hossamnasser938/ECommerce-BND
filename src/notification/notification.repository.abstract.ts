import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import {
  Identifier,
  PaginationResponse,
} from 'src/core/abstract-data-layer/types';
import { INotification } from 'src/core/entities/notification.entity.abstract';
import { INotificationToken } from 'src/core/entities/notification-token.entity.abstract';

export interface INotificationRepositoy<T extends INotification>
  extends GenericRepository<T> {
  getUserNotifications(
    paginationParametersDTO: PaginationParamsDTO,
    userId: Identifier,
  ): Promise<PaginationResponse<T>>;

  createOne(
    title: string,
    body: string,
    notificationToken: INotificationToken,
  ): Promise<T>;

  markOneAsRead(id: Identifier, userId: Identifier): Promise<boolean>;

  markAllAsRead(userId: Identifier): Promise<boolean>;
}
