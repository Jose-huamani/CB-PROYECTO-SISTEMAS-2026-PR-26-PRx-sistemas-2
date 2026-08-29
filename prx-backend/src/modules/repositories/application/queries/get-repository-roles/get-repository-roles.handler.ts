import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RepositoryRoleResponseMapper } from '@modules/repositories/application/mappers/repository-role-response.mapper';
import { GetRepositoryRolesQuery } from '@modules/repositories/application/queries/get-repository-roles/get-repository-roles.query';
import { RepositoryRoleRepository } from '@modules/repositories/domain/repositories/repository-role.repository';

@QueryHandler(GetRepositoryRolesQuery)
export class GetRepositoryRolesHandler implements IQueryHandler<GetRepositoryRolesQuery> {
  constructor(
    @Inject(RepositoryRoleRepository)
    private readonly repositoryRoleRepository: RepositoryRoleRepository,
  ) {}

  async execute() {
    const roles = await this.repositoryRoleRepository.findAll();

    return {
      data: RepositoryRoleResponseMapper.toRepositoryRoleResponseList(roles),
    };
  }
}
