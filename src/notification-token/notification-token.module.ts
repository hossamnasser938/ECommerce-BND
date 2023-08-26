import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTokenEntity } from 'src/core/data-layer/mysql-typeorm/entities/notification-token.entity';

import { NOTIFICATION_TOKEN_REPOSITORY_PROVIDER_TOKEN } from './notification-token.constants';
import { NotificationTokenRepository } from './notification-token.repository';
import { NotificationTokenService } from './notification-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTokenEntity])],
  providers: [
    NotificationTokenService,
    {
      provide: NOTIFICATION_TOKEN_REPOSITORY_PROVIDER_TOKEN,
      useClass: NotificationTokenRepository,
    },
  ],
  exports: [
    NotificationTokenService,
    NOTIFICATION_TOKEN_REPOSITORY_PROVIDER_TOKEN,
  ],
})
export class NotificationTokenModule {}
