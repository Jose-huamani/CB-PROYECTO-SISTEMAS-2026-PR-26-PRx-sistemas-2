import { InvitationStatus } from '@generated-prisma/client';
import { AuditableEntity } from '@shared/domain/auditable.entity';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { RepositoryEntity } from '@modules/repositories/domain/entities/repository.entity';
import { RepositoryRoleEntity } from '@modules/repositories/domain/entities/repository-role.entity';
import { RepositoryFunctionEntity } from '@modules/repositories/domain/entities/repository-function.entity';

export class RepositoryInvitationEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public readonly repositoryId: number,
    public readonly senderUserId: number,
    public readonly invitedUserId: number,
    public readonly repositoryRoleId: number,
    public readonly repositoryFunctionId: number,
    public readonly invitationStatus: InvitationStatus,
    public readonly welcomeMessage: string | null,
    createdBy: number,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date,
    updatedBy?: number,

    public readonly repository?: RepositoryEntity,
    public readonly senderUser?: UserEntity,
    public readonly invitedUser?: UserEntity,
    public readonly repositoryRole?: RepositoryRoleEntity,
    public readonly repositoryFunction?: RepositoryFunctionEntity,
  ) {
    super(id, createdBy, status, createdAt, updatedAt, updatedBy);
  }
}
