import { Injectable } from '@nestjs/common';

import { RepositoryFunctionEntity } from '@modules/repositories/domain/entities/repository-function.entity';
import { RepositoryFunctionRepository } from '@modules/repositories/domain/repositories/repository-function.repository';
import { RepositoryFunctionPrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-function-prisma.mapper';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRepositoryFunctionRepository implements RepositoryFunctionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<RepositoryFunctionEntity | null> {
    const repositoryFunction = await this.prisma.repositoryFunction.findFirst({
      where: {
        name,
        status: 1,
      },
    });

    if (!repositoryFunction) {
      return null;
    }

    return RepositoryFunctionPrismaMapper.toDomain(repositoryFunction);
  }

  async findAll(): Promise<RepositoryFunctionEntity[]> {
    const repositoryFunctions = await this.prisma.repositoryFunction.findMany({
      where: {
        status: 1,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return RepositoryFunctionPrismaMapper.toDomainList(repositoryFunctions);
  }
}
