import { RepositoryVisibility } from '@generated-prisma/enums';
import { Injectable } from '@nestjs/common';

import { RepositoryEntity } from '@modules/repositories/domain/entities/repository.entity';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { RepositoryPrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-prisma.mapper';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRepositoryRepository implements RepositoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByNameAndOwnerUserId(
    name: string,
    ownerUserId: number,
    excludedRepositoryId?: number,
  ): Promise<boolean> {
    const count = await this.prisma.repository.count({
      where: {
        name,
        ownerUserId,
        status: 1,
        id: excludedRepositoryId
          ? {
              not: excludedRepositoryId,
            }
          : undefined,
      },
    });

    return count > 0;
  }

  async create(
    entity: RepositoryEntity,
    ownerRoleId: number,
    ownerFunctionId: number,
  ): Promise<RepositoryEntity> {
    const created = await this.prisma.repository.create({
      data: {
        repositoryCategoryId: entity.repositoryCategoryId,
        ownerUserId: entity.ownerUserId,
        name: entity.name,
        visibility: entity.visibility,
        color: entity.color,
        description: entity.description,
        createdBy: entity.createdBy,
        repositoryUsers: {
          create: {
            userId: entity.ownerUserId,
            repositoryRoleId: ownerRoleId,
            repositoryFunctionId: ownerFunctionId,
            createdBy: entity.createdBy,
          },
        },
        tagRepositories: {
          create: entity.tags.map((tag) => ({
            tagId: tag.id as number,
            createdBy: entity.createdBy,
          })),
        },
      },
      include: {
        repositoryCategory: true,
        ownerUser: true,
        tagRepositories: {
          where: {
            status: 1,
            tag: {
              status: 1,
            },
          },
          orderBy: {
            id: 'asc',
          },
          include: {
            tag: true,
          },
        },
      },
    });

    return RepositoryPrismaMapper.toDomain(created);
  }

  async createIntimate(entity: RepositoryEntity): Promise<RepositoryEntity> {
    const created = await this.prisma.repository.create({
      data: {
        repositoryCategoryId: entity.repositoryCategoryId,
        ownerUserId: entity.ownerUserId,
        name: entity.name,
        visibility: entity.visibility,
        color: entity.color,
        description: entity.description,
        createdBy: entity.createdBy,
      },
      include: {
        repositoryCategory: true,
        ownerUser: true,
        tagRepositories: {
          where: {
            status: 1,
            tag: {
              status: 1,
            },
          },
          orderBy: {
            id: 'asc',
          },
          include: {
            tag: true,
          },
        },
      },
    });

    return RepositoryPrismaMapper.toDomain(created);
  }

  async update(
    id: number,
    data: Partial<RepositoryEntity>,
    shouldSyncTags: boolean,
  ): Promise<RepositoryEntity> {
    const updated = await this.prisma.$transaction(async (tx) => {
      if (shouldSyncTags) {
        const currentRepositoryTags = await tx.tagRepository.findMany({
          where: {
            repositoryId: id,
          },
          select: {
            id: true,
            tagId: true,
            status: true,
          },
        });

        const finalTagIds = (data.tags ?? []).map((tag) => tag.id as number);

        const repositoryTagsToDisable = currentRepositoryTags.filter(
          (repositoryTag) =>
            repositoryTag.status === 1 &&
            !finalTagIds.includes(repositoryTag.tagId),
        );

        for (const repositoryTag of repositoryTagsToDisable) {
          await tx.tagRepository.update({
            where: {
              id: repositoryTag.id,
            },
            data: {
              status: 0,
              updatedBy: data.updatedBy,
            },
          });
        }

        for (const tagId of finalTagIds) {
          const repositoryTag = currentRepositoryTags.find(
            (currentRepositoryTag) => currentRepositoryTag.tagId === tagId,
          );

          if (!repositoryTag) {
            await tx.tagRepository.create({
              data: {
                repositoryId: id,
                tagId,
                createdBy: data.updatedBy as number,
              },
            });

            continue;
          }

          if (repositoryTag.status === 0) {
            await tx.tagRepository.update({
              where: {
                id: repositoryTag.id,
              },
              data: {
                status: 1,
                updatedBy: data.updatedBy,
              },
            });
          }
        }
      }

      return tx.repository.update({
        where: {
          id,
        },
        data: {
          repositoryCategoryId: data.repositoryCategoryId,
          name: data.name,
          visibility: data.visibility,
          color: data.color,
          description: data.description,
          updatedBy: data.updatedBy,
        },
        include: {
          repositoryCategory: true,
          ownerUser: true,
          tagRepositories: {
            where: {
              status: 1,
              tag: {
                status: 1,
              },
            },
            orderBy: {
              id: 'asc',
            },
            include: {
              tag: true,
            },
          },
        },
      });
    });

    return RepositoryPrismaMapper.toDomain(updated);
  }

  async markAsUpdated(id: number): Promise<void> {
    await this.prisma.repository.updateMany({
      where: {
        id,
        status: 1,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  async softDelete(id: number, updatedBy: number): Promise<void> {
    await this.prisma.repository.update({
      where: {
        id,
      },
      data: {
        status: 0,
        updatedBy,
      },
    });
  }

  async findById(id: number): Promise<RepositoryEntity | null> {
    const repository = await this.prisma.repository.findFirst({
      where: {
        id,
        status: 1,
      },
      include: {
        repositoryCategory: true,
        ownerUser: true,
        tagRepositories: {
          where: {
            status: 1,
            tag: {
              status: 1,
            },
          },
          orderBy: {
            id: 'asc',
          },
          include: {
            tag: true,
          },
        },
      },
    });

    if (!repository) {
      return null;
    }

    return RepositoryPrismaMapper.toDomain(repository);
  }

  async findIntimateByOwnerUserId(
    ownerUserId: number,
  ): Promise<RepositoryEntity | null> {
    const repository = await this.prisma.repository.findFirst({
      where: {
        ownerUserId,
        visibility: RepositoryVisibility.intimo,
        status: 1,
      },
      include: {
        repositoryCategory: true,
        ownerUser: true,
        tagRepositories: {
          where: {
            status: 1,
            tag: {
              status: 1,
            },
          },
          orderBy: {
            id: 'asc',
          },
          include: {
            tag: true,
          },
        },
      },
    });

    if (!repository) {
      return null;
    }

    return RepositoryPrismaMapper.toDomain(repository);
  }

  async findPaginatedMe(
    page: number,
    limit: number,
    userId: number,
    search?: string,
    role?: string,
    category?: string,
    visibility?: RepositoryVisibility,
  ): Promise<PaginatedResponseDto<RepositoryEntity>> {
    const skip = (page - 1) * limit;

    const repositoryUserWhere: {
      userId: number;
      status: number;
      repositoryRole: {
        status: number;
        name?: string;
      };
      repositoryFunction: {
        status: number;
      };
    } = {
      userId,
      status: 1,
      repositoryRole: {
        status: 1,
      },
      repositoryFunction: {
        status: 1,
      },
    };

    if (role) {
      repositoryUserWhere.repositoryRole.name = role;
    }

    const repositoryWhere: {
      status: number;
      visibility?: RepositoryVisibility;
      repositoryUsers: {
        some: typeof repositoryUserWhere;
      };
      repositoryCategory?: {
        status: number;
        name?: string;
      };
      OR?: (
        | {
            name: {
              contains: string;
            };
          }
        | {
            tagRepositories: {
              some: {
                status: number;
                tag: {
                  status: number;
                  name: {
                    contains: string;
                  };
                };
              };
            };
          }
      )[];
    } = {
      status: 1,
      repositoryUsers: {
        some: repositoryUserWhere,
      },
    };

    if (visibility) {
      repositoryWhere.visibility = visibility;
    }

    if (category) {
      repositoryWhere.repositoryCategory = {
        status: 1,
        name: category,
      };
    }

    if (search) {
      repositoryWhere.OR = [
        {
          name: {
            contains: search,
          },
        },
        {
          tagRepositories: {
            some: {
              status: 1,
              tag: {
                status: 1,
                name: {
                  contains: search,
                },
              },
            },
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.repository.findMany({
        where: repositoryWhere,
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
        include: {
          repositoryCategory: true,
          ownerUser: true,
          tagRepositories: {
            where: {
              status: 1,
              tag: {
                status: 1,
              },
            },
            orderBy: {
              id: 'asc',
            },
            include: {
              tag: true,
            },
          },
        },
      }),
      this.prisma.repository.count({
        where: repositoryWhere,
      }),
    ]);

    return {
      items: RepositoryPrismaMapper.toDomainList(items),
      total,
      page,
      limit,
    };
  }

  async findPaginatedExplore(
    page: number,
    limit: number,
    search?: string,
    owner?: string,
    category?: string,
  ): Promise<PaginatedResponseDto<RepositoryEntity>> {
    const skip = (page - 1) * limit;

    const repositoryWhere: {
      status: number;
      visibility: RepositoryVisibility;
      repositoryCategory?: {
        status: number;
        name?: string;
      };
      ownerUser?: {
        status: number;
        username?: {
          contains: string;
        };
      };
      OR?: (
        | {
            name: {
              contains: string;
            };
          }
        | {
            tagRepositories: {
              some: {
                status: number;
                tag: {
                  status: number;
                  name: {
                    contains: string;
                  };
                };
              };
            };
          }
      )[];
    } = {
      status: 1,
      visibility: RepositoryVisibility.publico,
    };

    if (owner) {
      repositoryWhere.ownerUser = {
        status: 1,
        username: {
          contains: owner,
        },
      };
    }

    if (category) {
      repositoryWhere.repositoryCategory = {
        status: 1,
        name: category,
      };
    }

    if (search) {
      repositoryWhere.OR = [
        {
          name: {
            contains: search,
          },
        },
        {
          tagRepositories: {
            some: {
              status: 1,
              tag: {
                status: 1,
                name: {
                  contains: search,
                },
              },
            },
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.repository.findMany({
        where: repositoryWhere,
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
        include: {
          repositoryCategory: true,
          ownerUser: true,
          tagRepositories: {
            where: {
              status: 1,
              tag: {
                status: 1,
              },
            },
            orderBy: {
              id: 'asc',
            },
            include: {
              tag: true,
            },
          },
        },
      }),
      this.prisma.repository.count({
        where: repositoryWhere,
      }),
    ]);

    return {
      items: RepositoryPrismaMapper.toDomainList(items),
      total,
      page,
      limit,
    };
  }

  async findPublicByOwnerUserId(
    ownerUserId: number,
    limit: number,
  ): Promise<RepositoryEntity[]> {
    const repositories = await this.prisma.repository.findMany({
      where: {
        ownerUserId,
        visibility: RepositoryVisibility.publico,
        status: 1,
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          id: 'desc',
        },
      ],
      take: limit,
      include: {
        repositoryCategory: true,
        ownerUser: true,
        tagRepositories: {
          where: {
            status: 1,
            tag: {
              status: 1,
            },
          },
          orderBy: {
            id: 'asc',
          },
          include: {
            tag: true,
          },
        },
      },
    });

    return RepositoryPrismaMapper.toDomainList(repositories);
  }
}
