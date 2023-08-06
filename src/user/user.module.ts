import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { UserRepository } from './user.repository';

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
