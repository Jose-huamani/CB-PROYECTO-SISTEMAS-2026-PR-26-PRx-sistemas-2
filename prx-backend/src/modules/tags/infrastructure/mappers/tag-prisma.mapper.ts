import { TagEntity } from '@modules/tags/domain/entities/tag.entity';

type TagPrismaModel = {
  id: number;
  name: string;
  status: number;
};

export class TagPrismaMapper {
  static toDomain(item: TagPrismaModel): TagEntity {
    return new TagEntity(item.id, item.name, item.status);
  }

  static toDomainList(tags: TagPrismaModel[]): TagEntity[] {
    return tags.map((tag) => this.toDomain(tag));
  }
}
