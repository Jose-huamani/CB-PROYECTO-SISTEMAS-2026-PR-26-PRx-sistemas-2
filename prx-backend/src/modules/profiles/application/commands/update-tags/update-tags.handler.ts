import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateTagsCommand } from '@modules/profiles/application/commands/update-tags/update-tags.command';
import { PROFILE_MESSAGES } from '@modules/profiles/application/constants/profile-messages.constants';
import { TagProfileRepository } from '@modules/profiles/domain/repositories/tag-profile.repository';
import { TAG_MESSAGES } from '@modules/tags/application/constants/tag-messages.constants';
import { TagEntity } from '@modules/tags/domain/entities/tag.entity';
import { TagRepository } from '@modules/tags/domain/repositories/tag.repository';

@CommandHandler(UpdateTagsCommand)
export class UpdateTagsHandler implements ICommandHandler<UpdateTagsCommand> {
    constructor(
        @Inject(TagRepository)
        private readonly tagRepository: TagRepository,
        @Inject(TagProfileRepository)
        private readonly tagProfileRepository: TagProfileRepository,
    ) { }

    async execute(command: UpdateTagsCommand): Promise<void> {
        if (!command.profileId) {
            throw new BadRequestException(PROFILE_MESSAGES.NOT_FOUND);
        }

        const uniqueNames = [...new Set((command.tags ?? []).map((tag) => tag.name).filter(Boolean))];
        const tagEntities: TagEntity[] = [];

        for (const name of uniqueNames) {
            const tag = await this.tagRepository.findOrCreateByName(name);

            if (!tag) {
                throw new BadRequestException(TAG_MESSAGES.NOT_AVAILABLE(name));
            }

            tagEntities.push(tag);
        }

        await this.tagProfileRepository.syncByProfileId(
            command.profileId,
            tagEntities,
            command.updatedBy,
        );
    }
}
