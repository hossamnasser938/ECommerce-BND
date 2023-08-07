import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCodeEntity } from 'src/core/data-layer/mysql-typeorm/entities/verification-code.entity';
import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';

import { VerificationCodeRepository } from './verification-code.repository';
import { VerificationCodeService } from './verification-code.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationCodeEntity]),
    NodeMailerModule,
  ],
  providers: [
    VerificationCodeService,
    {
      provide: 'IVerificationCodeRepository',
      useClass: VerificationCodeRepository,
    },
  ],
  exports: [VerificationCodeService, 'IVerificationCodeRepository'],
})
export class VerificationCodeModule {}
