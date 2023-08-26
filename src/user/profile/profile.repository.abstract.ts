import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IProfile } from 'src/core/entities/profile-entity.abstract';

export interface IProfileRepository<T extends IProfile>
  extends GenericRepository<T> {
  getUserProfile(userId: Identifier): Promise<T>;
}
