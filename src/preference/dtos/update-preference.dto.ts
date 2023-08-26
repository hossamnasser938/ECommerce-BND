import { IsBoolean } from 'class-validator';

export class UpdatePreferenceDTO {
  @IsBoolean()
  getNotifications: boolean;
}
