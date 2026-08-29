import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { RepositoryPort } from '@shared/domain/repository.port';

export abstract class UserRepository extends RepositoryPort<UserEntity> {
  abstract findAll(): Promise<UserEntity[]>;

  abstract createSelfRegistered(user: UserEntity): Promise<UserEntity>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByUsername(username: string): Promise<UserEntity | null>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract existsByUsername(username: string): Promise<boolean>;
}
