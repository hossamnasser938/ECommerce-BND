import { Controller, Get, Inject, Query } from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';

import { CityService } from './city.service';

@Controller('cities')
export class CityController {
  constructor(@Inject(CityService) private readonly cityService: CityService) {}

  @Get()
  getAll(@Query() paginationParametersDTO: PaginationParamsDTO) {
    return this.cityService.getAll(paginationParametersDTO);
  }
}
