import { BinnacleEntity } from '@modules/binnacles/domain/entities/binnacle.entity';

export class BinnaclePrismaMapper {
  static toDomain(binnacle: {
    id: number;
    userId: number;
    name: string;
    content: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
  }): BinnacleEntity {
    return new BinnacleEntity(
      binnacle.id,
      binnacle.userId,
      binnacle.content,
      binnacle.name,
      binnacle.createdBy,
      binnacle.status,
      binnacle.createdAt,
      binnacle.updatedAt,
      binnacle.updatedBy ?? undefined,
    );
  }
}
