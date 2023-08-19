import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from 'src/core/data-layer/mysql-typeorm/entities/city.entity';

import { CITY_REPOSITORY_PROVIDER_TOKEN } from './city.constants';
import { CityController } from './city.controller';
import { CityRepository } from './city.repository';
import { CityService } from './city.service';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity])],
  providers: [
    { provide: CITY_REPOSITORY_PROVIDER_TOKEN, useClass: CityRepository },
    CityService,
  ],
  controllers: [CityController],
})
export class CityModule {}
