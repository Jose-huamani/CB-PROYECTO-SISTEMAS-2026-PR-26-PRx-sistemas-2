import { AuditableEntity } from '@shared/domain/auditable.entity';

export interface BinnacleTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface BinnacleLink {
  id: string;
  url: string;
}

export class BinnacleEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public readonly userId: number,
    public readonly content: string,
    public readonly name: string,
    createdBy: number,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date,
    updatedBy?: number,
    public readonly tasks: BinnacleTask[] = [],
    public readonly links: BinnacleLink[] = [],
  ) {
    super(id, createdBy, status, createdAt, updatedAt, updatedBy);
  }
}
