import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IPreference } from 'src/core/entities/preference.entity.abstract';

import { UpdatePreferenceDTO } from './dtos/update-preference.dto';

export interface IPreferenceRepositoy<T extends IPreference>
  extends GenericRepository<T> {
  getUserPreference(userId: Identifier): Promise<IPreference>;
  updateOne(
    userId: Identifier,
    updatePreferenceDTO: UpdatePreferenceDTO,
  ): Promise<boolean>;
}
