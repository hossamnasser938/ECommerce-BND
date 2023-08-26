import { IsString } from 'class-validator';

export class CreateNotificationDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;
}
