import { IsEmail } from 'class-validator';
import { IsPassword } from 'src/auth/utils/validation-utils';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsPassword()
  password: string;
}
