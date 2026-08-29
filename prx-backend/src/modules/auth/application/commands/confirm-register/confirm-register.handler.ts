import { BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ConfirmRegisterCommand } from '@modules/auth/application/commands/confirm-register/confirm-register.command';
import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';
import { VerificationCodeRepository } from '@modules/auth/domain/repositories/verification-code.repository';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { Role } from '@generated-prisma/enums';
import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { AvatarService } from '@shared/infrastructure/avatar/avatar.service';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';

@CommandHandler(ConfirmRegisterCommand)
export class ConfirmRegisterHandler implements ICommandHandler<ConfirmRegisterCommand> {
  constructor(
    @Inject(VerificationCodeRepository)
    private readonly verificationCodeRepository: VerificationCodeRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly avatarService: AvatarService,
  ) {}

  async execute(command: ConfirmRegisterCommand) {
    const { email, code } = command.dto;

    const verification =
      await this.verificationCodeRepository.findValidByEmailAndCode(
        email,
        code,
      );

    if (!verification) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_OR_EXPIRED_CODE);
    }

    const emailExists = await this.userRepository.existsByEmail(
      verification.email,
    );
    if (emailExists) {
      throw new ConflictException(USER_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const usernameExists = await this.userRepository.existsByUsername(
      verification.username,
    );
    if (usernameExists) {
      throw new ConflictException(USER_MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    const avatarUrl = this.avatarService.getRandomAvatar();

    const user = await this.userRepository.createSelfRegistered(
      new UserEntity(
        null,
        verification.username,
        verification.email,
        verification.passwordHash,
        Role.estandar,
        avatarUrl,
        0,
      ),
    );

    await this.verificationCodeRepository.markAsUsed(verification.id as string);

    return {
      message: AUTH_MESSAGES.REGISTER_CONFIRMED,
      data: UserResponseMapper.toUserResponse(user),
    };
  }
}
