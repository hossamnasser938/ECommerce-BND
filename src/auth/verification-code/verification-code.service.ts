import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { generateVerificationCode } from '../utils/verification-code-generator';
import {
  VERIFICATION_CODE_MINUTES_VALIDITY,
  VERIFICATION_EMAIL_SUBJECT,
  VERIFICATION_EMAIL_TEXT,
} from '../utils/config-constants';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { IVerificationCodeRepository } from './verification-code.repository.abstract';
import { IVerificationCode } from 'src/core/entities/verification-code.entity.abstract';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IUser } from 'src/core/entities/user.entity.abstract';

@Injectable()
export class VerificationCodeService {
  constructor(
    @Inject('IVerificationCodeRepository')
    private verificationCodeRepository: IVerificationCodeRepository<IVerificationCode>,
    @Inject(NodeMailerService) private nodeMailerService: NodeMailerService,
  ) {}

  createOne(user: IUser) {
    const code = generateVerificationCode();
    const validUntil = new Date(
      moment().add(VERIFICATION_CODE_MINUTES_VALIDITY, 'minutes').toString(),
    );

    return this.verificationCodeRepository.createOne(user, code, validUntil);
  }

  sendOne(verificationCode: IVerificationCode) {
    return this.nodeMailerService.sendEmail(
      verificationCode.user.email,
      VERIFICATION_EMAIL_SUBJECT,
      VERIFICATION_EMAIL_TEXT(verificationCode.code),
    );
  }

  async createAndSendOne(user: IUser) {
    const verificationCode = await this.createOne(user);

    await this.sendOne(verificationCode);

    return verificationCode;
  }

  async verify(userId: Identifier, code: string) {
    const verificationCode =
      await this.verificationCodeRepository.getOneByCondition({
        user: { id: userId },
        code,
      });

    if (!verificationCode || verificationCode.used)
      throw new ForbiddenException(ERROR_MESSAGES.INVALID_VERIFICATION_CODE);

    if (verificationCode.validUntil < new Date())
      throw new ForbiddenException(ERROR_MESSAGES.EXPIRED_VERIFICATION_CODE);

    await this.verificationCodeRepository.updateOneById(verificationCode.id, {
      used: true,
    });

    return true;
  }
}
