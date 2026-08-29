import { AuditableEntity } from '@shared/domain/auditable.entity';

export class RepositoryCategoryEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public readonly name: string,
    createdBy: number,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date,
    updatedBy?: number,
  ) {
    super(id, createdBy, status, createdAt, updatedAt, updatedBy);
  }
}
