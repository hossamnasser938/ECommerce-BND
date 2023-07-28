import { Module } from '@nestjs/common';
import { NodeMailerService } from './node-mailer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [NodeMailerService],
  exports: [NodeMailerService],
  imports: [ConfigModule],
})
export class NodeMailerModule {}
