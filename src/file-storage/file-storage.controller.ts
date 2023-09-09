import { Controller, Get, Header, Inject, Param } from '@nestjs/common';

import { FileStreamingRoute } from './file-storage.constants';
import { AbstractFileStorageService } from './file-storage.service.abstract';
import { FILE_STOREAGE_SERVICE_PROVIDER_TOKEN } from './file-storeage.constants';

@Controller(FileStreamingRoute)
export class FileStorageController {
  constructor(
    @Inject(FILE_STOREAGE_SERVICE_PROVIDER_TOKEN)
    private readonly fileStorageService: AbstractFileStorageService,
  ) {}

  @Header('Content-Type', 'image/jpeg')
  @Get(':file_name')
  streamFile(@Param('file_name') fileName: string) {
    return this.fileStorageService.streamFile(fileName);
  }
}
