import { PasswordResetEntity } from '@modules/auth/domain/entities/password-reset.entity';

type PasswordResetPrismaModel = {
  id: string;
  email: string;
  code: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};

export class PasswordResetPrismaMapper {
  static toDomain(item: PasswordResetPrismaModel): PasswordResetEntity {
    return new PasswordResetEntity(
      item.id,
      item.email,
      item.code,
      item.expiresAt,
      item.usedAt,
      item.createdAt,
    );
  }
}
