import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}
