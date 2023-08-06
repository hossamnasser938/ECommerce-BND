import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { IVerificationCode } from 'src/core/entities/verification-code.entity.abstract';

export interface IVerificationCodeRepository<T extends IVerificationCode>
  extends GenericRepository<T> {
  createOne(user: IUser, code: string, validUntil: Date): Promise<T>;
}
