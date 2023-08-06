import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { CreateUserDTO } from './models/create-user.dto';
import { Role } from 'src/auth/auth.enums';

export interface IUserRepository<T extends IUser> extends GenericRepository<T> {
  createOne(createUserDTO: CreateUserDTO, roles: Role[]): Promise<T>;
}
