import { Injectable } from '@nestjs/common';

import { TagEntity } from '@modules/tags/domain/entities/tag.entity';
import { TagPrismaMapper } from '@modules/tags/infrastructure/mappers/tag-prisma.mapper';
import { TagProfileEntity } from '@modules/profiles/domain/entities/tag-profile.entity';
import { TagProfileRepository } from '@modules/profiles/domain/repositories/tag-profile.repository';
import { TagProfilePrismaMapper } from '@modules/profiles/infrastructure/mappers/tag-profile-prisma.mapper';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaTagProfileRepository implements TagProfileRepository {
    constructor(private readonly prisma: PrismaService) { }

    async search(search?: string, limit?: number): Promise<TagEntity[]> {
        const tags = await this.prisma.tag.findMany({
            where: {
                status: 1,
                name: search
                    ? {
                        contains: search,
                    }
                    : undefined,
            },
            orderBy: {
                name: 'asc',
            },
            take: limit ?? 10,
        });

        return TagPrismaMapper.toDomainList(tags);
    }

    async findByName(name: string): Promise<TagEntity | null> {
        const tag = await this.prisma.tag.findUnique({
            where: {
                name,
            },
        });

        if (!tag || tag.status !== 1) {
            return null;
        }

        return TagPrismaMapper.toDomain(tag);
    }

    async findByProfileId(profileId: number): Promise<TagProfileEntity[]> {
        const tagProfiles = await this.prisma.tagProfile.findMany({
            where: {
                profileId,
                status: 1,
            },
            include: {
                tag: true,
            },
            orderBy: {
                id: 'asc',
            },
        });

        return TagProfilePrismaMapper.toDomainList(tagProfiles);
    }

    async syncByProfileId(
        profileId: number,
        tags: TagEntity[],
        updatedBy: number,
    ): Promise<TagProfileEntity[]> {
        const tagIds = TagProfilePrismaMapper.toTagIds(tags);

        await this.prisma.$transaction(async (tx) => {
            const currentTagProfiles = await tx.tagProfile.findMany({
                where: {
                    profileId,
                },
                select: {
                    id: true,
                    tagId: true,
                    status: true,
                },
            });

            const tagProfileIds = new Set(tagIds);
            const tagProfilesToDisable = currentTagProfiles.filter(
                (tagProfile) => tagProfile.status === 1 && !tagProfileIds.has(tagProfile.tagId),
            );

            for (const tagProfile of tagProfilesToDisable) {
                await tx.tagProfile.update({
                    where: {
                        id: tagProfile.id,
                    },
                    data: {
                        status: 0,
                        updatedBy,
                    },
                });
            }

            for (const tagId of tagIds) {
                const tagProfile = currentTagProfiles.find(
                    (currentTagProfile) => currentTagProfile.tagId === tagId,
                );

                if (!tagProfile) {
                    await tx.tagProfile.create({
                        data: {
                            profileId,
                            tagId,
                            createdBy: updatedBy,
                        },
                    });

                    continue;
                }

                if (tagProfile.status === 0) {
                    await tx.tagProfile.update({
                        where: {
                            id: tagProfile.id,
                        },
                        data: {
                            status: 1,
                            updatedBy,
                        },
                    });
                }
            }
        });

        return this.findByProfileId(profileId);
    }
}
