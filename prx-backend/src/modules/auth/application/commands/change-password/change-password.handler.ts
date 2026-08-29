import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ChangePasswordCommand } from '@modules/auth/application/commands/change-password/change-password.command';
import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { BcryptService } from '@modules/auth/infrastructure/adapters/bcrypt.service';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(command: ChangePasswordCommand) {
    const { currentPassword, newPassword } = command.dto;

    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }

    const isCurrentPasswordValid = await this.bcryptService.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_CURRENT_PASSWORD);
    }

    const isSamePassword = await this.bcryptService.compare(
      newPassword,
      user.passwordHash,
    );

    if (isSamePassword) {
      throw new BadRequestException(AUTH_MESSAGES.PASSWORD_MUST_BE_DIFFERENT);
    }

    const passwordHash = await this.bcryptService.hash(newPassword);

    await this.userRepository.update(user.id as number, {
      passwordHash,
      updatedBy: user.id as number,
    });

    return {
      message: AUTH_MESSAGES.PASSWORD_CHANGED_SUCCESS,
    };
  }
}
