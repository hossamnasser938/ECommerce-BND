import { PartialType } from '@nestjs/mapped-types';
import { CreateShippingAddressDTO } from './create-shipping-address.dto';

export class UpdateShippingAddressDTO extends PartialType(
  CreateShippingAddressDTO,
) {}
