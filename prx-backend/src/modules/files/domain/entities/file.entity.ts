import { TagEntity } from '@modules/tags/domain/entities/tag.entity';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { AuditableEntity } from '@shared/domain/auditable.entity';

export class FileEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public readonly repositoryId: number,
    public readonly folderId: number | null,
    public readonly name: string,
    public readonly extension: string,
    public readonly mimeType: string,
    public readonly size: number,
    public readonly storagePath: string,
    public readonly tags: TagEntity[],
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
