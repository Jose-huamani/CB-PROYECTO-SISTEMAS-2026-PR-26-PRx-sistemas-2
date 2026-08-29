import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

import { MailService } from '@shared/infrastructure/mail/mail.service';

@Injectable()
export class MailHealthIndicator {
  constructor(
    private readonly mailService: MailService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.mailService.verifyConnection();

      return indicator.up();
    } catch {
      return indicator.down();
    }
  }
}
