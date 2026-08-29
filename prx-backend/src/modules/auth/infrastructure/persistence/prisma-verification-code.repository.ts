import { Injectable } from '@nestjs/common';

import { VerificationCodeEntity } from '@modules/auth/domain/entities/verification-code.entity';
import { VerificationCodeRepository } from '@modules/auth/domain/repositories/verification-code.repository';
import { VerificationCodePrismaMapper } from '@modules/auth/infrastructure/mappers/verification-code-prisma.mapper';
import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaVerificationCodeRepository
  extends BasePrismaRepository
  implements VerificationCodeRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(
    entity: VerificationCodeEntity,
  ): Promise<VerificationCodeEntity> {
    const created = await this.prisma.verificationCode.create({
      data: {
        email: entity.email,
        username: entity.username,
        passwordHash: entity.passwordHash,
        code: entity.code,
        expiresAt: entity.expiresAt,
      },
    });

    return VerificationCodePrismaMapper.toDomain(created);
  }

  async findValidByEmailAndCode(
    email: string,
    code: string,
  ): Promise<VerificationCodeEntity | null> {
    const item = await this.prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!item) {
      return null;
    }

    return VerificationCodePrismaMapper.toDomain(item);
  }

  async findLatestPendingByEmail(
    email: string,
  ): Promise<VerificationCodeEntity | null> {
    const item = await this.prisma.verificationCode.findFirst({
      where: {
        email,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!item) {
      return null;
    }

    return VerificationCodePrismaMapper.toDomain(item);
  }

  async invalidateByEmail(email: string): Promise<void> {
    await this.prisma.verificationCode.updateMany({
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
    await this.prisma.verificationCode.update({
      where: { id },
      data: {
        usedAt: new Date(),
      },
    });
  }
}
