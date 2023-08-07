import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShippingAddressDTO {
  @IsString()
  city: string;

  @IsString()
  area: string;

  @IsString()
  street: string;

  @IsNumber()
  building: number;

  @IsNumber()
  apartment: number;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
