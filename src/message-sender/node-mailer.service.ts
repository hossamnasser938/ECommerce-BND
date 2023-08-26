import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigWrapperService } from 'src/config-wrapper/config-wrapper.service';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

import { AbstractMessageSenderService } from './message-sender.service.abstract';

@Injectable()
export class NodeMailerService extends AbstractMessageSenderService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    @Inject(ConfigWrapperService)
    private readonly configWrapperService: ConfigWrapperService,
  ) {
    super();

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: configWrapperService.NODEMAILER_USER,
        pass: configWrapperService.NODEMAILER_PASSWORD,
      },
    });
  }

  async sendMessage(user: IUser, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      to: user.email,
      subject,
      text,
    });

    if (!info.messageId) throw new Error(ERROR_MESSAGES.EMAIL_NOT_SENT);
  }
}
