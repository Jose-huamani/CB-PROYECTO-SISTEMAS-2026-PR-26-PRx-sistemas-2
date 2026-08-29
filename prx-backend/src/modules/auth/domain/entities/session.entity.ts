import { BaseEntity } from '@shared/domain/base.entity';

export class SessionEntity extends BaseEntity<string> {
  constructor(
    id: string | null,
    public readonly userId: number,
    public readonly userAgent?: string | null,
    public readonly ipAddress?: string | null,
    public readonly lastUsedAt?: Date | null,
    public readonly revokedAt?: Date | null,
    public readonly createdAt?: Date,
  ) {
    super(id);
  }
}
