import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';

import { TokenTypeEnum } from '@shared/enums/token-type.enum';
import { JwtBasePayload } from '@shared/types/jwt-base-payload.type';
import { JwtPayload } from '@shared/types/jwt-payload.type';
import { parseExpiresInToMs } from '@shared/utils/time.util';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: JwtBasePayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        ...payload,
        tokenType: TokenTypeEnum.ACCESS,
      },
      {
        secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
        expiresIn: this.configService.getOrThrow(
          'jwt.accessExpiresIn',
        ) as JwtSignOptions['expiresIn'],
      },
    );
  }

  async generateRefreshToken(payload: JwtBasePayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        ...payload,
        tokenType: TokenTypeEnum.REFRESH,
      },
      {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.configService.getOrThrow(
          'jwt.refreshExpiresIn',
        ) as JwtSignOptions['expiresIn'],
      },
    );
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      });

      if (payload.tokenType !== TokenTypeEnum.REFRESH) {
        throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
      }

      return payload;
    } catch {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }
  }

  async calculateRefreshTokenExpiresAt(): Promise<Date> {
    const refreshExpiresIn = this.configService.getOrThrow<string>(
      'jwt.refreshExpiresIn',
    );

    const milliseconds = parseExpiresInToMs(refreshExpiresIn);

    return new Date(Date.now() + milliseconds);
  }
}
