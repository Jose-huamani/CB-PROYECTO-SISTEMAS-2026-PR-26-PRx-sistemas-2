import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryResponseMapper } from '@modules/repositories/application/mappers/repository-response.mapper';
import { GetRepositoryByIdQuery } from '@modules/repositories/application/queries/get-repository-by-id/get-repository-by-id.query';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';

@QueryHandler(GetRepositoryByIdQuery)
export class GetRepositoryByIdHandler implements IQueryHandler<GetRepositoryByIdQuery> {
  constructor(
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
  ) {}

  async execute(query: GetRepositoryByIdQuery) {
    const { id, userId } = query;

    const repository = await this.repositoryRepository.findById(id);

    if (!repository) {
      throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
    }

    const currentUserRepository =
      await this.repositoryUserRepository.findByRepositoryIdAndUserId(
        id,
        userId,
      );

    return {
      data: RepositoryResponseMapper.toRepositoryResponse(
        repository,
        currentUserRepository?.repositoryRole ?? null,
        currentUserRepository?.repositoryFunction ?? null,
      ),
    };
  }
}
