import { VerificationCodeEntity } from '@modules/auth/domain/entities/verification-code.entity';

export abstract class VerificationCodeRepository {
  abstract create(
    entity: VerificationCodeEntity,
  ): Promise<VerificationCodeEntity>;

  abstract findValidByEmailAndCode(
    email: string,
    code: string,
  ): Promise<VerificationCodeEntity | null>;
  abstract findLatestPendingByEmail(
    email: string,
  ): Promise<VerificationCodeEntity | null>;
  abstract invalidateByEmail(email: string): Promise<void>;
  abstract markAsUsed(id: string): Promise<void>;
}
