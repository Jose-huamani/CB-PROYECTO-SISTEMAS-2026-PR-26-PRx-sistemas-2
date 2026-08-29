import { Injectable } from '@nestjs/common';

import { SessionEntity } from '@modules/auth/domain/entities/session.entity';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { SessionPrismaMapper } from '@modules/auth/infrastructure/mappers/session-prisma.mapper';

import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaSessionRepository
  extends BasePrismaRepository
  implements SessionRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(entity: SessionEntity): Promise<SessionEntity> {
    const created = await this.prisma.session.create({
      data: {
        userId: entity.userId,
        userAgent: entity.userAgent,
        ipAddress: entity.ipAddress,
        lastUsedAt: entity.lastUsedAt,
      },
    });

    return SessionPrismaMapper.toDomain(created);
  }

  async findById(id: string): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      return null;
    }

    return SessionPrismaMapper.toDomain(session);
  }

  async touchById(id: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        id,
        revokedAt: null,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });
  }

  async revokeById(id: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
