import { Role } from '@generated-prisma/enums';

import { RepositoryUserEntity } from '@modules/repositories/domain/entities/repository-user.entity';
import { RepositoryFunctionPrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-function-prisma.mapper';
import { RepositoryPrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-prisma.mapper';
import { RepositoryRolePrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-role-prisma.mapper';
import { UserPrismaMapper } from '@modules/users/infrastructure/mappers/user-prisma.mapper';

type RepositoryUserPrismaModel = {
  id: number;
  repositoryId: number;
  userId: number;
  repositoryRoleId: number;
  repositoryFunctionId: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
  repositoryRole?: {
    id: number;
    name: string;
    description?: string | null;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
  };
  repositoryFunction?: {
    id: number;
    name: string;
    description?: string | null;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
  };
  user?: {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
    avatarUrl: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
  };
  repository?: Parameters<typeof RepositoryPrismaMapper.toDomain>[0];
};

export class RepositoryUserPrismaMapper {
  static toDomain(
    repositoryUser: RepositoryUserPrismaModel,
  ): RepositoryUserEntity {
    return new RepositoryUserEntity(
      repositoryUser.id,
      repositoryUser.repositoryId,
      repositoryUser.userId,
      repositoryUser.repositoryRoleId,
      repositoryUser.repositoryFunctionId,
      repositoryUser.createdBy,
      repositoryUser.status,
      repositoryUser.createdAt,
      repositoryUser.updatedAt,
      repositoryUser.updatedBy ?? undefined,
      repositoryUser.repositoryRole
        ? RepositoryRolePrismaMapper.toDomain(repositoryUser.repositoryRole)
        : undefined,
      repositoryUser.repositoryFunction
        ? RepositoryFunctionPrismaMapper.toDomain(
            repositoryUser.repositoryFunction,
          )
        : undefined,
      repositoryUser.user
        ? UserPrismaMapper.toDomain(repositoryUser.user)
        : undefined,
      repositoryUser.repository
        ? RepositoryPrismaMapper.toDomain(repositoryUser.repository)
        : undefined,
    );
  }

  static toDomainList(
    repositoryUsers: RepositoryUserPrismaModel[],
  ): RepositoryUserEntity[] {
    return repositoryUsers.map((repositoryUser) =>
      this.toDomain(repositoryUser),
    );
  }
}
