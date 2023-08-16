import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FSFileStorageService } from './fs-file-storage.service';

@Module({
  imports: [ConfigModule],
  providers: [
    { provide: 'FileStorageService', useClass: FSFileStorageService },
  ],
  exports: ['FileStorageService'],
})
export class FileStorageModule {}
