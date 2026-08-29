import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { RepositoryAccessAction } from '@modules/repositories/application/enums/repository-access-action.enum';
import { RepositoryAccessService } from '@modules/repositories/application/access/repository-access.service';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { REPOSITORY_ACCESS_KEY } from '@modules/repositories/presentation/decorators/repository-access.decorator';

type AuthenticatedRequest = {
  params: {
    id?: string;
  };
  user?: {
    sub?: number;
  };
};

@Injectable()
export class RepositoryAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly repositoryAccessService: RepositoryAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action = this.reflector.getAllAndOverride<RepositoryAccessAction>(
      REPOSITORY_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!action) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const repositoryId = Number(request.params.id);
    const userId = Number(request.user?.sub);

    if (!Number.isInteger(repositoryId) || repositoryId <= 0) {
      throw new BadRequestException('El id del repositorio no es válido');
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }

    const hasAccess = await this.repositoryAccessService.canAccess(
      repositoryId,
      userId,
      action,
    );

    if (!hasAccess) {
      throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
    }

    return true;
  }
}
