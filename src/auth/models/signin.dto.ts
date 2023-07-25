import { MinLength, IsEmail } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  email: string;

  @MinLength(5)
  password: string;
}
