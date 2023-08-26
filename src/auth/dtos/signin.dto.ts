import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { DeviceType } from 'src/notification-token/notification-token.types';

import { IsPassword } from '../utils/validation-utils';

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsPassword()
  password: string;

  @IsString()
  @IsOptional()
  notificationToken?: string;

  @IsEnum(DeviceType)
  @IsOptional()
  deviceType?: DeviceType;
}
