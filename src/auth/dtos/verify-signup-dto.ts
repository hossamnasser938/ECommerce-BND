import { IsEmail } from 'class-validator';

import { IsVerificationCode } from '../utils/validation-utils';

export class VerifyDTO {
  @IsEmail()
  email: string;

  @IsVerificationCode()
  code: string;
}
