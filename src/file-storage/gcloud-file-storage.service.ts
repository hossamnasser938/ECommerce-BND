import { Bucket, Storage } from '@google-cloud/storage';
import { Inject, StreamableFile } from '@nestjs/common';
import { ConfigWrapperService } from 'src/config-wrapper/config-wrapper.service';
import { FileEntity } from 'src/core/data-layer/mysql-typeorm/entities/file.entity';
import { uuid } from 'uuidv4';

import { AbstractFileStorageService } from './file-storage.service.abstract';
import { ICustomMulterFileProperties } from './file-storage.types';

export class GCloudFileStorageService extends AbstractFileStorageService {
  private storage: Storage;
  private bucket: Bucket;

  constructor(
    @Inject(ConfigWrapperService)
    configWrapperService: ConfigWrapperService,
  ) {
    super(configWrapperService);

    this.storage = new Storage();
    this.bucket = this.storage.bucket(configWrapperService.GCS_BUCKET_NAME);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const gcloudFileStorageServiceInstance = this;
    FileEntity.prototype.setPath = async function () {
      (this as FileEntity).url =
        await gcloudFileStorageServiceInstance.getFileURL(
          (this as FileEntity).storageIdentifier,
        );
    };
  }

  private constructFileName(mimeType: string) {
    const [, extension] = mimeType.split('/');
    const uniqueId = uuid();
    const fileName = `${uniqueId}.${extension}`;
    return fileName;
  }

  async saveFile(
    file: Express.Multer.File,
    cb: (
      error: any,
      customMulterFileProperties: ICustomMulterFileProperties,
    ) => void,
  ): Promise<void> {
    const fileName = this.constructFileName(file.mimetype);
    const destinationFile = this.bucket.file(fileName);
    const outStream = destinationFile.createWriteStream();

    let size = 0;
    file.stream.on('data', (chunk) => {
      size += chunk.length;
    });

    file.stream.pipe(outStream);
    outStream.on('error', cb);
    outStream.on('finish', function () {
      console.log('size', size);
      cb(null, { storageIdentifier: fileName, size });
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.bucket.file(fileName).delete();
  }

  streamFile(fileName: string) {
    const fileStream = this.bucket.file(fileName).createReadStream();
    return new StreamableFile(fileStream);
  }
}
