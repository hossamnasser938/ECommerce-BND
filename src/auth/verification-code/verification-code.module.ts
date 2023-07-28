import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCode } from './verification-code.entity';
import { VerificationCodeService } from './verification-code.service';
import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationCode]), NodeMailerModule],
  providers: [VerificationCodeService],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
