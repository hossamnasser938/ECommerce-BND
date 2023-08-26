import { Module } from '@nestjs/common';
import { NotificationTokenModule } from 'src/notification-token/notification-token.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerificationCodeModule } from './verification-code/verification-code.module';

@Module({
  imports: [VerificationCodeModule, NotificationTokenModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
