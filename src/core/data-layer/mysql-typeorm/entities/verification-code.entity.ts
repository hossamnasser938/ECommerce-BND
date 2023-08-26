import { IVerificationCode } from 'src/core/entities/verification-code.entity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { UserEntity } from './user.entity';

@Entity({ name: 'verification_code' })
export class VerificationCodeEntity
  extends BaseEntity
  implements IVerificationCode
{
  constructor(code: string, validUntil: Date, user: UserEntity, used = false) {
    super();
    this.code = code;
    this.validUntil = validUntil;
    this.user = user;
    this.used = used;
  }

  @Column()
  code: string;

  @Column()
  validUntil: Date;

  @Column()
  used: boolean;

  @ManyToOne(() => UserEntity, (user) => user.verificationCodes, {
    eager: true,
  })
  user: UserEntity;
}
