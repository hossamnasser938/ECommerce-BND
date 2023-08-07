import { IsEmail } from 'class-validator';

import { IsPassword } from '../utils/validation-utils';

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsPassword()
  password: string;
}
