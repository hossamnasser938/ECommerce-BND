import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { FSWrapperService } from 'src/fs-wrapper/fs-wrapper.service';

@Injectable()
export class FileStreamingService {
  constructor(
    @Inject(FSWrapperService)
    private readonly fsWrapperService: FSWrapperService,
  ) {}

  streamFile(fileName: string) {
    const fileStream = createReadStream(
      this.fsWrapperService.getFilePath(fileName),
    );
    return new StreamableFile(fileStream);
  }
}
