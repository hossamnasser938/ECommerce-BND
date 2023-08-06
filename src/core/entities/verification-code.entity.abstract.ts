import { BaseEntity } from './base-entity.abstract';
import { IUser } from './user.entity.abstract';

export interface IVerificationCode extends BaseEntity {
  code: string;
  validUntil: Date;
  used: boolean;
  user: IUser;
}
