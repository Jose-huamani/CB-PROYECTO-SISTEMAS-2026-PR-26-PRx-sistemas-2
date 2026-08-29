import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RepositoryCategoryResponseMapper } from '@modules/repositories/application/mappers/repository-category-response.mapper';
import { GetRepositoryCategoriesQuery } from '@modules/repositories/application/queries/get-repository-categories/get-repository-categories.query';
import { RepositoryCategoryRepository } from '@modules/repositories/domain/repositories/repository-category.repository';

const DEFAULT_LIMIT = 10;

@QueryHandler(GetRepositoryCategoriesQuery)
export class GetRepositoryCategoriesHandler implements IQueryHandler<GetRepositoryCategoriesQuery> {
  constructor(
    @Inject(RepositoryCategoryRepository)
    private readonly repositoryCategoryRepository: RepositoryCategoryRepository,
  ) {}

  async execute(query: GetRepositoryCategoriesQuery) {
    const { search, limit } = query.dto;

    const repositoryCategories =
      await this.repositoryCategoryRepository.searchByName(
        search,
        limit ?? DEFAULT_LIMIT,
      );

    return {
      data: RepositoryCategoryResponseMapper.toRepositoryCategoryResponseList(
        repositoryCategories,
      ),
    };
  }
}
