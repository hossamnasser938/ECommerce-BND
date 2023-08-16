import { Inject, Injectable } from '@nestjs/common';
import { Role } from 'src/auth/auth.enums';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IUser } from 'src/core/entities/user.entity.abstract';

import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { USER_REPOSITORY_PROVIDER_TOKEN } from './user.constants';
import { IUserRepository } from './user.repository.abstract';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER_TOKEN)
    private readonly userRepository: IUserRepository<IUser>,
  ) {}

  findAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.userRepository.getAll(paginationParametersDTO);
  }

  findOneByEmail(email: string) {
    return this.userRepository.getOneByCondition({ email });
  }

  findOneById(id: Identifier) {
    return this.userRepository.getOneById(id);
  }

  async createOne(createUserDTO: CreateUserDTO, roles: Role[]) {
    return this.userRepository.createOne(createUserDTO, roles);
  }

  async updateOne(id: Identifier, updateUserDTO: UpdateUserDTO) {
    const updated = await this.userRepository.updateOneById(id, updateUserDTO);
    return updated;
  }

  async deleteOne(id: Identifier) {
    const deleted = await this.userRepository.deleteOneById(id);
    return deleted;
  }

  verifyUser(userId: Identifier) {
    return this.updateOne(userId, { verified: true });
  }
}
