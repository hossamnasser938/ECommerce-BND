import { StreamableFile } from '@nestjs/common';

import { ICustomMulterFileProperties } from './file-storage.types';

export abstract class AbstractFileStorageService {
  abstract saveFile(
    file: Express.Multer.File,
    cb: (
      error: any,
      customMulterFileProperties: ICustomMulterFileProperties,
    ) => void,
  ): Promise<void>;

  abstract deleteFile(fileStorageIdentifier: string): Promise<void>;

  abstract streamFile(fileName: string): StreamableFile;

  abstract getFileURL(fileStorageIdentifier: string): Promise<string>;
}
