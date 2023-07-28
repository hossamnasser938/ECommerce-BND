import { IsNumber } from 'class-validator';
import { IsVerificationCode } from '../utils/validation-utils';

export class VerifySignUpDTO {
  @IsNumber()
  userId: number;

  @IsVerificationCode()
  verificationCode: string;
}
