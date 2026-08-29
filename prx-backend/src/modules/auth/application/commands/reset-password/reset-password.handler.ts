import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ResetPasswordCommand } from '@modules/auth/application/commands/reset-password/reset-password.command';
import { PasswordResetRepository } from '@modules/auth/domain/repositories/password-reset.repository';
import { BcryptService } from '@modules/auth/infrastructure/adapters/bcrypt.service';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(
    @Inject(PasswordResetRepository)
    private readonly passwordResetRepository: PasswordResetRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(command: ResetPasswordCommand) {
    const { email, code, newPassword } = command.dto;

    const reset = await this.passwordResetRepository.findValidByEmailAndCode(
      email,
      code,
    );

    if (!reset) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_OR_EXPIRED_CODE);
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }

    const passwordHash = await this.bcryptService.hash(newPassword);

    await this.userRepository.update(user.id as number, {
      passwordHash,
      updatedBy: user.id as number,
    });

    await this.passwordResetRepository.markAsUsed(reset.id as string);

    return {
      message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
    };
  }
}
