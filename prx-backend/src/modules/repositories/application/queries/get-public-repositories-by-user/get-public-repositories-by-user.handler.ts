import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RepositoryResponseMapper } from '@modules/repositories/application/mappers/repository-response.mapper';
import { GetPublicRepositoriesByUserQuery } from '@modules/repositories/application/queries/get-public-repositories-by-user/get-public-repositories-by-user.query';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

@QueryHandler(GetPublicRepositoriesByUserQuery)
export class GetPublicRepositoriesByUserHandler implements IQueryHandler<GetPublicRepositoriesByUserQuery> {
  constructor(
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
  ) {}

  async execute(query: GetPublicRepositoriesByUserQuery) {
    const { userId, dto } = query;

    const repositories =
      await this.repositoryRepository.findPublicByOwnerUserId(
        userId,
        dto.limit,
      );

    return {
      data: RepositoryResponseMapper.toRepositoryResponseList(repositories),
    };
  }
}
