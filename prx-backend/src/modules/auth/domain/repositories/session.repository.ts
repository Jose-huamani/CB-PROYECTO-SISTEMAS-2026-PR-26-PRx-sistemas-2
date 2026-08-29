import { SessionEntity } from '@modules/auth/domain/entities/session.entity';

export abstract class SessionRepository {
  abstract create(entity: SessionEntity): Promise<SessionEntity>;
  abstract findById(id: string): Promise<SessionEntity | null>;
  abstract touchById(id: string): Promise<void>;
  abstract revokeById(id: string): Promise<void>;
}
