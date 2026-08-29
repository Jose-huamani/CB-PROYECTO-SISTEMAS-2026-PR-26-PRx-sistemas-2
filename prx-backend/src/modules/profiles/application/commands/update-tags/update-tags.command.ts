import { CreateTagDto } from '@modules/tags/application/dto/requests/create-tag.dto';

export class UpdateTagsCommand {
    constructor(
        public readonly profileId: number,
        public readonly tags: CreateTagDto[] | undefined,
        public readonly updatedBy: number,
    ) { }
}
