import { RefreshTokenEntity } from '@modules/auth/domain/entities/refresh-token.entity';

type RefreshTokenPrismaModel = {
  id: string;
  sessionId: string;
  token: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

export class RefreshTokenPrismaMapper {
  static toDomain(token: RefreshTokenPrismaModel): RefreshTokenEntity {
    return new RefreshTokenEntity(
      token.id,
      token.sessionId,
      token.token,
      token.expiresAt,
      token.revokedAt,
      token.createdAt,
    );
  }
}
