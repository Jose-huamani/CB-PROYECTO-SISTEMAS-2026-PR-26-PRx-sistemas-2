import { Inject, Injectable } from '@nestjs/common';

import { RepositoryAccessAction } from '@modules/repositories/application/enums/repository-access-action.enum';
import { RepositoryAccessRepository } from '@modules/repositories/domain/repositories/repository-access.repository';

@Injectable()
export class RepositoryAccessService {
  constructor(
    @Inject(RepositoryAccessRepository)
    private readonly repositoryAccessRepository: RepositoryAccessRepository,
  ) {}

  async canAccess(
    repositoryId: number,
    userId: number,
    action: RepositoryAccessAction,
  ): Promise<boolean> {
    if (action === RepositoryAccessAction.READ) {
      return this.repositoryAccessRepository.canRead(repositoryId, userId);
    }

    if (action === RepositoryAccessAction.UPDATE) {
      return this.repositoryAccessRepository.canUpdate(repositoryId, userId);
    }

    if (action === RepositoryAccessAction.DELETE) {
      return this.repositoryAccessRepository.canDelete(repositoryId, userId);
    }

    return false;
  }

  async canRead(repositoryId: number, userId: number): Promise<boolean> {
    return this.repositoryAccessRepository.canRead(repositoryId, userId);
  }

  async canUpdate(repositoryId: number, userId: number): Promise<boolean> {
    return this.repositoryAccessRepository.canUpdate(repositoryId, userId);
  }

  async canDelete(repositoryId: number, userId: number): Promise<boolean> {
    return this.repositoryAccessRepository.canDelete(repositoryId, userId);
  }
}
