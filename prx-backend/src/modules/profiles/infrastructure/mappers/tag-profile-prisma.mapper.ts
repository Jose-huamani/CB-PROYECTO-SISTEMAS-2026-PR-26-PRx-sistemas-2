import { TagEntity } from '@modules/tags/domain/entities/tag.entity';
import { TagPrismaMapper } from '@modules/tags/infrastructure/mappers/tag-prisma.mapper';
import { TagProfileEntity } from '@modules/profiles/domain/entities/tag-profile.entity';

type TagModel = {
    id: number;
    name: string;
    status: number;
};

type TagProfileModel = {
    id: number;
    profileId: number;
    tagId: number;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
};

type TagProfilePrismaModel = TagProfileModel & {
    tag?: TagModel | null;
};

export class TagProfilePrismaMapper {
    static toDomain(tagProfile: TagProfilePrismaModel): TagProfileEntity {
        return new TagProfileEntity(
            tagProfile.id,
            tagProfile.profileId,
            tagProfile.tagId,
            tagProfile.createdBy,
            tagProfile.status,
            tagProfile.createdAt,
            tagProfile.updatedAt,
            tagProfile.updatedBy ?? undefined,
            tagProfile.tag ? TagPrismaMapper.toDomain(tagProfile.tag) : undefined,
        );
    }

    static toDomainList(tagProfiles: TagProfilePrismaModel[]): TagProfileEntity[] {
        return tagProfiles.map((tagProfile) => this.toDomain(tagProfile));
    }

    static toTagIds(tags: TagEntity[]): number[] {
        return tags
            .map((tag) => tag.id as number)
            .filter((tagId) => Number.isInteger(tagId) && tagId > 0);
    }
}
