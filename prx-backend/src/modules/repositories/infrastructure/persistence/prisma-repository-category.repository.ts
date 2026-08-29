import { Injectable } from '@nestjs/common';

import { RepositoryCategoryEntity } from '@modules/repositories/domain/entities/repository-category.entity';
import { RepositoryCategoryRepository } from '@modules/repositories/domain/repositories/repository-category.repository';
import { RepositoryCategoryPrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-category-prisma.mapper';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRepositoryCategoryRepository implements RepositoryCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateByName(
    name: string,
    createdBy: number,
  ): Promise<RepositoryCategoryEntity | null> {
    const repositoryCategory = await this.prisma.repositoryCategory.findUnique({
      where: {
        name,
      },
    });

    if (repositoryCategory && repositoryCategory.status === 1) {
      return RepositoryCategoryPrismaMapper.toDomain(repositoryCategory);
    }

    if (repositoryCategory && repositoryCategory.status === 0) {
      return null;
    }

    const createdRepositoryCategory =
      await this.prisma.repositoryCategory.create({
        data: {
          name,
          createdBy,
        },
      });

    return RepositoryCategoryPrismaMapper.toDomain(createdRepositoryCategory);
  }

  async searchByName(
    search: string | undefined,
    limit: number,
  ): Promise<RepositoryCategoryEntity[]> {
    const repositoryCategories = await this.prisma.repositoryCategory.findMany({
      where: {
        status: 1,
        name: search
          ? {
              contains: search,
            }
          : undefined,
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
    });

    return RepositoryCategoryPrismaMapper.toDomainList(repositoryCategories);
  }
}
