import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from 'src/auth/auth.enums';
import { CreateUserDTO } from './models/create-user.dto';
import { UpdateUserDTO } from './models/update-user.dto';
import { handleTypeORMUpdateDeleteResult } from 'src/utils/helper-functions';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findOneById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async createOne(createUserDTO: CreateUserDTO, roles: Role[]) {
    const { email, password, name } = createUserDTO;

    const potentialDuplicateUser = await this.findOneByEmail(email);
    if (potentialDuplicateUser) {
      throw new ConflictException(ERROR_MESSAGES.DUPLICATED_USER_EMAIL);
    }

    const user = new User();
    user.email = email;
    user.password = password;
    user.name = name;
    user.roles = JSON.stringify(roles);
    user.verified = false;

    return this.userRepository.save(user);
  }

  async updateOne(id: number, updateUserDTO: UpdateUserDTO) {
    const result = await this.userRepository.update(id, updateUserDTO);
    return handleTypeORMUpdateDeleteResult({ result });
  }

  async deleteOne(id: number) {
    const result = await this.userRepository.delete(id);
    return handleTypeORMUpdateDeleteResult({ result });
  }

  verifyUser(userId: number) {
    return this.updateOne(userId, { verified: true });
  }
}
