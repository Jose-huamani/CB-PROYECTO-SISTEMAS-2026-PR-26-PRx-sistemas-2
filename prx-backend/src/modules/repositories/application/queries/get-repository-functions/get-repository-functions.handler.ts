import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RepositoryFunctionResponseMapper } from '@modules/repositories/application/mappers/repository-function-response.mapper';
import { GetRepositoryFunctionsQuery } from '@modules/repositories/application/queries/get-repository-functions/get-repository-functions.query';
import { RepositoryFunctionRepository } from '@modules/repositories/domain/repositories/repository-function.repository';

@QueryHandler(GetRepositoryFunctionsQuery)
export class GetRepositoryFunctionsHandler implements IQueryHandler<GetRepositoryFunctionsQuery> {
  constructor(
    @Inject(RepositoryFunctionRepository)
    private readonly repositoryFunctionRepository: RepositoryFunctionRepository,
  ) {}

  async execute() {
    const functions = await this.repositoryFunctionRepository.findAll();

    return {
      data: RepositoryFunctionResponseMapper.toRepositoryFunctionResponseList(
        functions,
      ),
    };
  }
}
