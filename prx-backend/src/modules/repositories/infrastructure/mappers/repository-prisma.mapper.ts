import { RepositoryVisibility, Role } from '@generated-prisma/enums';

import { RepositoryEntity } from '@modules/repositories/domain/entities/repository.entity';
import { RepositoryCategoryPrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-category-prisma.mapper';
import { TagPrismaMapper } from '@modules/tags/infrastructure/mappers/tag-prisma.mapper';
import { UserPrismaMapper } from '@modules/users/infrastructure/mappers/user-prisma.mapper';

type RepositoryPrismaModel = {
  id: number;
  repositoryCategoryId: number;
  ownerUserId: number;
  name: string;
  visibility: RepositoryVisibility;
  color: string;
  description?: string | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
  repositoryCategory: {
    id: number;
    name: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
  };
  ownerUser: {
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
  tagRepositories: {
    tag: {
      id: number;
      name: string;
      status: number;
    };
  }[];
};

export class RepositoryPrismaMapper {
  static toDomain(repository: RepositoryPrismaModel): RepositoryEntity {
    return new RepositoryEntity(
      repository.id,
      repository.repositoryCategoryId,
      repository.ownerUserId,
      repository.name,
      repository.visibility,
      repository.color,
      repository.description ?? null,
      RepositoryCategoryPrismaMapper.toDomain(repository.repositoryCategory),
      UserPrismaMapper.toDomain(repository.ownerUser),
      repository.tagRepositories.map((repositoryTag) =>
        TagPrismaMapper.toDomain(repositoryTag.tag),
      ),
      repository.createdBy,
      repository.status,
      repository.createdAt,
      repository.updatedAt,
      repository.updatedBy ?? undefined,
    );
  }

  static toDomainList(
    repositories: RepositoryPrismaModel[],
  ): RepositoryEntity[] {
    return repositories.map((repository) => this.toDomain(repository));
  }
}
