import { Role } from 'src/auth/auth.enums';
import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IPreference } from 'src/core/entities/preference.entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';

import { CreateUserDTO } from './dtos/create-user.dto';

export interface IUserRepository<T extends IUser> extends GenericRepository<T> {
  createOne(createUserDTO: CreateUserDTO, roles: Role[]): Promise<T>;
  getUserPreference(userId: Identifier): Promise<IPreference>;
}
