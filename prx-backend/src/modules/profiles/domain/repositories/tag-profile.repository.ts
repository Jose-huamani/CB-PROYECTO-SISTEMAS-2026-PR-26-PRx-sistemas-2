import { TagEntity } from '@modules/tags/domain/entities/tag.entity';

import { TagProfileEntity } from '@modules/profiles/domain/entities/tag-profile.entity';

export abstract class TagProfileRepository {
    abstract search(search?: string, limit?: number): Promise<TagEntity[]>;

    abstract findByName(name: string): Promise<TagEntity | null>;

    abstract findByProfileId(profileId: number): Promise<TagProfileEntity[]>;

    abstract syncByProfileId(
        profileId: number,
        tags: TagEntity[],
        updatedBy: number,
    ): Promise<TagProfileEntity[]>;
}
