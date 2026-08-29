import { RegionEntity } from '@modules/profiles/domain/entities/region.entity';

type RegionPrismaModel = {
  id: number;
  name: string;
  status: number;
};

export class RegionPrismaMapper {
  static toDomain(region: RegionPrismaModel): RegionEntity {
    return new RegionEntity(region.id, region.name, region.status);
  }
}
