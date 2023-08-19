import { Inject, Injectable } from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { ICity } from 'src/core/entities/city-entity.abstract';

import { CITY_REPOSITORY_PROVIDER_TOKEN } from './city.constants';
import { ICityRepository } from './city.repository.abstract';

@Injectable()
export class CityService {
  constructor(
    @Inject(CITY_REPOSITORY_PROVIDER_TOKEN)
    private readonly cityRepository: ICityRepository<ICity>,
  ) {}

  getAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.cityRepository.getAll(paginationParametersDTO);
  }
}
