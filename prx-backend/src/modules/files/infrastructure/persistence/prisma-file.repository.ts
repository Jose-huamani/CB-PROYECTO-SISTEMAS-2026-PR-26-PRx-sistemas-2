import { Injectable } from '@nestjs/common';

import { FileEntity } from '@modules/files/domain/entities/file.entity';
import { FileRepository } from '@modules/files/domain/repositories/file.repository';
import { FilePrismaMapper } from '@modules/files/infrastructure/mappers/file-prisma.mapper';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaFileRepository implements FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByNameAndFolder(
    repositoryId: number,
    folderId: number | null,
    name: string,
    extension: string,
    excludedFileId?: number,
  ): Promise<boolean> {
    const count = await this.prisma.file.count({
      where: {
        repositoryId,
        folderId,
        name,
        extension,
        status: 1,
        id: excludedFileId
          ? {
              not: excludedFileId,
            }
          : undefined,
      },
    });

    return count > 0;
  }

  async existsByFolderId(
    repositoryId: number,
    folderId: number,
  ): Promise<boolean> {
    const count = await this.prisma.file.count({
      where: {
        repositoryId,
        folderId,
        status: 1,
      },
    });

    return count > 0;
  }

  async create(entity: FileEntity): Promise<FileEntity> {
    const file = await this.prisma.file.create({
      data: {
        repositoryId: entity.repositoryId,
        folderId: entity.folderId,
        name: entity.name,
        extension: entity.extension,
        mimeType: entity.mimeType,
        size: entity.size,
        storagePath: entity.storagePath,
        status: 0,
        createdBy: entity.createdBy,
        tagFiles: {
          create: entity.tags.map((tag) => ({
            tagId: tag.id as number,
            createdBy: entity.createdBy,
          })),
        },
      },
      include: {
        createdByUser: true,
        tagFiles: {
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

    return FilePrismaMapper.toDomain(file);
  }

  async updateStoragePath(
    id: number,
    storagePath: string,
    updatedBy: number,
  ): Promise<FileEntity> {
    const file = await this.prisma.file.update({
      where: {
        id,
      },
      data: {
        storagePath,
        status: 1,
        updatedBy,
      },
      include: {
        createdByUser: true,
        tagFiles: {
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

    return FilePrismaMapper.toDomain(file);
  }

  async softDelete(id: number, updatedBy: number): Promise<void> {
    await this.prisma.file.update({
      where: {
        id,
      },
      data: {
        status: 0,
        updatedBy,
      },
    });
  }

  async findById(id: number): Promise<FileEntity | null> {
    const file = await this.prisma.file.findFirst({
      where: {
        id,
        status: 1,
      },
      include: {
        createdByUser: true,
        tagFiles: {
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

    if (!file) {
      return null;
    }

    return FilePrismaMapper.toDomain(file);
  }

  async findByIdAndRepositoryId(
    id: number,
    repositoryId: number,
  ): Promise<FileEntity | null> {
    const file = await this.prisma.file.findFirst({
      where: {
        id,
        repositoryId,
        status: 1,
      },
      include: {
        createdByUser: true,
        tagFiles: {
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

    if (!file) {
      return null;
    }

    return FilePrismaMapper.toDomain(file);
  }

  async findChildren(
    repositoryId: number,
    folderId: number | null,
  ): Promise<FileEntity[]> {
    const files = await this.prisma.file.findMany({
      where: {
        repositoryId,
        folderId,
        status: 1,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        createdByUser: true,
        tagFiles: {
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

    return FilePrismaMapper.toDomainList(files);
  }

  async searchInTree(
    repositoryId: number,
    folderId: number | null,
    parentPath: string | null,
    search: string,
    tagSearch: string,
  ): Promise<FileEntity[]> {
    const files = await this.prisma.file.findMany({
      where: {
        repositoryId,
        status: 1,
        AND: [
          parentPath
            ? {
                OR: [
                  {
                    folderId,
                  },
                  {
                    folder: {
                      is: {
                        repositoryId,
                        status: 1,
                        path: {
                          startsWith: `${parentPath}/`,
                        },
                      },
                    },
                  },
                ],
              }
            : {},
          {
            OR: [
              {
                name: {
                  contains: search,
                },
              },
              {
                tagFiles: {
                  some: {
                    status: 1,
                    tag: {
                      status: 1,
                      name: {
                        contains: tagSearch,
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        createdByUser: true,
        tagFiles: {
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

    return FilePrismaMapper.toDomainList(files);
  }
}
