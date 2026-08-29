import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryUserResponseMapper } from '@modules/repositories/application/mappers/repository-user-response.mapper';
import { GetRepositoryUsersQuery } from '@modules/repositories/application/queries/get-repository-users/get-repository-users.query';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

@QueryHandler(GetRepositoryUsersQuery)
export class GetRepositoryUsersHandler implements IQueryHandler<GetRepositoryUsersQuery> {
  constructor(
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
  ) {}

  async execute(query: GetRepositoryUsersQuery) {
    const { repositoryId, dto } = query;

    const repository = await this.repositoryRepository.findById(repositoryId);

    if (!repository) {
      throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
    }

    const repositoryUsers =
      await this.repositoryUserRepository.findPaginatedByRepositoryId(
        repositoryId,
        dto.page,
        dto.limit,
        dto.search,
        dto.role,
        dto.function,
        dto.scope,
      );

    return {
      data: RepositoryUserResponseMapper.toPaginatedResponse(repositoryUsers),
    };
  }
}
