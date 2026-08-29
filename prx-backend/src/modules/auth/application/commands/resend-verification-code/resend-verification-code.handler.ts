import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ResendVerificationCodeCommand } from '@modules/auth/application/commands/resend-verification-code/resend-verification-code.command';
import { VerificationCodeEntity } from '@modules/auth/domain/entities/verification-code.entity';
import { VerificationCodeRepository } from '@modules/auth/domain/repositories/verification-code.repository';
import { VerificationCodeService } from '@modules/auth/infrastructure/adapters/verification-code.service';

import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';
import { MailService } from '@shared/infrastructure/mail/mail.service';
import { resendVerificationCodeTemplate } from '@shared/infrastructure/mail/templates/auth/resend-verification-code.template';

@CommandHandler(ResendVerificationCodeCommand)
export class ResendVerificationCodeHandler implements ICommandHandler<ResendVerificationCodeCommand> {
  constructor(
    @Inject(VerificationCodeRepository)
    private readonly verificationCodeRepository: VerificationCodeRepository,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailService: MailService,
  ) {}

  async execute(command: ResendVerificationCodeCommand) {
    const { email } = command.dto;

    const pending =
      await this.verificationCodeRepository.findLatestPendingByEmail(email);

    if (!pending) {
      throw new BadRequestException(USER_MESSAGES.PENDING_REGISTER_NOT_FOUND);
    }

    const newCode = this.verificationCodeService.generateCode();
    const newExpiresAt = this.verificationCodeService.generateExpirationDate(
      AUTH_CONSTANTS.VERIFICATION.EXPIRES_MINUTES,
    );

    await this.verificationCodeRepository.invalidateByEmail(email);

    await this.verificationCodeRepository.create(
      new VerificationCodeEntity(
        null,
        pending.email,
        pending.username,
        pending.passwordHash,
        newCode,
        newExpiresAt,
      ),
    );

    await this.mailService.sendMail(
      email,
      'Nuevo código de verificación',
      resendVerificationCodeTemplate(newCode),
    );

    return {
      message: AUTH_MESSAGES.REGISTER_REQUEST_SENT,
    };
  }
}
