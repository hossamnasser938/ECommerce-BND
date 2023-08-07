import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { VerificationCodeEntity } from 'src/core/data-layer/mysql-typeorm/entities/verification-code.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { IVerificationCodeRepository } from './verification-code.repository.abstract';

@Injectable()
export class VerificationCodeRepository
  extends MySQLTypeORMDataLayerRepository<VerificationCodeEntity>
  implements IVerificationCodeRepository<VerificationCodeEntity>
{
  constructor(
    @InjectRepository(VerificationCodeEntity)
    private readonly verificationCodeEntityRepository: Repository<VerificationCodeEntity>,
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
