import { MinLength, IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @MinLength(5)
  password: string;

  @IsString()
  name: string;
}
