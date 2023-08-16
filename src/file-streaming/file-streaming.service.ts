import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { FSFileStorageService } from 'src/file-storage/fs-file-storage.service';

@Injectable()
export class FileStreamingService {
  constructor(
    @Inject('FileStorageService')
    private readonly fsFileStorageService: FSFileStorageService,
  ) {}

  streamFile(fileName: string) {
    const fileStream = createReadStream(
      this.fsFileStorageService.getFilePath(fileName),
    );
    return new StreamableFile(fileStream);
  }
}
