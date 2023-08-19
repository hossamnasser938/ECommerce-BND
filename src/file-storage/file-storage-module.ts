import { Module } from '@nestjs/common';

import { FileStorageController } from './file-storage.controller';
import { FSFileStorageService } from './fs-file-storage.service';
import { FILE_STOREAGE_SERVICE_PROVIDER_TOKEN } from './fs-file-storeage.constants';

@Module({
  providers: [
    {
      provide: FILE_STOREAGE_SERVICE_PROVIDER_TOKEN,
      useClass: FSFileStorageService,
    },
  ],
  exports: [FILE_STOREAGE_SERVICE_PROVIDER_TOKEN],
  controllers: [FileStorageController],
})
export class FileStorageModule {}
