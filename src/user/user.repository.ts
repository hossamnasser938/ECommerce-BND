import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/auth.enums';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { MYSQL_TYPEORM_ERROR_TYPE_CHECKER } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.error-type-checker';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { Repository } from 'typeorm';

import { CreateUserDTO } from './dtos/create-user.dto';
import { IUserRepository } from './user.repository.abstract';

@Injectable()
export class UserRepository
  extends MySQLTypeORMDataLayerRepository<UserEntity>
  implements IUserRepository<UserEntity>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {
    super(userEntityRepository);
  }

  async createOne(
    createUserDTO: CreateUserDTO,
    roles: Role[],
  ): Promise<UserEntity> {
    const { email, password, name } = createUserDTO;

    const user = new UserEntity(email, password, name, roles);
    let userSaved: UserEntity;

    try {
      userSaved = await this.userEntityRepository.save(user);
    } catch (err: any) {
      if (MYSQL_TYPEORM_ERROR_TYPE_CHECKER.DUPLICATE_ENTRY(err)) {
        throw new BadRequestException(ERROR_MESSAGES.DUPLICATED_USER_EMAIL);
      }
      throw err;
    }

    return userSaved;
  }
}
