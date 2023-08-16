import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { Request } from 'express';
import { AbstractFileStorageService } from 'src/file-storage/file-storage.service.abstract';
import { FileStorageModule } from 'src/file-storage/file-storage-module';
import { FILE_STOREAGE_SERVICE_PROVIDER_TOKEN } from 'src/file-storage/fs-file-storeage.constants';

import { ExtendedMulterFile } from './multer-wrapper.types';

function StorageEngineFactory(fileStorageService: AbstractFileStorageService) {
  return {
    _handleFile: async (
      req: Request,
      file: Express.Multer.File,
      cb: (error: any, data?: any) => void,
    ) => {
      fileStorageService.saveFile(file, cb);
    },
    _removeFile: async (
      req: Request,
      file: ExtendedMulterFile,
      cb: (error: any, data?: any) => void,
    ) => {
      try {
        await fileStorageService.deleteFile(file.storageIdentifier);
        cb(null);
      } catch (err) {
        cb(err);
      }
    },
  };
}

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [FileStorageModule],
      inject: [FILE_STOREAGE_SERVICE_PROVIDER_TOKEN],
      useFactory: (fileStorageService: AbstractFileStorageService) => ({
        storage: StorageEngineFactory(fileStorageService),
      }),
    }),
  ],
  exports: [MulterModule],
})
export class MulterWrapperModule {}
