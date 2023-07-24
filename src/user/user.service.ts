import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async createOne(email: string, password: string, name: string) {
    const potentialDuplicateUser = await this.findOne(email);
    if (potentialDuplicateUser) {
      throw new ConflictException();
    }

    const user = new User();
    user.email = email;
    user.password = password;
    user.name = name;

    return this.userRepository.save(user);
  }
}
