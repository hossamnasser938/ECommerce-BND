import { Module } from '@nestjs/common';
import { FSWrapperModule } from 'src/fs-wrapper/fs-wrapper.module';

import { FileStreamingController } from './file-streaming.controller';
import { FileStreamingService } from './file-streaming.service';

@Module({
  imports: [FSWrapperModule],
  providers: [FileStreamingService],
  controllers: [FileStreamingController],
})
export class FileStreamingModule {}
