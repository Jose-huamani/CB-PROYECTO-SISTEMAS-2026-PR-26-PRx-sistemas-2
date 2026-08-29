import { Injectable } from '@nestjs/common';

import { TownRepository } from '@modules/profiles/domain/repositories/town.repository';
import { TownPrismaMapper } from '@modules/profiles/infrastructure/mappers/town-prisma.mapper';
import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { TownEntity } from '@modules/profiles/domain/entities/town.entity';

@Injectable()
export class PrismaTownRepository
  extends BasePrismaRepository
  implements TownRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findOrCreateByName(name: string): Promise<TownEntity> {
    const upperName = name?.toUpperCase();

    const existing = await this.prisma.town.findFirst({ where: { name: upperName } });

    if (existing) {
      if (existing.status === 1) {
        return TownPrismaMapper.toDomain(existing);
      }

      const updated = await this.prisma.town.update({
        where: { id: existing.id },
        data: { status: 1 },
      });

      return TownPrismaMapper.toDomain(updated);
    }

    const created = await this.prisma.town.create({ data: { name: upperName, status: 1 } });

    return TownPrismaMapper.toDomain(created);
  }
}
