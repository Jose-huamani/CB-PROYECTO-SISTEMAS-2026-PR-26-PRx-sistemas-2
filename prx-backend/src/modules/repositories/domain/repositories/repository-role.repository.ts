import { RepositoryRoleEntity } from '@modules/repositories/domain/entities/repository-role.entity';

export abstract class RepositoryRoleRepository {
  abstract findByName(name: string): Promise<RepositoryRoleEntity | null>;

  abstract findAll(): Promise<RepositoryRoleEntity[]>;
}
