import { Injectable } from '@nestjs/common';

import { PasswordResetEntity } from '@modules/auth/domain/entities/password-reset.entity';
import { PasswordResetRepository } from '@modules/auth/domain/repositories/password-reset.repository';
import { PasswordResetPrismaMapper } from '@modules/auth/infrastructure/mappers/password-reset-prisma.mapper';

import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaPasswordResetRepository
  extends BasePrismaRepository
  implements PasswordResetRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(entity: PasswordResetEntity): Promise<PasswordResetEntity> {
    const created = await this.prisma.passwordReset.create({
      data: {
        email: entity.email,
        code: entity.code,
        expiresAt: entity.expiresAt,
      },
    });

    return PasswordResetPrismaMapper.toDomain(created);
  }

  async findValidByEmailAndCode(
    email: string,
    code: string,
  ): Promise<PasswordResetEntity | null> {
    const item = await this.prisma.passwordReset.findFirst({
      where: {
        email,
        code,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!item) {
      return null;
    }

    return PasswordResetPrismaMapper.toDomain(item);
  }

  async invalidateByEmail(email: string): Promise<void> {
    await this.prisma.passwordReset.updateMany({
      where: {
        email,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.passwordReset.update({
      where: { id },
      data: {
        usedAt: new Date(),
      },
    });
  }
}
