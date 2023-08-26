import { Controller, Inject } from '@nestjs/common';

import { AreaService } from './area.service';

@Controller('areas')
export class AreaController {
  constructor(@Inject(AreaService) private readonly areaService: AreaService) {}
}
