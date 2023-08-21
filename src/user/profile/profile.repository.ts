import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/core/data-layer/mysql-typeorm/entities/profile.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { IProfileRepository } from './profile.repository.abstract';

export class ProfileRepository
  extends MySQLTypeORMDataLayerRepository<ProfileEntity>
  implements IProfileRepository<ProfileEntity>
{
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileEntityRepository: Repository<ProfileEntity>,
  ) {
    super(profileEntityRepository);
  }
}
