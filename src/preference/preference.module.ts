import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferenceEntity } from 'src/core/data-layer/mysql-typeorm/entities/preference.entity';

import { PREFERENCE_REPOSITORY_PROVIDER_TOKEN } from './preference.constants';
import { PreferenceController } from './preference.controller';
import { PreferenceRepository } from './preference.repository';
import { PreferenceService } from './preference.service';

@Module({
  imports: [TypeOrmModule.forFeature([PreferenceEntity])],
  providers: [
    PreferenceService,
    {
      provide: PREFERENCE_REPOSITORY_PROVIDER_TOKEN,
      useClass: PreferenceRepository,
    },
  ],
  controllers: [PreferenceController],
  exports: [PreferenceService],
})
export class PreferenceModule {}
