import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NodeMailerService } from './node-mailer.service';

@Module({
  providers: [NodeMailerService],
  exports: [NodeMailerService],
  imports: [ConfigModule],
})
export class NodeMailerModule {}
