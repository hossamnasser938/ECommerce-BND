import { Module } from '@nestjs/common';

import { MESSAGE_SENDER_SERVICE_PROVIDER_TOKEN } from './message-sender.constants';
import { NodeMailerService } from './node-mailer.service';

@Module({
  providers: [
    {
      provide: MESSAGE_SENDER_SERVICE_PROVIDER_TOKEN,
      useClass: NodeMailerService,
    },
  ],
  exports: [MESSAGE_SENDER_SERVICE_PROVIDER_TOKEN],
})
export class MessageSenderModule {}
