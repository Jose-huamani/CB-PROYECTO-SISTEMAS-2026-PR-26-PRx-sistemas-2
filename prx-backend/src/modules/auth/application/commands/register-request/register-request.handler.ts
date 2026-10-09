import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Role } from '@generated-prisma/enums';
import { RegisterRequestCommand } from '@modules/auth/application/commands/register-request/register-request.command';
import { LoginCommand } from '@modules/auth/application/commands/login/login.command';
import { LoginHandler } from '@modules/auth/application/commands/login/login.handler';
import { BcryptService } from '@modules/auth/infrastructure/adapters/bcrypt.service';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { AvatarService } from '@shared/infrastructure/avatar/avatar.service';
import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';

@CommandHandler(RegisterRequestCommand)
export class RegisterRequestHandler implements ICommandHandler<RegisterRequestCommand> {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly avatarService: AvatarService,
    private readonly loginHandler: LoginHandler,
  ) {}

  async execute(command: RegisterRequestCommand) {
    const { email, username, password } = command.dto;
    if (await this.userRepository.existsByEmail(email)) {
      throw new ConflictException(USER_MESSAGES.EMAIL_ALREADY_EXISTS);
    }
    if (await this.userRepository.existsByUsername(username)) {
      throw new ConflictException(USER_MESSAGES.USERNAME_ALREADY_EXISTS);
    }
    const passwordHash = await this.bcryptService.hash(password);
    try {
      await this.userRepository.createSelfRegistered(
        new UserEntity(null, username, email, passwordHash, Role.estandar,
          this.avatarService.getRandomAvatar(), 0),
      );
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        const emailExists = await this.userRepository.existsByEmail(email);
        throw new ConflictException(emailExists
          ? USER_MESSAGES.EMAIL_ALREADY_EXISTS : USER_MESSAGES.USERNAME_ALREADY_EXISTS);
      }
      throw error;
    }
    const session = await this.loginHandler.execute(
      new LoginCommand({ identifier: email, password }, command.userAgent, command.ipAddress),
    );
    return { message: AUTH_MESSAGES.REGISTER_CONFIRMED, data: session.data };
  }
}
