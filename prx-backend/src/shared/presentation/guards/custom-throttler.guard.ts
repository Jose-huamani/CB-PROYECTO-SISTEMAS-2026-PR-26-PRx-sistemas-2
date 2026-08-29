import { Injectable, ExecutionContext } from '@nestjs/common';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerLimitDetail,
} from '@nestjs/throttler';
import { JwtPayload } from '@shared/types/jwt-payload.type';

interface ThrottlerRequest {
  user?: JwtPayload;
  ip: string;
}

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: ThrottlerRequest): Promise<string> {
    return req.user?.sub?.toString() ?? req.ip;
  }

  protected async throwThrottlingException(
    _context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const secondsLeft = throttlerLimitDetail.timeToBlockExpire;

    const message =
      secondsLeft === 1
        ? `Demasiadas solicitudes, espera ${secondsLeft} segundo para reintentar.`
        : `Demasiadas solicitudes, espera ${secondsLeft} segundos para reintentar.`;

    throw new ThrottlerException(message);
  }
}
