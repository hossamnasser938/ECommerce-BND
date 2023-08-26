import { IsEmail } from 'class-validator';

import { IsPassword, IsVerificationCode } from '../utils/validation-utils';

export class ResetPasswordDTO {
  @IsVerificationCode()
  token: string;

  @IsEmail()
  email: string;

  @IsPassword()
  newPassword: string;
}
