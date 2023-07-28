import { IsEmail } from 'class-validator';

export class ResendCodeDTO {
  @IsEmail()
  email: string;
}
