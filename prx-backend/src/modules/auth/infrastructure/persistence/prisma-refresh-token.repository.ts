import { Injectable } from '@nestjs/common';

import { RefreshTokenEntity } from '@modules/auth/domain/entities/refresh-token.entity';
import { RefreshTokenRepository } from '@modules/auth/domain/repositories/refresh-token.repository';
import { RefreshTokenPrismaMapper } from '@modules/auth/infrastructure/mappers/refresh-token-prisma.mapper';

import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository
  extends BasePrismaRepository
  implements RefreshTokenRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(entity: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    const created = await this.prisma.refreshToken.create({
      data: {
        sessionId: entity.sessionId,
        token: entity.token,
        expiresAt: entity.expiresAt,
      },
    });

    return RefreshTokenPrismaMapper.toDomain(created);
  }

  async findActiveByToken(token: string): Promise<RefreshTokenEntity | null> {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        token,
        revokedAt: null,
      },
    });

    if (!refreshToken) {
      return null;
    }

    return RefreshTokenPrismaMapper.toDomain(refreshToken);
  }

  async findSessionIdByToken(token: string): Promise<string | null> {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        token,
      },
      select: {
        sessionId: true,
      },
    });

    return refreshToken?.sessionId ?? null;
  }

  async revokeByToken(token: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        token,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllActiveBySessionId(sessionId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        sessionId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
