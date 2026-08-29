import { TownEntity } from '@modules/profiles/domain/entities/town.entity';

type TownPrismaModel = {
  id: number;
  name: string;
  status: number;
};

export class TownPrismaMapper {
  static toDomain(town: TownPrismaModel): TownEntity {
    return new TownEntity(town.id, town.name, town.status);
  }
}
