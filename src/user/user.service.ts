import { Inject, Injectable } from '@nestjs/common';
import { Role } from 'src/auth/auth.enums';
import { CreateUserDTO } from './models/create-user.dto';
import { UpdateUserDTO } from './models/update-user.dto';
import { IUserRepository } from './user.repository.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository<IUser>,
  ) {}

  findAll() {
    return this.userRepository.getAll();
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
