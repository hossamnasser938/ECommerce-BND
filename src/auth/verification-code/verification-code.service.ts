import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationCode } from './verification-code.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import * as moment from 'moment';
import { generateVerificationCode } from '../utils/verification-code-generator';
import {
  VERIFICATION_CODE_MINUTES_VALIDITY,
  VERIFICATION_EMAIL_SUBJECT,
  VERIFICATION_EMAIL_TEXT,
} from '../utils/config-constants';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';

@Injectable()
export class VerificationCodeService {
  constructor(
    @InjectRepository(VerificationCode)
    private verificationCodeRepository: Repository<VerificationCode>,
    @Inject(NodeMailerService) private nodeMailerService: NodeMailerService,
  ) {}

  createOne(user: User) {
    const verificationCode = new VerificationCode();
    verificationCode.user = user;
    verificationCode.code = generateVerificationCode();
    verificationCode.validUntil = new Date(
      moment().add(VERIFICATION_CODE_MINUTES_VALIDITY, 'minutes').toString(),
    );
    verificationCode.used = false;

    return this.verificationCodeRepository.save(verificationCode);
  }

  sendOne(verificationCode: VerificationCode) {
    return this.nodeMailerService.sendEmail(
      verificationCode.user.email,
      VERIFICATION_EMAIL_SUBJECT,
      VERIFICATION_EMAIL_TEXT(verificationCode.code),
    );
  }

  async createAndSendOne(user: User) {
    const verificationCode = await this.createOne(user);

    await this.sendOne(verificationCode);

    return verificationCode;
  }

  async verify(user: User, code: string) {
    const verificationCode = await this.verificationCodeRepository.findOneBy({
      user,
      code,
    });

    if (!verificationCode || verificationCode.used)
      throw new ForbiddenException('Invalid verification code');

    if (verificationCode.validUntil < new Date())
      throw new ForbiddenException('Verification code is no longer valid');

    await this.verificationCodeRepository.update(verificationCode.id, {
      used: true,
    });

    return true;
  }
}
