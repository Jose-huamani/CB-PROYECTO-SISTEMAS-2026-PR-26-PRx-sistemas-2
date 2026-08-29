import {
  InvitationStatus,
  RepositoryVisibility,
  Role,
} from '@generated-prisma/enums';

import { RepositoryInvitationEntity } from '@modules/repository-invitations/domain/entities/repository-invitation.entity';
import { RepositoryFunctionPrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-function-prisma.mapper';
import { RepositoryPrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-prisma.mapper';
import { RepositoryRolePrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-role-prisma.mapper';
import { UserPrismaMapper } from '@modules/users/infrastructure/mappers/user-prisma.mapper';

type RepositoryInvitationPrismaModel = {
  id: number;
  repositoryId: number;
  senderUserId: number;
  invitedUserId: number;
  repositoryRoleId: number;
  repositoryFunctionId: number;
  invitationStatus: string;
  welcomeMessage: string | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
  repository: {
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
  senderUser: {
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
  invitedUser: {
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
  repositoryRole: {
    id: number;
    name: string;
    description?: string | null;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
  };
  repositoryFunction: {
    id: number;
    name: string;
    description?: string | null;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
  };
};

export class RepositoryInvitationPrismaMapper {
  static toDomain(
    raw: RepositoryInvitationPrismaModel,
  ): RepositoryInvitationEntity {
    return new RepositoryInvitationEntity(
      raw.id,
      raw.repositoryId,
      raw.senderUserId,
      raw.invitedUserId,
      raw.repositoryRoleId,
      raw.repositoryFunctionId,
      raw.invitationStatus as InvitationStatus,
      raw.welcomeMessage,
      raw.createdBy,
      raw.status,
      raw.createdAt,
      raw.updatedAt,
      raw.updatedBy ?? undefined,
      RepositoryPrismaMapper.toDomain(raw.repository),
      UserPrismaMapper.toDomain(raw.senderUser),
      UserPrismaMapper.toDomain(raw.invitedUser),
      RepositoryRolePrismaMapper.toDomain(raw.repositoryRole),
      RepositoryFunctionPrismaMapper.toDomain(raw.repositoryFunction),
    );
  }

  static toDomainList(
    rawList: RepositoryInvitationPrismaModel[],
  ): RepositoryInvitationEntity[] {
    return rawList.map((raw) => this.toDomain(raw));
  }
}
