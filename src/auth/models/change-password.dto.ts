import { IsPassword } from '../utils/validation-utils';

export class ChangePasswordDTO {
  @IsPassword()
  oldPassword: string;

  @IsPassword()
  newPassword: string;
}
