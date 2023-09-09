import { Inject, StreamableFile } from '@nestjs/common';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  unlinkSync,
} from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import { ConfigWrapperService } from 'src/config-wrapper/config-wrapper.service';
import { FileEntity } from 'src/core/data-layer/mysql-typeorm/entities/file.entity';
import { uuid } from 'uuidv4';

import { FileStreamingRoute } from './file-storage.constants';
import { AbstractFileStorageService } from './file-storage.service.abstract';
import { ICustomMulterFileProperties } from './file-storage.types';

export class FSFileStorageService extends AbstractFileStorageService {
  constructor(
    @Inject(ConfigWrapperService)
    private readonly configWrapperService: ConfigWrapperService,
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

  private UPLOADS_DESTINATION = path.join(
    homedir(),
    this.configWrapperService.GCS_MOUNTED_FOLDER_NAME,
  );

  private prepareDestination(): void {
    if (!existsSync(this.UPLOADS_DESTINATION)) {
      mkdirSync(this.UPLOADS_DESTINATION);
    }
  }

  private constructFileName(mimeType: string) {
    const [, extension] = mimeType.split('/');
    const uniqueId = uuid();
    const fileName = `${uniqueId}.${extension}`;
    return fileName;
  }

  getFilePath(fileName: string): string {
    return path.join(this.UPLOADS_DESTINATION, fileName);
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

  streamFile(fileName: string) {
    const fileStream = createReadStream(this.getFilePath(fileName));
    return new StreamableFile(fileStream);
  }

  async getFileURL(fileName: string): Promise<string> {
    const httpPtotocol = this.configWrapperService.HTTP_PROTOCOL;
    const host = this.configWrapperService.HOST;
    const port = this.configWrapperService.HOST_PORT;

    return `${httpPtotocol}://${host}:${port}/${FileStreamingRoute}/${fileName}`;
  }
}
