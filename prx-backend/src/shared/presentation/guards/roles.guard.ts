import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@shared/presentation/decorators/roles.decorator';
import { Role } from '@generated-prisma/enums';
import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { JwtPayload } from '@shared/types/jwt-payload.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as {
      user?: JwtPayload;
    };

    const user = request.user;

    if (!user?.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(AUTH_MESSAGES.FORBIDDEN);
    }

    return true;
  }
}
