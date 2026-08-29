import { RepositoryUserResponseDto } from '@modules/repositories/application/dto/responses/repository-user-response.dto';
import { RepositoryFunctionResponseMapper } from '@modules/repositories/application/mappers/repository-function-response.mapper';
import { RepositoryResponseMapper } from '@modules/repositories/application/mappers/repository-response.mapper';
import { RepositoryRoleResponseMapper } from '@modules/repositories/application/mappers/repository-role-response.mapper';
import { RepositoryUserEntity } from '@modules/repositories/domain/entities/repository-user.entity';
import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';

export class RepositoryUserResponseMapper {
  static toRepositoryUserResponse(
    repositoryUser: RepositoryUserEntity,
  ): RepositoryUserResponseDto {
    return {
      id: repositoryUser.id as number,
      repositoryId: repositoryUser.repositoryId,
      userId: repositoryUser.userId,
      repositoryRoleId: repositoryUser.repositoryRoleId,
      repositoryFunctionId: repositoryUser.repositoryFunctionId,
      repository: repositoryUser.repository
        ? RepositoryResponseMapper.toRepositoryResponse(
            repositoryUser.repository,
          )
        : undefined,
      user: repositoryUser.user
        ? UserResponseMapper.toUserResponse(repositoryUser.user)
        : undefined,
      role: RepositoryRoleResponseMapper.toRepositoryRoleResponse(
        repositoryUser.repositoryRole!,
      ),
      function: RepositoryFunctionResponseMapper.toRepositoryFunctionResponse(
        repositoryUser.repositoryFunction!,
      ),
      createdAt: repositoryUser.createdAt as Date,
      updatedAt: repositoryUser.updatedAt as Date,
    };
  }

  static toRepositoryUserResponseList(
    repositoryUsers: RepositoryUserEntity[],
  ): RepositoryUserResponseDto[] {
    return repositoryUsers.map((repositoryUser) =>
      this.toRepositoryUserResponse(repositoryUser),
    );
  }

  static toPaginatedResponse(
    paginatedRepositoryUsers: PaginatedResponseDto<RepositoryUserEntity>,
  ): PaginatedResponseDto<RepositoryUserResponseDto> {
    return {
      items: this.toRepositoryUserResponseList(paginatedRepositoryUsers.items),
      total: paginatedRepositoryUsers.total,
      page: paginatedRepositoryUsers.page,
      limit: paginatedRepositoryUsers.limit,
    };
  }
}
