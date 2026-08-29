import { RefreshTokenEntity } from '@modules/auth/domain/entities/refresh-token.entity';

export abstract class RefreshTokenRepository {
  abstract create(entity: RefreshTokenEntity): Promise<RefreshTokenEntity>;
  abstract findActiveByToken(token: string): Promise<RefreshTokenEntity | null>;
  abstract findSessionIdByToken(token: string): Promise<string | null>;
  abstract revokeByToken(token: string): Promise<void>;
  abstract revokeAllActiveBySessionId(sessionId: string): Promise<void>;
}
