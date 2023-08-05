import { IUser } from './user.entity.abstract';

export interface IVerificationCode {
  code: string;
  validUntil: Date;
  used: boolean;
  user: IUser;
}
