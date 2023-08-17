import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigWrapperService } from './config-wrapper.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [ConfigWrapperService],
  exports: [ConfigWrapperService],
})
export class ConfigWrapperModule {}
