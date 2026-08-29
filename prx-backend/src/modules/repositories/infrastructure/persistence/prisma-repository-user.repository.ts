import { Injectable } from '@nestjs/common';

import { RepositoryUserScope } from '@modules/repositories/application/enums/repository-user-scope.enum';
import { RepositoryUserEntity } from '@modules/repositories/domain/entities/repository-user.entity';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryUserPrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-user-prisma.mapper';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRepositoryUserRepository implements RepositoryUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByRepositoryIdAndUserId(
    repositoryId: number,
    userId: number,
  ): Promise<RepositoryUserEntity | null> {
    const repositoryUser = await this.prisma.repositoryUser.findFirst({
      where: {
        repositoryId,
        userId,
        status: 1,
        repository: {
          status: 1,
        },
        repositoryRole: {
          status: 1,
        },
        repositoryFunction: {
          status: 1,
        },
      },
      include: {
        repositoryRole: true,
        repositoryFunction: true,
      },
    });

    if (!repositoryUser) {
      return null;
    }

    return RepositoryUserPrismaMapper.toDomain(repositoryUser);
  }

  async findPaginatedByRepositoryId(
    repositoryId: number,
    page: number,
    limit: number,
    search?: string,
    roleName?: string,
    functionName?: string,
    scope: RepositoryUserScope = RepositoryUserScope.ALL,
  ): Promise<PaginatedResponseDto<RepositoryUserEntity>> {
    const skip = (page - 1) * limit;
    const teamRoles = ['cocreador', 'miembro'];

    const repositoryRoleWhere: {
      status: number;
      name?: string | { in: string[] };
    } = {
      status: 1,
    };

    if (scope === RepositoryUserScope.TEAM) {
      repositoryRoleWhere.name = {
        in: roleName
          ? teamRoles.filter((teamRole) => teamRole === roleName)
          : teamRoles,
      };
    }

    if (scope === RepositoryUserScope.ALL && roleName) {
      repositoryRoleWhere.name = roleName;
    }

    const repositoryFunctionWhere: {
      status: number;
      name?: string;
    } = {
      status: 1,
    };

    if (functionName) {
      repositoryFunctionWhere.name = functionName;
    }

    const userWhere: {
      status: number;
      OR?: {
        username?: {
          contains: string;
        };
        email?: {
          contains: string;
        };
      }[];
    } = {
      status: 1,
    };

    if (search) {
      userWhere.OR = [
        {
          username: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
          },
        },
      ];
    }

    const where = {
      repositoryId,
      status: 1,
      repository: { status: 1 },
      repositoryRole: repositoryRoleWhere,
      repositoryFunction: repositoryFunctionWhere,
      user: userWhere,
    };

    const [items, total] = await Promise.all([
      this.prisma.repositoryUser.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
        include: {
          user: true,
          repositoryRole: true,
          repositoryFunction: true,
        },
      }),
      this.prisma.repositoryUser.count({
        where,
      }),
    ]);

    return {
      items: items.map(RepositoryUserPrismaMapper.toDomain),
      total,
      page,
      limit,
    };
  }

  async create(
    data: Partial<RepositoryUserEntity>,
  ): Promise<RepositoryUserEntity> {
    const raw = await this.prisma.repositoryUser.create({
      data: {
        repositoryId: data.repositoryId!,
        userId: data.userId!,
        repositoryRoleId: data.repositoryRoleId!,
        repositoryFunctionId: data.repositoryFunctionId!,
        createdBy: data.createdBy!,
      },
      include: {
        repositoryRole: true,
        repositoryFunction: true,
        user: true,
      },
    });
    return RepositoryUserPrismaMapper.toDomain(raw);
  }

  async update(
    id: number,
    data: Partial<RepositoryUserEntity>,
  ): Promise<RepositoryUserEntity> {
    const raw = await this.prisma.repositoryUser.update({
      where: { id },
      data: {
        repositoryRoleId: data.repositoryRoleId,
        repositoryFunctionId: data.repositoryFunctionId,
        updatedBy: data.updatedBy,
      },
      include: {
        repositoryRole: true,
        repositoryFunction: true,
        user: true,
      },
    });
    return RepositoryUserPrismaMapper.toDomain(raw);
  }

  async softDelete(id: number, updatedBy: number): Promise<void> {
    await this.prisma.repositoryUser.update({
      where: { id },
      data: {
        status: 0,
        updatedBy,
      },
    });
  }

  async countByRoleName(
    repositoryId: number,
    roleName: string,
  ): Promise<number> {
    return this.prisma.repositoryUser.count({
      where: {
        repositoryId,
        status: 1,
        repositoryRole: {
          name: roleName,
          status: 1,
        },
      },
    });
  }

  async transferOwnership(
    repositoryId: number,
    currentOwnerRepoUserId: number,
    targetRepoUserId: number,
    targetUserId: number,
    targetNewRoleId: number,
    targetNewFunctionId: number,
    currentOwnerNewRoleId: number,
    currentOwnerNewFunctionId: number,
    updatedBy: number,
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.repositoryUser.update({
        where: { id: targetRepoUserId },
        data: {
          repositoryRoleId: targetNewRoleId,
          repositoryFunctionId: targetNewFunctionId,
          updatedBy,
        },
      }),
      this.prisma.repositoryUser.update({
        where: { id: currentOwnerRepoUserId },
        data: {
          repositoryRoleId: currentOwnerNewRoleId,
          repositoryFunctionId: currentOwnerNewFunctionId,
          updatedBy,
        },
      }),
      this.prisma.repository.update({
        where: { id: repositoryId },
        data: { ownerUserId: targetUserId, updatedBy },
      }),
    ]);
  }

  async findByRepositoryIdAndUserIdIgnoreStatus(
    repositoryId: number,
    userId: number,
  ): Promise<RepositoryUserEntity | null> {
    const raw = await this.prisma.repositoryUser.findFirst({
      where: { repositoryId, userId },
      include: {
        repositoryRole: true,
        repositoryFunction: true,
      },
    });
    if (!raw) return null;
    return RepositoryUserPrismaMapper.toDomain(raw);
  }

  async reactivate(
    id: number,
    data: Partial<RepositoryUserEntity>,
  ): Promise<RepositoryUserEntity> {
    const raw = await this.prisma.repositoryUser.update({
      where: { id },
      data: {
        status: 1,
        repositoryRoleId: data.repositoryRoleId!,
        repositoryFunctionId: data.repositoryFunctionId!,
        updatedBy: data.updatedBy!,
      },
      include: {
        repositoryRole: true,
        repositoryFunction: true,
        user: true,
      },
    });
    return RepositoryUserPrismaMapper.toDomain(raw);
  }
}
