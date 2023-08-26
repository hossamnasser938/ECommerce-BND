import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/core/data-layer/mysql-typeorm/entities/profile.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { USER_REPOSITORY_PROVIDER_TOKEN } from '../user.constants';
import { UserRepository } from '../user.repository';
import { IProfileRepository } from './profile.repository.abstract';

export class ProfileRepository
  extends MySQLTypeORMDataLayerRepository<ProfileEntity>
  implements IProfileRepository<ProfileEntity>
{
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileEntityRepository: Repository<ProfileEntity>,
    @Inject(USER_REPOSITORY_PROVIDER_TOKEN)
    private readonly userRepository: UserRepository,
  ) {
    super(profileEntityRepository);
  }

  getUserProfile(userId: number): Promise<ProfileEntity> {
    return this.userRepository.getUserProfile(userId);
  }
}
