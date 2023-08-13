import { Module } from '@nestjs/common';

import { FSWrapperService } from './fs-wrapper.service';

@Module({
  providers: [FSWrapperService],
  exports: [FSWrapperService],
})
export class FSWrapperModule {}
