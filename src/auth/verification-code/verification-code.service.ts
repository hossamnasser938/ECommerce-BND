import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { IVerificationCode } from 'src/core/entities/verification-code.entity.abstract';
import { MESSAGE_SENDER_SERVICE_PROVIDER_TOKEN } from 'src/message-sender/message-sender.constants';
import { AbstractMessageSenderService } from 'src/message-sender/message-sender.service.abstract';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

import {
  VERIFICATION_CODE_MINUTES_VALIDITY,
  VERIFICATION_MESSAGE_SUBJECT,
  VERIFICATION_MESSAGE_TEXT,
} from '../utils/config-constants';
import { generateVerificationCode } from '../utils/verification-code-generator';
import { VERIFICATION_CODE_REPOSITORY_PROVIDER_TOKEN } from './verification-code.constants';
import { IVerificationCodeRepository } from './verification-code.repository.abstract';

@Injectable()
export class VerificationCodeService {
  constructor(
    @Inject(VERIFICATION_CODE_REPOSITORY_PROVIDER_TOKEN)
    private readonly verificationCodeRepository: IVerificationCodeRepository<IVerificationCode>,
    @Inject(MESSAGE_SENDER_SERVICE_PROVIDER_TOKEN)
    private readonly messageSenderService: AbstractMessageSenderService,
  ) {}

  createOne(user: IUser) {
    const code = generateVerificationCode();
    const validUntil = new Date(
      moment().add(VERIFICATION_CODE_MINUTES_VALIDITY, 'minutes').toString(),
    );

    return this.verificationCodeRepository.createOne(user, code, validUntil);
  }

  sendOne(verificationCode: IVerificationCode) {
    return this.messageSenderService.sendMessage(
      verificationCode.user,
      VERIFICATION_MESSAGE_SUBJECT,
      VERIFICATION_MESSAGE_TEXT(verificationCode.code),
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
