import { RepositoryVisibility } from '@generated-prisma/enums';
import { Injectable } from '@nestjs/common';

import { RepositoryAccessRepository } from '@modules/repositories/domain/repositories/repository-access.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRepositoryAccessRepository implements RepositoryAccessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async canRead(repositoryId: number, userId: number): Promise<boolean> {
    const count = await this.prisma.repository.count({
      where: {
        id: repositoryId,
        status: 1,
        OR: [
          {
            visibility: RepositoryVisibility.publico,
          },
          {
            visibility: RepositoryVisibility.privado,
            repositoryUsers: {
              some: {
                userId,
                status: 1,
              },
            },
          },
        ],
      },
    });

    return count > 0;
  }

  async canUpdate(repositoryId: number, userId: number): Promise<boolean> {
    const count = await this.prisma.repository.count({
      where: {
        id: repositoryId,
        status: 1,
        visibility: {
          not: RepositoryVisibility.intimo,
        },
        OR: [
          {
            ownerUserId: userId,
          },
          {
            repositoryUsers: {
              some: {
                userId,
                status: 1,
                repositoryRole: {
                  name: {
                    in: ['propietario', 'copropietario'],
                  },
                  status: 1,
                },
              },
            },
          },
        ],
      },
    });

    return count > 0;
  }

  async canDelete(repositoryId: number, userId: number): Promise<boolean> {
    const count = await this.prisma.repository.count({
      where: {
        id: repositoryId,
        ownerUserId: userId,
        status: 1,
        visibility: {
          not: RepositoryVisibility.intimo,
        },
      },
    });

    return count > 0;
  }
}
