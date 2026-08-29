import { RepositoryFunctionEntity } from '@modules/repositories/domain/entities/repository-function.entity';
import { RepositoryRoleEntity } from '@modules/repositories/domain/entities/repository-role.entity';
import { RepositoryEntity } from '@modules/repositories/domain/entities/repository.entity';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { AuditableEntity } from '@shared/domain/auditable.entity';

export class RepositoryUserEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public readonly repositoryId: number,
    public readonly userId: number,
    public readonly repositoryRoleId: number,
    public readonly repositoryFunctionId: number,
    createdBy: number,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date,
    updatedBy?: number,
    public readonly repositoryRole?: RepositoryRoleEntity,
    public readonly repositoryFunction?: RepositoryFunctionEntity,
    public readonly user?: UserEntity,
    public readonly repository?: RepositoryEntity,
  ) {
    super(id, createdBy, status, createdAt, updatedAt, updatedBy);
  }
}
