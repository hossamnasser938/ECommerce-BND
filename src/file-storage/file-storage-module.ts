import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FSFileStorageService } from './fs-file-storage.service';
import { FILE_STOREAGE_SERVICE_PROVIDER_TOKEN } from './fs-file-storeage.constants';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: FILE_STOREAGE_SERVICE_PROVIDER_TOKEN,
      useClass: FSFileStorageService,
    },
  ],
  exports: [FILE_STOREAGE_SERVICE_PROVIDER_TOKEN],
})
export class FileStorageModule {}
