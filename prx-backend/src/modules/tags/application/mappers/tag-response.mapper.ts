import { TagResponseDto } from '@modules/tags/application/dto/responses/tag-response.dto';
import { TagEntity } from '@modules/tags/domain/entities/tag.entity';

export class TagResponseMapper {
  static toTagResponse(tag: TagEntity): TagResponseDto {
    return {
      id: tag.id as number,
      name: tag.name,
    };
  }

  static toTagResponseList(tags: TagEntity[]): TagResponseDto[] {
    return tags.map((tag) => this.toTagResponse(tag));
  }
}
