import { BaseEntity } from '@shared/domain/base.entity';

export class RefreshTokenEntity extends BaseEntity<string> {
  constructor(
    id: string | null,
    public readonly sessionId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly revokedAt?: Date | null,
    public readonly createdAt?: Date,
  ) {
    super(id);
  }
}
