import { BinnacleEntity } from '@modules/binnacles/domain/entities/binnacle.entity';
import { BinnacleRepository } from '@modules/binnacles/domain/repositories/binnacle.repository';
import { BinnaclePrismaMapper } from '@modules/binnacles/infrastructure/mappers/binnacle-prisma.mapper';
import { Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaBinnacleRepository implements BinnacleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPaginatedMe(
    page: number,
    limit: number,
    userId: number,
  ): Promise<PaginatedResponseDto<BinnacleEntity>> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.binnacle.findMany({
        where: { status: 1, userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.binnacle.count({ where: { status: 1, userId } }),
    ]);
    return {
      items: items.map(BinnaclePrismaMapper.toDomain),
      total,
      page,
      limit,
    };
  }

  async create(entity: BinnacleEntity): Promise<BinnacleEntity> {
    const created = await this.prisma.binnacle.create({
      data: {
        userId: entity.userId,
        name: entity.name,
        content: entity.content,
        createdBy: entity.createdBy,
      },
    });
    return BinnaclePrismaMapper.toDomain(created);
  }

  async findById(id: number): Promise<BinnacleEntity | null> {
    const binnacle = await this.prisma.binnacle.findFirst({
      where: { id, status: 1 },
    });
    return binnacle ? BinnaclePrismaMapper.toDomain(binnacle) : null;
  }

  async softDelete(id: number, updatedBy: number): Promise<void> {
    await this.prisma.binnacle.update({
      where: { id, status: 1 },
      data: {
        status: 0,
        updatedBy: updatedBy,
      },
    });
  }
}
