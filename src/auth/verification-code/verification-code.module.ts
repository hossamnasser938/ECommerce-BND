import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCodeEntity } from 'src/core/data-layer/mysql-typeorm/entities/verification-code.entity';
import { MessageSenderModule } from 'src/message-sender/message-sender.module';

import { VERIFICATION_CODE_REPOSITORY_PROVIDER_TOKEN } from './verification-code.constants';
import { VerificationCodeRepository } from './verification-code.repository';
import { VerificationCodeService } from './verification-code.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationCodeEntity]),
    MessageSenderModule,
  ],
  providers: [
    VerificationCodeService,
    {
      provide: VERIFICATION_CODE_REPOSITORY_PROVIDER_TOKEN,
      useClass: VerificationCodeRepository,
    },
  ],
  exports: [
    VerificationCodeService,
    VERIFICATION_CODE_REPOSITORY_PROVIDER_TOKEN,
  ],
})
export class VerificationCodeModule {}
