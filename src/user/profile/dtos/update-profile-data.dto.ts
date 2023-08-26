import { IsString } from 'class-validator';

export class UpdateProfileDataDTO {
  @IsString()
  name: string;
}
