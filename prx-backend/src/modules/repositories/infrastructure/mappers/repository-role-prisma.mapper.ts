import { RepositoryRoleEntity } from '@modules/repositories/domain/entities/repository-role.entity';

type RepositoryRolePrismaModel = {
  id: number;
  name: string;
  description?: string | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
};

export class RepositoryRolePrismaMapper {
  static toDomain(
    repositoryRole: RepositoryRolePrismaModel,
  ): RepositoryRoleEntity {
    return new RepositoryRoleEntity(
      repositoryRole.id,
      repositoryRole.name,
      repositoryRole.description ?? null,
      repositoryRole.createdBy,
      repositoryRole.status,
      repositoryRole.createdAt,
      repositoryRole.updatedAt,
      repositoryRole.updatedBy ?? undefined,
    );
  }

  static toDomainList(
    repositoryRoles: RepositoryRolePrismaModel[],
  ): RepositoryRoleEntity[] {
    return repositoryRoles.map((repositoryRole) =>
      this.toDomain(repositoryRole),
    );
  }
}
