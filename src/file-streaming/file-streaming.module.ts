import { Module } from '@nestjs/common';
import { FileStorageModule } from 'src/file-storage/file-storage-module';

import { FileStreamingController } from './file-streaming.controller';
import { FileStreamingService } from './file-streaming.service';

@Module({
  imports: [FileStorageModule],
  providers: [FileStreamingService],
  controllers: [FileStreamingController],
})
export class FileStreamingModule {}
