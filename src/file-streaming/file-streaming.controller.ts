import { Controller, Get, Header, Inject, Param } from '@nestjs/common';

import { FileStreamingService } from './file-streaming.service';

@Controller('uploads')
export class FileStreamingController {
  constructor(
    @Inject(FileStreamingService)
    private readonly fileStreamingService: FileStreamingService,
  ) {}

  @Header('Content-Type', 'image/jpeg')
  @Get(':file_name')
  streamFile(@Param('file_name') fileName: string) {
    return this.fileStreamingService.streamFile(fileName);
  }
}
