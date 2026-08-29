import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LoginCommand } from '@modules/auth/application/commands/login/login.command';
import { AuthResponseMapper } from '@modules/auth/application/mappers/auth-response.mapper';
import { RefreshTokenEntity } from '@modules/auth/domain/entities/refresh-token.entity';
import { SessionEntity } from '@modules/auth/domain/entities/session.entity';
import { RefreshTokenRepository } from '@modules/auth/domain/repositories/refresh-token.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { BcryptService } from '@modules/auth/infrastructure/adapters/bcrypt.service';
import { JwtTokenService } from '@modules/auth/infrastructure/adapters/jwt-token.service';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { JwtBasePayload } from '@shared/types/jwt-base-payload.type';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(SessionRepository)
    private readonly sessionRepository: SessionRepository,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: LoginCommand) {
    const { identifier, password } = command.dto;

    const user = identifier.includes('@')
      ? await this.userRepository.findByEmail(identifier)
      : await this.userRepository.findByUsername(identifier);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const validPassword = await this.bcryptService.compare(
      password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const payload: JwtBasePayload = {
      sub: user.id as number,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const session = await this.sessionRepository.create(
      new SessionEntity(
        null,
        user.id as number,
        command.userAgent ?? null,
        command.ipAddress ?? null,
      ),
    );

    const accessToken = await this.jwtTokenService.generateAccessToken(payload);
    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(payload);

    const refreshExpiresAt =
      await this.jwtTokenService.calculateRefreshTokenExpiresAt();

    await this.refreshTokenRepository.create(
      new RefreshTokenEntity(
        null,
        session.id as string,
        refreshToken,
        refreshExpiresAt,
      ),
    );

    return {
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: AuthResponseMapper.toAuthResponse(user, accessToken, refreshToken),
    };
  }
}
