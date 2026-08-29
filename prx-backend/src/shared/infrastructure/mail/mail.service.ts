import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

import { APP_MESSAGES } from '@shared/constants/app-messages.constants';
import { baseLayout } from '@shared/infrastructure/mail/templates/layouts/base.layout';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly logoPath: string;

  constructor(private readonly configService: ConfigService) {
    this.from = this.configService.getOrThrow<string>('mail.from');

    this.logoPath = join(__dirname, 'assets', 'prx-logo.png');

    const port = this.configService.getOrThrow<number>('mail.port');

    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('mail.host'),
      port,
      secure: port === 465,
      auth: {
        user: this.configService.getOrThrow<string>('mail.user'),
        pass: this.configService.getOrThrow<string>('mail.pass'),
      },
    });
  }

  async verifyConnection(): Promise<void> {
    await this.transporter.verify();
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html: baseLayout(html),
        attachments: [
          {
            filename: 'prx-logo.png',
            path: this.logoPath,
            cid: 'prx-logo',
          },
        ],
      });
    } catch {
      throw new InternalServerErrorException(APP_MESSAGES.MAIL_SEND_ERROR);
    }
  }
}
