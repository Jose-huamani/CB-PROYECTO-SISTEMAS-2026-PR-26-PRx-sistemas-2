import { RegionEntity } from '@modules/profiles/domain/entities/region.entity';

export abstract class RegionRepository {
  abstract findOrCreateByName(name: string): Promise<RegionEntity>;
}
