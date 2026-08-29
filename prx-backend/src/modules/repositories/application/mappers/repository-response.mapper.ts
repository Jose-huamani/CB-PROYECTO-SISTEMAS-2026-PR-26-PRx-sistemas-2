import { RepositoryResponseDto } from '@modules/repositories/application/dto/responses/repository-response.dto';
import { RepositoryCategoryResponseMapper } from '@modules/repositories/application/mappers/repository-category-response.mapper';
import { RepositoryFunctionResponseMapper } from '@modules/repositories/application/mappers/repository-function-response.mapper';
import { RepositoryRoleResponseMapper } from '@modules/repositories/application/mappers/repository-role-response.mapper';
import { RepositoryFunctionEntity } from '@modules/repositories/domain/entities/repository-function.entity';
import { RepositoryRoleEntity } from '@modules/repositories/domain/entities/repository-role.entity';
import { RepositoryEntity } from '@modules/repositories/domain/entities/repository.entity';
import { TagResponseMapper } from '@modules/tags/application/mappers/tag-response.mapper';
import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';

export class RepositoryResponseMapper {
  static toRepositoryResponse(
    repository: RepositoryEntity,
    repositoryRole?: RepositoryRoleEntity | null,
    repositoryFunction?: RepositoryFunctionEntity | null,
  ): RepositoryResponseDto {
    let currentUserRepository: RepositoryResponseDto['currentUserRepository'] =
      undefined;

    if (repositoryRole && repositoryFunction) {
      currentUserRepository = {
        role: RepositoryRoleResponseMapper.toRepositoryRoleResponse(
          repositoryRole,
        ),
        function:
          RepositoryFunctionResponseMapper.toRepositoryFunctionResponse(
            repositoryFunction,
          ),
      };
    }

    return {
      id: repository.id as number,
      repositoryCategoryId: repository.repositoryCategoryId,
      ownerUserId: repository.ownerUserId,
      name: repository.name,
      visibility: repository.visibility,
      color: repository.color,
      description: repository.description,
      category: RepositoryCategoryResponseMapper.toRepositoryCategoryResponse(
        repository.category,
      ),
      owner: UserResponseMapper.toUserResponse(repository.owner),
      tags: TagResponseMapper.toTagResponseList(repository.tags),
      currentUserRepository,
      createdAt: repository.createdAt as Date,
      updatedAt: repository.updatedAt as Date,
    };
  }

  static toRepositoryResponseList(
    repositories: RepositoryEntity[],
  ): RepositoryResponseDto[] {
    return repositories.map((repository) =>
      this.toRepositoryResponse(repository),
    );
  }

  static toPaginatedResponse(
    repositories: PaginatedResponseDto<RepositoryEntity>,
  ): PaginatedResponseDto<RepositoryResponseDto> {
    return {
      items: this.toRepositoryResponseList(repositories.items),
      total: repositories.total,
      page: repositories.page,
      limit: repositories.limit,
    };
  }
}
