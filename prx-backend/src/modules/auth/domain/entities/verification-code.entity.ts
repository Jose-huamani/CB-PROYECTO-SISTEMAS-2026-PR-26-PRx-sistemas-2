import { BaseEntity } from '@shared/domain/base.entity';

export class VerificationCodeEntity extends BaseEntity<string> {
  constructor(
    id: string | null,
    public readonly email: string,
    public readonly username: string,
    public readonly passwordHash: string,
    public readonly code: string,
    public readonly expiresAt: Date,
    public readonly usedAt?: Date,
    public readonly createdAt?: Date,
  ) {
    super(id);
  }
}
