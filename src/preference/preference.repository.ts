import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PreferenceEntity } from 'src/core/data-layer/mysql-typeorm/entities/preference.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { USER_REPOSITORY_PROVIDER_TOKEN } from 'src/user/user.constants';
import { UserRepository } from 'src/user/user.repository';
import { Repository } from 'typeorm';

import { UpdatePreferenceDTO } from './dtos/update-preference.dto';
import { IPreferenceRepositoy } from './preference.repository.abstract';

@Injectable()
export class PreferenceRepository
  extends MySQLTypeORMDataLayerRepository<PreferenceEntity>
  implements IPreferenceRepositoy<PreferenceEntity>
{
  constructor(
    @InjectRepository(PreferenceEntity)
    private readonly preferenceEntityRepo: Repository<PreferenceEntity>,
    @Inject(USER_REPOSITORY_PROVIDER_TOKEN)
    private readonly userRepository: UserRepository,
  ) {
    super(preferenceEntityRepo);
  }

  async getUserPreference(userId: number): Promise<PreferenceEntity> {
    return this.userRepository.getUserPreference(userId);
  }

  async updateOne(
    userId: number,
    updatePreferenceDTO: UpdatePreferenceDTO,
  ): Promise<boolean> {
    const preference = await this.userRepository.getUserPreference(userId);

    const updateResult = await this.preferenceEntityRepo.update(
      { id: preference.id },
      updatePreferenceDTO,
    );

    return !!updateResult.affected;
  }
}
