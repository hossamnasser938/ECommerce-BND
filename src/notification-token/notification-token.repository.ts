import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationTokenEntity } from 'src/core/data-layer/mysql-typeorm/entities/notification-token.entity';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { CreateNotificationTokenDTO } from './dtos/create-notification-token.dto';
import { INotificationTokenRepository } from './notification-token.repository.abstract';

@Injectable()
export class NotificationTokenRepository
  extends MySQLTypeORMDataLayerRepository<NotificationTokenEntity>
  implements INotificationTokenRepository<NotificationTokenEntity>
{
  constructor(
    @InjectRepository(NotificationTokenEntity)
    private readonly notificationTokenRepository: Repository<NotificationTokenEntity>,
  ) {
    super(notificationTokenRepository);
  }

  getUserAll(userId: number): Promise<NotificationTokenEntity[]> {
    return this.notificationTokenRepository.findBy({ user: { id: userId } });
  }

  createOne(
    createNotificationTokenDTO: CreateNotificationTokenDTO,
    user: UserEntity,
  ): Promise<NotificationTokenEntity> {
    const { value, deviceType } = createNotificationTokenDTO;

    const notificationToken = new NotificationTokenEntity(
      user,
      value,
      deviceType,
    );

    return this.notificationTokenRepository.save(notificationToken);
  }
}
