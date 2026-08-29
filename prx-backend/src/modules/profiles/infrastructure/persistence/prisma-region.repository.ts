import { Injectable } from '@nestjs/common';

import { RegionRepository } from '@modules/profiles/domain/repositories/region.repository';
import { RegionPrismaMapper } from '@modules/profiles/infrastructure/mappers/region-prisma.mapper';
import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { RegionEntity } from '@modules/profiles/domain/entities/region.entity';

@Injectable()
export class PrismaRegionRepository
  extends BasePrismaRepository
  implements RegionRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findOrCreateByName(name: string): Promise<RegionEntity> {
    const upperName = name?.toUpperCase();

    const existing = await this.prisma.region.findFirst({ where: { name: upperName } });

    if (existing) {
      if (existing.status === 1) {
        return RegionPrismaMapper.toDomain(existing);
      }

      const updated = await this.prisma.region.update({
        where: { id: existing.id },
        data: { status: 1 },
      });

      return RegionPrismaMapper.toDomain(updated);
    }

    const created = await this.prisma.region.create({ data: { name: upperName, status: 1 } });

    return RegionPrismaMapper.toDomain(created);
  }
}
