import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

import { APP_MESSAGES } from '@shared/constants/app-messages.constants';
import { baseLayout } from '@shared/infrastructure/mail/templates/layouts/base.layout';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter?: nodemailer.Transporter;
  private readonly from: string;
  private readonly logoPath: string;
  private readonly enabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.getOrThrow<string>('mail.host');
    const user = this.configService.getOrThrow<string>('mail.user');
    const pass = this.configService.getOrThrow<string>('mail.pass');
    this.from =
      this.configService.getOrThrow<string>('mail.from') ||
      'PRX <no-reply@localhost>';
    this.logoPath = join(__dirname, 'assets', 'prx-logo.png');
    const port = this.configService.getOrThrow<number>('mail.port');
    this.enabled = this.hasValidMailConfig(host, user, pass, this.from);

    if (!this.enabled) {
      this.logger.warn(
        'Correo desactivado: configura MAIL_HOST, MAIL_USER, MAIL_PASS y MAIL_FROM para enviar correos reales.',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  async verifyConnection(): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Verificacion de correo omitida: SMTP no configurado.');
      return;
    }

    await this.transporter.verify();
  }

  isConfigured(): boolean {
    return this.enabled;
  }

  logCodeWhenDisabled(purpose: string, to: string, code: string): void {
    if (this.enabled) {
      return;
    }

    this.logger.warn(`${purpose} para ${to}: ${code}`);
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      this.logger.error(`Correo no enviado a ${to}: SMTP no configurado.`);
      throw new InternalServerErrorException(APP_MESSAGES.MAIL_CONFIG_ERROR);
    }

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
    } catch (error) {
      this.logger.error(
        `No se pudo enviar el correo a ${to}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(APP_MESSAGES.MAIL_SEND_ERROR);
    }
  }

  private hasValidMailConfig(
    host: string,
    user: string,
    pass: string,
    from: string,
  ): boolean {
    const values = [host, user, pass, from].map((value) =>
      value.trim().toLowerCase(),
    );

    return values.every(
      (value) =>
        value.length > 0 &&
        !value.includes('example.com') &&
        !value.includes('change-me'),
    );
  }
}
