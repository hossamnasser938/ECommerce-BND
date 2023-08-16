import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import * as path from 'path';
import { FileEntity } from 'src/core/data-layer/mysql-typeorm/entities/file.entity';
import { uuid } from 'uuidv4';

import { AbstractFileStorageService } from './file-storage.service.abstract';
import { ICustomMulterFileProperties } from './file-storage.types';
import { UPLOADS_DESTINATION } from './fs-file-storeage.constants';

export class FSFileStorageService extends AbstractFileStorageService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super();
    this.prepareDestination();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const fsFileStorageServiceInstance = this;
    FileEntity.prototype.setPath = async function () {
      (this as FileEntity).url = await fsFileStorageServiceInstance.getFileURL(
        (this as FileEntity).storageIdentifier,
      );
    };
  }

  private prepareDestination(): void {
    if (!existsSync(UPLOADS_DESTINATION)) {
      mkdirSync(UPLOADS_DESTINATION);
    }
  }

  private constructFileName(mimeType: string) {
    const [, extension] = mimeType.split('/');
    const uniqueId = uuid();
    const fileName = `${uniqueId}.${extension}`;
    return fileName;
  }

  getFilePath(fileName: string): string {
    return path.join(UPLOADS_DESTINATION, fileName);
  }

  async saveFile(
    file: Express.Multer.File,
    cb: (
      error: any,
      customMulterFileProperties: ICustomMulterFileProperties,
    ) => void,
  ): Promise<void> {
    const fileName = this.constructFileName(file.mimetype);
    const filePath = this.getFilePath(fileName);
    console.log('saveFile filePath', filePath);
    const outStream = createWriteStream(filePath);

    file.stream.pipe(outStream);
    outStream.on('error', cb);
    outStream.on('finish', function () {
      cb(null, { storageIdentifier: fileName, size: outStream.bytesWritten });
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    const filePath = this.getFilePath(fileName);
    unlinkSync(filePath);
  }

  async getFileURL(fileName: string): Promise<string> {
    const httpPtotocol = this.configService.get<string>('HTTP_PROTOCOL');
    const host = this.configService.get<string>('HOST');
    const port = this.configService.get<string>('PORT');

    return `${httpPtotocol}://${host}:${port}/${this.getFilePath(fileName)}`;
  }
}
