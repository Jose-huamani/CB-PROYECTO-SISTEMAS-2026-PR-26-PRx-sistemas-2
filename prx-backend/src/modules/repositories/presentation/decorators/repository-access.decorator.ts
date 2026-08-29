import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { RepositoryAccessAction } from '@modules/repositories/application/enums/repository-access-action.enum';
import { RepositoryAccessGuard } from '@modules/repositories/presentation/guards/repository-access.guard';

export const REPOSITORY_ACCESS_KEY = 'repository_access';

export function RepositoryAccess(action: RepositoryAccessAction) {
  return applyDecorators(
    SetMetadata(REPOSITORY_ACCESS_KEY, action),
    UseGuards(RepositoryAccessGuard),
  );
}
