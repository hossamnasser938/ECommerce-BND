import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { FSFileStorageService } from 'src/file-storage/fs-file-storage.service';
import { FILE_STOREAGE_SERVICE_PROVIDER_TOKEN } from 'src/file-storage/fs-file-storeage.constants';

@Injectable()
export class FileStreamingService {
  constructor(
    @Inject(FILE_STOREAGE_SERVICE_PROVIDER_TOKEN)
    private readonly fsFileStorageService: FSFileStorageService,
  ) {}

  streamFile(fileName: string) {
    const fileStream = createReadStream(
      this.fsFileStorageService.getFilePath(fileName),
    );
    return new StreamableFile(fileStream);
  }
}
