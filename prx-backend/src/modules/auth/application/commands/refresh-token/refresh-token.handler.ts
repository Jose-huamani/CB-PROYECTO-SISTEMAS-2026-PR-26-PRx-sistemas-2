import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RefreshTokenCommand } from '@modules/auth/application/commands/refresh-token/refresh-token.command';
import { AuthResponseMapper } from '@modules/auth/application/mappers/auth-response.mapper';
import { RefreshTokenEntity } from '@modules/auth/domain/entities/refresh-token.entity';
import { RefreshTokenRepository } from '@modules/auth/domain/repositories/refresh-token.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { JwtTokenService } from '@modules/auth/infrastructure/adapters/jwt-token.service';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { JwtBasePayload } from '@shared/types/jwt-base-payload.type';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(SessionRepository)
    private readonly sessionRepository: SessionRepository,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { refreshToken } = command.dto;

    const payload = await this.jwtTokenService.verifyRefreshToken(refreshToken);

    const storedRefreshToken =
      await this.refreshTokenRepository.findActiveByToken(refreshToken);

    if (!storedRefreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }

    if (storedRefreshToken.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }

    const session = await this.sessionRepository.findById(
      storedRefreshToken.sessionId,
    );

    if (!session || session.revokedAt) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }

    await this.refreshTokenRepository.revokeByToken(refreshToken);
    await this.sessionRepository.touchById(session.id as string);

    const newPayload: JwtBasePayload = {
      sub: user.id as number,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken =
      await this.jwtTokenService.generateAccessToken(newPayload);

    const newRefreshToken =
      await this.jwtTokenService.generateRefreshToken(newPayload);

    const refreshExpiresAt =
      await this.jwtTokenService.calculateRefreshTokenExpiresAt();

    await this.refreshTokenRepository.create(
      new RefreshTokenEntity(
        null,
        session.id as string,
        newRefreshToken,
        refreshExpiresAt,
      ),
    );

    return {
      data: AuthResponseMapper.toAuthResponse(
        user,
        accessToken,
        newRefreshToken,
      ),
    };
  }
}
