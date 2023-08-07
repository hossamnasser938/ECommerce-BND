import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserService,
    { provide: 'IUserRepository', useClass: UserRepository },
  ],
  controllers: [UserController],
  exports: [UserService, 'IUserRepository'],
})
export class UserModule {}
