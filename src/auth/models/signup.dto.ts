import { SignInDTO } from './signin.dto';
import { IsString } from 'class-validator';

export class SignUpDTO extends SignInDTO {
  @IsString()
  name: string;
}
