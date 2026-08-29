import { Injectable } from '@nestjs/common';

import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';

@Injectable()
export class VerificationCodeService {
  generateCode(length = AUTH_CONSTANTS.VERIFICATION.CODE_LENGTH): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      '',
    );
  }

  generateExpirationDate(minutes: number): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}
