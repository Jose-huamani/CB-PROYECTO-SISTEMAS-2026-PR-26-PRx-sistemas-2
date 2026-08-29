import { VerificationCodeEntity } from '@modules/auth/domain/entities/verification-code.entity';

type VerificationCodePrismaModel = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  code: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
};

export class VerificationCodePrismaMapper {
  static toDomain(item: VerificationCodePrismaModel): VerificationCodeEntity {
    return new VerificationCodeEntity(
      item.id,
      item.email,
      item.username,
      item.passwordHash,
      item.code,
      item.expiresAt,
      item.usedAt ?? undefined,
      item.createdAt,
    );
  }
}
