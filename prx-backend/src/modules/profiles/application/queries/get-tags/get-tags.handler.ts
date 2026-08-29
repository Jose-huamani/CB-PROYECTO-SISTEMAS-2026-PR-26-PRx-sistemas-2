import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetTagsQuery } from '@modules/profiles/application/queries/get-tags/get-tags.query';
import { TagProfileRepository } from '@modules/profiles/domain/repositories/tag-profile.repository';
import { TagResponseMapper } from '@modules/tags/application/mappers/tag-response.mapper';

const DEFAULT_LIMIT = 10;

@QueryHandler(GetTagsQuery)
export class GetTagsHandler implements IQueryHandler<GetTagsQuery> {
    constructor(
        @Inject(TagProfileRepository)
        private readonly tagProfileRepository: TagProfileRepository,
    ) { }

    async execute(query: GetTagsQuery) {
        const { search, limit } = query.dto;

        const tags = await this.tagProfileRepository.search(search, limit ?? DEFAULT_LIMIT);

        return {
            data: TagResponseMapper.toTagResponseList(tags),
        };
    }
}
