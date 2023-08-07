import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerificationCodeModule } from './verification-code/verification-code.module';

@Module({
  imports: [VerificationCodeModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
