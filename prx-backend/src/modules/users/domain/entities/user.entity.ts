import { Role } from '@generated-prisma/enums';
import { AuditableEntity } from '@shared/domain/auditable.entity';

export class UserEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public readonly username: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: Role,
    public readonly avatarUrl: string,
    createdBy: number,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date,
    updatedBy?: number,
  ) {
    super(id, createdBy, status, createdAt, updatedAt, updatedBy);
  }
}
