import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RepositoryResponseMapper } from '@modules/repositories/application/mappers/repository-response.mapper';
import { GetExploreRepositoriesQuery } from '@modules/repositories/application/queries/get-explore-repositories/get-explore-repositories.query';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

@QueryHandler(GetExploreRepositoriesQuery)
export class GetExploreRepositoriesHandler implements IQueryHandler<GetExploreRepositoriesQuery> {
  constructor(
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
  ) {}

  async execute(query: GetExploreRepositoriesQuery) {
    const { dto } = query;

    const repositories = await this.repositoryRepository.findPaginatedExplore(
      dto.page,
      dto.limit,
      dto.search,
      dto.owner,
      dto.category,
    );

    return {
      data: RepositoryResponseMapper.toPaginatedResponse(repositories),
    };
  }
}
