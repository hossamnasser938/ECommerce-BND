import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import * as path from 'path';
import { FileEntity } from 'src/core/data-layer/mysql-typeorm/entities/file.entity';
import { uuid } from 'uuidv4';

import { UPLOADS_DESTINATION } from './fs-wrapper.constants';

@Injectable()
export class FSWrapperService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    // TODO: discuss with Affan
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const fSWrapperServiceInstance = this;
    FileEntity.prototype.setPath = function () {
      this.path = fSWrapperServiceInstance.getFileURL(this.name);
    };
  }

  prepareDestination(): string {
    if (!existsSync(UPLOADS_DESTINATION)) {
      mkdirSync(UPLOADS_DESTINATION);
    }

    return UPLOADS_DESTINATION;
  }

  constructFileName(mimeType: string) {
    const [, extension] = mimeType.split('/');
    const uniqueId = uuid();
    const fileName = `${uniqueId}.${extension}`;
    return fileName;
  }

  getFilePath(fileName: string): string {
    return path.join(UPLOADS_DESTINATION, fileName);
  }

  getFileURL(fileName: string) {
    const httpPtotocol = this.configService.get<string>('HTTP_PROTOCOL');
    const host = this.configService.get<string>('HOST');
    const port = this.configService.get<string>('PORT');

    return `${httpPtotocol}://${host}:${port}/${this.getFilePath(fileName)}`;
  }

  deleteFile(fileName: string) {
    const filePath = this.getFilePath(fileName);
    unlinkSync(filePath);
  }

  deleteFiles(fileNames: string[]) {
    fileNames.forEach((fileName) => {
      this.deleteFile(fileName);
    });
  }
}
