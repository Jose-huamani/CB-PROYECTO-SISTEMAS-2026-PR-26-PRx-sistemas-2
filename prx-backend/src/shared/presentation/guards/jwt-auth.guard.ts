import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { TokenTypeEnum } from '@shared/enums/token-type.enum';
import { IS_PUBLIC_ROUTE_KEY } from '@shared/presentation/decorators/public.decorator';
import { JwtPayload } from '@shared/types/jwt-payload.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as {
      headers: { authorization?: string };
      user?: JwtPayload;
    };

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
      });

      if (payload.tokenType !== TokenTypeEnum.ACCESS) {
        throw new UnauthorizedException(AUTH_MESSAGES.INVALID_TOKEN);
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(AUTH_MESSAGES.TOKEN_EXPIRED);
      }

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_TOKEN);
    }
  }
}
