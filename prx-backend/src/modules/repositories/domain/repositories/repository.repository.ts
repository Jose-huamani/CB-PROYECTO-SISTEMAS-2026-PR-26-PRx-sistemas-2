import type { RepositoryVisibility } from '@generated-prisma/enums';

import { RepositoryEntity } from '@modules/repositories/domain/entities/repository.entity';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';

export abstract class RepositoryRepository {
  abstract existsByNameAndOwnerUserId(
    name: string,
    ownerUserId: number,
    excludedRepositoryId?: number,
  ): Promise<boolean>;

  abstract create(
    entity: RepositoryEntity,
    ownerRoleId: number,
    ownerFunctionId: number,
  ): Promise<RepositoryEntity>;

  abstract createIntimate(entity: RepositoryEntity): Promise<RepositoryEntity>;

  abstract update(
    id: number,
    data: Partial<RepositoryEntity>,
    shouldSyncTags: boolean,
  ): Promise<RepositoryEntity>;

  abstract markAsUpdated(id: number): Promise<void>;

  abstract softDelete(id: number, updatedBy: number): Promise<void>;

  abstract findById(id: number): Promise<RepositoryEntity | null>;

  abstract findIntimateByOwnerUserId(
    ownerUserId: number,
  ): Promise<RepositoryEntity | null>;

  abstract findPaginatedMe(
    page: number,
    limit: number,
    userId: number,
    search?: string,
    role?: string,
    category?: string,
    visibility?: RepositoryVisibility,
  ): Promise<PaginatedResponseDto<RepositoryEntity>>;

  abstract findPaginatedExplore(
    page: number,
    limit: number,
    search?: string,
    owner?: string,
    category?: string,
  ): Promise<PaginatedResponseDto<RepositoryEntity>>;

  abstract findPublicByOwnerUserId(
    ownerUserId: number,
    limit: number,
  ): Promise<RepositoryEntity[]>;
}
