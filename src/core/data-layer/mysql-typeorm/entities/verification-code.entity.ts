import { IVerificationCode } from 'src/core/entities/verification-code.entity.abstract';
import { BaseEntity } from '../base-entity.abstract';
import { Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

export class VerificationCodeEntity
  extends BaseEntity
  implements IVerificationCode
{
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
