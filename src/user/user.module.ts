import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';

import { USER_REPOSITORY_PROVIDER_TOKEN } from './user.constants';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserService,
    { provide: USER_REPOSITORY_PROVIDER_TOKEN, useClass: UserRepository },
  ],
  controllers: [UserController],
  exports: [UserService, USER_REPOSITORY_PROVIDER_TOKEN],
})
export class UserModule {}
