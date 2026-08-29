import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LogoutCommand } from '@modules/auth/application/commands/logout/logout.command';
import { RefreshTokenRepository } from '@modules/auth/domain/repositories/refresh-token.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';

import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    @Inject(SessionRepository)
    private readonly sessionRepository: SessionRepository,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: LogoutCommand) {
    const { refreshToken } = command.dto;

    const storedRefreshToken =
      await this.refreshTokenRepository.findActiveByToken(refreshToken);

    if (!storedRefreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }

    const session = await this.sessionRepository.findById(
      storedRefreshToken.sessionId,
    );

    if (!session || session.revokedAt) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }

    await this.sessionRepository.revokeById(session.id as string);
    await this.refreshTokenRepository.revokeAllActiveBySessionId(
      session.id as string,
    );

    return {
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    };
  }
}
