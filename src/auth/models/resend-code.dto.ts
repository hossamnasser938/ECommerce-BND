import { IsNumber } from 'class-validator';

export class ResendCodeDTO {
  @IsNumber()
  userId: number;
}
