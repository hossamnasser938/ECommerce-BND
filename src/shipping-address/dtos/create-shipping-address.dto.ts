import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShippingAddressDTO {
  @IsNumber()
  areaId: number;

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
