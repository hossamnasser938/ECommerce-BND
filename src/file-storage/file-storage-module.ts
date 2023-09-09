import { Module } from '@nestjs/common';

import { FileStorageController } from './file-storage.controller';
import { FILE_STOREAGE_SERVICE_PROVIDER_TOKEN } from './file-storeage.constants';
import { GCloudFileStorageService } from './gcloud-file-storage.service';

@Module({
  providers: [
    {
      provide: FILE_STOREAGE_SERVICE_PROVIDER_TOKEN,
      useClass: GCloudFileStorageService,
    },
  ],
  exports: [FILE_STOREAGE_SERVICE_PROVIDER_TOKEN],
  controllers: [FileStorageController],
})
export class FileStorageModule {}
