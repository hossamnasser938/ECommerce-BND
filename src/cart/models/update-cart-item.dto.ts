import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCartItemDTO } from './create-cart-item.dto';

export class UpdateCartItemDTO extends PartialType(
  OmitType(CreateCartItemDTO, ['productId']),
) {}
