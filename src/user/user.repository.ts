import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { IUserRepository } from './user.repository.abstract';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { CreateUserDTO } from './models/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/auth.enums';

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

    return this.userEntityRepository.save(user);
  }
}
