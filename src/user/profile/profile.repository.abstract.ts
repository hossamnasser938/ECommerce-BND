import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { IProfile } from 'src/core/entities/profile-entity.abstract';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProfileRepository<T extends IProfile>
  extends GenericRepository<T> {}
