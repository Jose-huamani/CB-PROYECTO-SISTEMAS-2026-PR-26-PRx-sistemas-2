import { BaseEntity } from '@shared/domain/base.entity';

export class PasswordResetEntity extends BaseEntity<string> {
  constructor(
    id: string | null,
    public readonly email: string,
    public readonly code: string,
    public readonly expiresAt: Date,
    public readonly usedAt?: Date | null,
    public readonly createdAt?: Date,
  ) {
    super(id);
  }
}
