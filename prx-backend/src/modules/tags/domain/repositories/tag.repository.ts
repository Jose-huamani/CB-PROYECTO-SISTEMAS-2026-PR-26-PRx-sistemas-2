import { TagEntity } from '@modules/tags/domain/entities/tag.entity';

export abstract class TagRepository {
  abstract findOrCreateByName(name: string): Promise<TagEntity | null>;
}
