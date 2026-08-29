import { RepositoryVisibility } from '@generated-prisma/enums';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INTIMATE_REPOSITORY_CONSTANTS } from '@modules/repositories/application/constants/intimate-repository.constants';
import { REPOSITORY_CATEGORY_MESSAGES } from '@modules/repositories/application/constants/repository-category-messages.constants';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryResponseMapper } from '@modules/repositories/application/mappers/repository-response.mapper';
import { GetMeIntimateRepositoryQuery } from '@modules/repositories/application/queries/get-me-intimate-repository/get-me-intimate-repository.query';
import { RepositoryEntity } from '@modules/repositories/domain/entities/repository.entity';
import { RepositoryCategoryRepository } from '@modules/repositories/domain/repositories/repository-category.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

@QueryHandler(GetMeIntimateRepositoryQuery)
export class GetMeIntimateRepositoryHandler implements IQueryHandler<GetMeIntimateRepositoryQuery> {
  constructor(
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryCategoryRepository)
    private readonly repositoryCategoryRepository: RepositoryCategoryRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetMeIntimateRepositoryQuery) {
    const { userId } = query;

    const currentRepository =
      await this.repositoryRepository.findIntimateByOwnerUserId(userId);

    if (currentRepository) {
      return {
        data: RepositoryResponseMapper.toRepositoryResponse(currentRepository),
      };
    }

    const owner = await this.userRepository.findById(userId);

    if (!owner) {
      throw new NotFoundException(REPOSITORY_MESSAGES.OWNER_NOT_FOUND);
    }

    const repositoryCategory =
      await this.repositoryCategoryRepository.findOrCreateByName(
        INTIMATE_REPOSITORY_CONSTANTS.CATEGORY_NAME,
        userId,
      );

    if (!repositoryCategory) {
      throw new BadRequestException(REPOSITORY_CATEGORY_MESSAGES.NOT_AVAILABLE);
    }

    const repositoryEntity = new RepositoryEntity(
      null,
      repositoryCategory.id as number,
      userId,
      owner.username,
      RepositoryVisibility.intimo,
      INTIMATE_REPOSITORY_CONSTANTS.COLOR,
      INTIMATE_REPOSITORY_CONSTANTS.DESCRIPTION,
      repositoryCategory,
      owner,
      [],
      userId,
    );

    const repository =
      await this.repositoryRepository.createIntimate(repositoryEntity);

    return {
      data: RepositoryResponseMapper.toRepositoryResponse(repository),
    };
  }
}
