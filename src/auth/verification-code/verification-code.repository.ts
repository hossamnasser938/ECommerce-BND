import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { IVerificationCodeRepository } from './verification-code.repository.abstract';
import { VerificationCodeEntity } from 'src/core/data-layer/mysql-typeorm/entities/verification-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';

@Injectable()
export class VerificationCodeRepository
  extends MySQLTypeORMDataLayerRepository<VerificationCodeEntity>
  implements IVerificationCodeRepository<VerificationCodeEntity>
{
  constructor(
    @InjectRepository(VerificationCodeEntity)
    private verificationCodeEntityRepository: Repository<VerificationCodeEntity>,
    @Inject('IUserRepository') private userRepository: UserRepository,
  ) {
    super(verificationCodeEntityRepository);
  }

  async createOne(
    user: UserEntity,
    code: string,
    validUntil: Date,
  ): Promise<VerificationCodeEntity> {
    const verificationCode = new VerificationCodeEntity(code, validUntil, user);

    return this.verificationCodeEntityRepository.save(verificationCode);
  }
}
