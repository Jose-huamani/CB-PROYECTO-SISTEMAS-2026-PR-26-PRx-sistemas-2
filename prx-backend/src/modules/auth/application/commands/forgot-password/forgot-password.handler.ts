import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ForgotPasswordCommand } from '@modules/auth/application/commands/forgot-password/forgot-password.command';
import { PasswordResetEntity } from '@modules/auth/domain/entities/password-reset.entity';
import { PasswordResetRepository } from '@modules/auth/domain/repositories/password-reset.repository';
import { VerificationCodeService } from '@modules/auth/infrastructure/adapters/verification-code.service';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';
import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { MailService } from '@shared/infrastructure/mail/mail.service';
import { forgotPasswordTemplate } from '@shared/infrastructure/mail/templates/auth/forgot-password.template';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(PasswordResetRepository)
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailService: MailService,
  ) {}

  async execute(command: ForgotPasswordCommand) {
    const { email } = command.dto;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }

    const code = this.verificationCodeService.generateCode();
    const expiresAt = this.verificationCodeService.generateExpirationDate(
      AUTH_CONSTANTS.PASSWORD_RESET.EXPIRES_MINUTES,
    );

    await this.passwordResetRepository.invalidateByEmail(email);

    await this.passwordResetRepository.create(
      new PasswordResetEntity(null, email, code, expiresAt),
    );

    await this.mailService.sendMail(
      email,
      'Código de recuperación',
      forgotPasswordTemplate(code),
    );

    return {
      message: AUTH_MESSAGES.PASSWORD_RESET_SENT,
    };
  }
}
