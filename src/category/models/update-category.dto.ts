import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCategoryDTO } from './create-category.dto';

export class UpdateCategoryDTO extends PartialType(
  OmitType(CreateCategoryDTO, ['parentCategoryId']),
) {}
