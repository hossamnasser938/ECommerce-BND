import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MAIL_SERVICE_PROVIDER_TOKEN } from './mail.constants';
import { NodeMailerService } from './node-mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [
    { provide: MAIL_SERVICE_PROVIDER_TOKEN, useClass: NodeMailerService },
  ],
  exports: [MAIL_SERVICE_PROVIDER_TOKEN],
})
export class MailModule {}
