import { Inject, Injectable } from '@nestjs/common';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IPreference } from 'src/core/entities/preference.entity.abstract';

import { UpdatePreferenceDTO } from './dtos/update-preference.dto';
import { PREFERENCE_REPOSITORY_PROVIDER_TOKEN } from './preference.constants';
import { IPreferenceRepositoy } from './preference.repository.abstract';

@Injectable()
export class PreferenceService {
  constructor(
    @Inject(PREFERENCE_REPOSITORY_PROVIDER_TOKEN)
    private readonly preferenceRepository: IPreferenceRepositoy<IPreference>,
  ) {}

  async getUserPreferences(userId: Identifier) {
    const preference = await this.preferenceRepository.getUserPreference(
      userId,
    );
    return preference;
  }

  async updateUserPreferences(
    userId: Identifier,
    updatePreferenceDTO: UpdatePreferenceDTO,
  ) {
    const updated = await this.preferenceRepository.updateOne(
      userId,
      updatePreferenceDTO,
    );
    return updated;
  }
}
