import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/core/data-layer/mysql-typeorm/entities/profile.entity';
import { FileModule } from 'src/file/file.module';

import { PROFILE_REPOSITORY_PROVIDER_TOKEN } from './profile.constants';
import { ProfileController } from './profile.controller';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity]), FileModule],
  providers: [
    ProfileService,
    { provide: PROFILE_REPOSITORY_PROVIDER_TOKEN, useClass: ProfileRepository },
  ],
  exports: [PROFILE_REPOSITORY_PROVIDER_TOKEN],
  controllers: [ProfileController],
})
export class ProfileModule {}
