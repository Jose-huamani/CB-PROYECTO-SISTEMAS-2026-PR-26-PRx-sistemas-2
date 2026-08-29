import { BaseEntity } from '@shared/domain/base.entity';

export abstract class AuditableEntity extends BaseEntity {
  constructor(
    id: number | null,
    public readonly createdBy: number,
    public readonly status?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly updatedBy?: number,
  ) {
    super(id);
  }
}
