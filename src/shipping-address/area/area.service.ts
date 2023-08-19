import { Inject, Injectable } from '@nestjs/common';
import { IArea } from 'src/core/entities/area-entity.abstract';

import { AREA_REPOSITORY_PROVIDER_TOKEN } from './area.constants';
import { IAreaRepository } from './area.repository.abstract';

@Injectable()
export class AreaService {
  constructor(
    @Inject(AREA_REPOSITORY_PROVIDER_TOKEN)
    private readonly areaRepository: IAreaRepository<IArea>,
  ) {}
}
