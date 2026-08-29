import { Injectable } from '@nestjs/common';

import { RepositoryRoleEntity } from '@modules/repositories/domain/entities/repository-role.entity';
import { RepositoryRoleRepository } from '@modules/repositories/domain/repositories/repository-role.repository';
import { RepositoryRolePrismaMapper } from '@modules/repositories/infrastructure/mappers/repository-role-prisma.mapper';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRepositoryRoleRepository implements RepositoryRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<RepositoryRoleEntity | null> {
    const role = await this.prisma.repositoryRole.findFirst({
      where: {
        name,
        status: 1,
      },
    });

    if (!role) {
      return null;
    }

    return RepositoryRolePrismaMapper.toDomain(role);
  }

  async findAll(): Promise<RepositoryRoleEntity[]> {
    const roles = await this.prisma.repositoryRole.findMany({
      where: {
        status: 1,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return RepositoryRolePrismaMapper.toDomainList(roles);
  }
}
