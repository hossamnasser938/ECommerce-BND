import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

import { AbstractMailService } from './mail.service.abstract';

@Injectable()
export class NodeMailerService extends AbstractMailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super();

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: configService.get<string>('NODEMAILER_USER'),
        pass: configService.get<string>('NODEMAILER_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      to,
      subject,
      text,
    });

    if (!info.messageId) throw new Error(ERROR_MESSAGES.EMAIL_NOT_SENT);
  }
}