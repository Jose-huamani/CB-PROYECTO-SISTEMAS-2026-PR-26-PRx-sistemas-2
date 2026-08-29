import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RegisterRequestCommand } from '@modules/auth/application/commands/register-request/register-request.command';
import { VerificationCodeEntity } from '@modules/auth/domain/entities/verification-code.entity';
import { VerificationCodeRepository } from '@modules/auth/domain/repositories/verification-code.repository';
import { BcryptService } from '@modules/auth/infrastructure/adapters/bcrypt.service';
import { VerificationCodeService } from '@modules/auth/infrastructure/adapters/verification-code.service';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';
import { MailService } from '@shared/infrastructure/mail/mail.service';
import { registerRequestTemplate } from '@shared/infrastructure/mail/templates/auth/register-request.template';

@CommandHandler(RegisterRequestCommand)
export class RegisterRequestHandler implements ICommandHandler<RegisterRequestCommand> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(VerificationCodeRepository)
    private readonly verificationCodeRepository: VerificationCodeRepository,
    private readonly bcryptService: BcryptService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailService: MailService,
  ) {}

  async execute(command: RegisterRequestCommand) {
    const { email, username, password } = command.dto;

    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new ConflictException(USER_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const usernameExists = await this.userRepository.existsByUsername(username);
    if (usernameExists) {
      throw new ConflictException(USER_MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    const passwordHash = await this.bcryptService.hash(password);
    const code = this.verificationCodeService.generateCode();
    const expiresAt = this.verificationCodeService.generateExpirationDate(
      AUTH_CONSTANTS.VERIFICATION.EXPIRES_MINUTES,
    );

    await this.verificationCodeRepository.invalidateByEmail(email);

    await this.verificationCodeRepository.create(
      new VerificationCodeEntity(
        null,
        email,
        username,
        passwordHash,
        code,
        expiresAt,
      ),
    );

    await this.mailService.sendMail(
      email,
      'Código de verificación',
      registerRequestTemplate(code),
    );

    return {
      message: AUTH_MESSAGES.REGISTER_REQUEST_SENT,
    };
  }
}
