import { SessionEntity } from '@modules/auth/domain/entities/session.entity';

type SessionPrismaModel = {
  id: string;
  userId: number;
  userAgent: string | null;
  ipAddress: string | null;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
};

export class SessionPrismaMapper {
  static toDomain(session: SessionPrismaModel): SessionEntity {
    return new SessionEntity(
      session.id,
      session.userId,
      session.userAgent,
      session.ipAddress,
      session.lastUsedAt,
      session.revokedAt,
      session.createdAt,
    );
  }
}
