import { IsEnum, IsString } from 'class-validator';

import { DeviceType } from '../notification-token.types';

export class CreateNotificationTokenDTO {
  @IsString()
  value: string;

  @IsEnum(DeviceType)
  deviceType: DeviceType;
}
