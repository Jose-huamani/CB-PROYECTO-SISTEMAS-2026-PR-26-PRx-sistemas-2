import { RepositoryVisibility } from '@generated-prisma/client';

import { TagEntity } from '@modules/tags/domain/entities/tag.entity';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { AuditableEntity } from '@shared/domain/auditable.entity';

import { RepositoryCategoryEntity } from './repository-category.entity';

export class RepositoryEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public readonly repositoryCategoryId: number,
    public readonly ownerUserId: number,
    public readonly name: string,
    public readonly visibility: RepositoryVisibility,
    public readonly color: string,
    public readonly description: string | null,
    public readonly category: RepositoryCategoryEntity,
    public readonly owner: UserEntity,
    public readonly tags: TagEntity[],
    createdBy: number,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date,
    updatedBy?: number,
  ) {
    super(id, createdBy, status, createdAt, updatedAt, updatedBy);
  }
}
