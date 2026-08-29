import { Injectable } from '@nestjs/common';

import { FolderEntity } from '@modules/files/domain/entities/folder.entity';
import { FolderRepository } from '@modules/files/domain/repositories/folder.repository';
import { FolderPrismaMapper } from '@modules/files/infrastructure/mappers/folder-prisma.mapper';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaFolderRepository implements FolderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByNameAndParent(
    repositoryId: number,
    parentId: number | null,
    name: string,
    excludedFolderId?: number,
  ): Promise<boolean> {
    const count = await this.prisma.folder.count({
      where: {
        repositoryId,
        parentId,
        name,
        status: 1,
        id: excludedFolderId
          ? {
              not: excludedFolderId,
            }
          : undefined,
      },
    });

    return count > 0;
  }

  async existsByParentId(
    repositoryId: number,
    parentId: number,
  ): Promise<boolean> {
    const count = await this.prisma.folder.count({
      where: {
        repositoryId,
        parentId,
        status: 1,
      },
    });

    return count > 0;
  }

  async create(entity: FolderEntity): Promise<FolderEntity> {
    const folder = await this.prisma.folder.create({
      data: {
        repositoryId: entity.repositoryId,
        parentId: entity.parentId,
        name: entity.name,
        path: entity.path,
        level: entity.level,
        color: entity.color,
        createdBy: entity.createdBy,
      },
      include: {
        createdByUser: true,
      },
    });

    return FolderPrismaMapper.toDomain(folder);
  }

  async updatePath(
    id: number,
    path: string,
    updatedBy: number,
  ): Promise<FolderEntity> {
    const folder = await this.prisma.folder.update({
      where: {
        id,
      },
      data: {
        path,
        updatedBy,
      },
      include: {
        createdByUser: true,
      },
    });

    return FolderPrismaMapper.toDomain(folder);
  }

  async update(
    id: number,
    name: string,
    color: string,
    updatedBy: number,
  ): Promise<FolderEntity> {
    const folder = await this.prisma.folder.update({
      where: {
        id,
      },
      data: {
        name,
        color,
        updatedBy,
      },
      include: {
        createdByUser: true,
      },
    });

    return FolderPrismaMapper.toDomain(folder);
  }

  async softDelete(id: number, updatedBy: number): Promise<void> {
    await this.prisma.folder.update({
      where: {
        id,
      },
      data: {
        status: 0,
        updatedBy,
      },
    });
  }

  async softDeleteTreeByPath(
    repositoryId: number,
    path: string,
    updatedBy: number,
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.file.updateMany({
        where: {
          repositoryId,
          status: 1,
          folder: {
            is: {
              repositoryId,
              status: 1,
              OR: [
                {
                  path,
                },
                {
                  path: {
                    startsWith: `${path}/`,
                  },
                },
              ],
            },
          },
        },
        data: {
          status: 0,
          updatedBy,
        },
      }),

      this.prisma.folder.updateMany({
        where: {
          repositoryId,
          status: 1,
          OR: [
            {
              path,
            },
            {
              path: {
                startsWith: `${path}/`,
              },
            },
          ],
        },
        data: {
          status: 0,
          updatedBy,
        },
      }),
    ]);
  }

  async findById(id: number): Promise<FolderEntity | null> {
    const folder = await this.prisma.folder.findFirst({
      where: {
        id,
        status: 1,
      },
      include: {
        createdByUser: true,
      },
    });

    if (!folder) {
      return null;
    }

    return FolderPrismaMapper.toDomain(folder);
  }

  async findByIdAndRepositoryId(
    id: number,
    repositoryId: number,
  ): Promise<FolderEntity | null> {
    const folder = await this.prisma.folder.findFirst({
      where: {
        id,
        repositoryId,
        status: 1,
      },
      include: {
        createdByUser: true,
      },
    });

    if (!folder) {
      return null;
    }

    return FolderPrismaMapper.toDomain(folder);
  }

  async findChildren(
    repositoryId: number,
    parentId: number | null,
  ): Promise<FolderEntity[]> {
    const folders = await this.prisma.folder.findMany({
      where: {
        repositoryId,
        parentId,
        status: 1,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        createdByUser: true,
      },
    });

    return FolderPrismaMapper.toDomainList(folders);
  }

  async searchInTree(
    repositoryId: number,
    parentPath: string | null,
    search: string,
  ): Promise<FolderEntity[]> {
    const folders = await this.prisma.folder.findMany({
      where: {
        repositoryId,
        status: 1,
        name: {
          contains: search,
        },
        path: parentPath
          ? {
              startsWith: `${parentPath}/`,
            }
          : undefined,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        createdByUser: true,
      },
    });

    return FolderPrismaMapper.toDomainList(folders);
  }

  async findAncestorsByPath(
    repositoryId: number,
    path: string,
  ): Promise<FolderEntity[]> {
    const folderIds = path.split('/').map((id) => Number(id));

    const folders = await this.prisma.folder.findMany({
      where: {
        repositoryId,
        id: {
          in: folderIds,
        },
        status: 1,
      },
      include: {
        createdByUser: true,
      },
    });

    const orderedFolders = folderIds
      .map((folderId) => folders.find((folder) => folder.id === folderId))
      .filter((folder) => folder !== undefined);

    return FolderPrismaMapper.toDomainList(orderedFolders);
  }
}
