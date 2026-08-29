import { PasswordResetEntity } from '@modules/auth/domain/entities/password-reset.entity';

export abstract class PasswordResetRepository {
  abstract create(entity: PasswordResetEntity): Promise<PasswordResetEntity>;
  
  abstract findValidByEmailAndCode(
    email: string,
    code: string,
  ): Promise<PasswordResetEntity | null>;
  abstract invalidateByEmail(email: string): Promise<void>;
  abstract markAsUsed(id: string): Promise<void>;
}
