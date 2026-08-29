import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { AuditableEntity } from '@shared/domain/auditable.entity';

export class FolderEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public readonly repositoryId: number,
    public readonly parentId: number | null,
    public readonly name: string,
    public readonly path: string,
    public readonly level: number,
    public readonly color: string,
    public readonly creator: UserEntity | null,
    createdBy: number,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date,
    updatedBy?: number,
  ) {
    super(id, createdBy, status, createdAt, updatedAt, updatedBy);
  }
}
