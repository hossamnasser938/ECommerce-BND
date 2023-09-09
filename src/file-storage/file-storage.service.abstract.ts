import { StreamableFile } from '@nestjs/common';
import { ConfigWrapperService } from 'src/config-wrapper/config-wrapper.service';

import { FileStreamingRoute } from './file-storage.constants';
import { ICustomMulterFileProperties } from './file-storage.types';

export abstract class AbstractFileStorageService {
  constructor(readonly configWrapperService: ConfigWrapperService) {}

  abstract saveFile(
    file: Express.Multer.File,
    cb: (
      error: any,
      customMulterFileProperties: ICustomMulterFileProperties,
    ) => void,
  ): Promise<void>;

  abstract deleteFile(fileStorageIdentifier: string): Promise<void>;

  abstract streamFile(fileName: string): StreamableFile;

  async getFileURL(fileName: string): Promise<string> {
    const httpPtotocol = this.configWrapperService.HTTP_PROTOCOL;
    const host = this.configWrapperService.HOST;
    const port = this.configWrapperService.HOST_PORT;

    return `${httpPtotocol}://${host}:${port}/${FileStreamingRoute}/${fileName}`;
  }
}
