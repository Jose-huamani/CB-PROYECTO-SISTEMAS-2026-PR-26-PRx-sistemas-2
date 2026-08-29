import { TownEntity } from '@modules/profiles/domain/entities/town.entity';

export abstract class TownRepository {
  abstract findOrCreateByName(name: string): Promise<TownEntity>;
}
