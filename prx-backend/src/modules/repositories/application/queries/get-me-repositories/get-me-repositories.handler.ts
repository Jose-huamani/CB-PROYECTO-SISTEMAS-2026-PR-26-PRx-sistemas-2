import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RepositoryResponseMapper } from '@modules/repositories/application/mappers/repository-response.mapper';
import { GetMeRepositoriesQuery } from '@modules/repositories/application/queries/get-me-repositories/get-me-repositories.query';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

@QueryHandler(GetMeRepositoriesQuery)
export class GetMeRepositoriesHandler implements IQueryHandler<GetMeRepositoriesQuery> {
  constructor(
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
  ) {}

  async execute(query: GetMeRepositoriesQuery) {
    const { dto, userId } = query;

    const repositories = await this.repositoryRepository.findPaginatedMe(
      dto.page,
      dto.limit,
      userId,
      dto.search,
      dto.role,
      dto.category,
      dto.visibility,
    );

    return {
      data: RepositoryResponseMapper.toPaginatedResponse(repositories),
    };
  }
}
