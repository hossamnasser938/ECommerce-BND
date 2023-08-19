import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaEntity } from 'src/core/data-layer/mysql-typeorm/entities/area.entity';

import { AREA_REPOSITORY_PROVIDER_TOKEN } from './area.constants';
import { AreaController } from './area.controller';
import { AreaRepository } from './area.repository';
import { AreaService } from './area.service';

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity])],
  providers: [
    { provide: AREA_REPOSITORY_PROVIDER_TOKEN, useClass: AreaRepository },
    AreaService,
  ],
  exports: [AREA_REPOSITORY_PROVIDER_TOKEN],
  controllers: [AreaController],
})
export class AreaModule {}
