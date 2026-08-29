import { AuditableEntity } from '@shared/domain/auditable.entity';

export class RepositoryFunctionEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public readonly name: string,
    public readonly description: string | null,
    createdBy: number,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date,
    updatedBy?: number,
  ) {
    super(id, createdBy, status, createdAt, updatedAt, updatedBy);
  }
}
